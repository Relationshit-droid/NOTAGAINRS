"""
Observability Module
Sentry integration, OpenTelemetry tracing, and custom metrics
"""

import os
import time
import functools
from typing import Optional, Dict, Any, Callable
from contextlib import contextmanager
from datetime import datetime, timezone

# Sentry integration
try:
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    from sentry_sdk.integrations.redis import RedisIntegration
    SENTRY_AVAILABLE = True
except ImportError:
    SENTRY_AVAILABLE = False

# OpenTelemetry
try:
    from opentelemetry import trace
    from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor
    from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
    from opentelemetry.instrumentation.redis import RedisInstrumentor
    OTEL_AVAILABLE = True
except ImportError:
    OTEL_AVAILABLE = False


# =============================================================================
# Sentry Configuration
# =============================================================================

def init_sentry():
    """Initialize Sentry error tracking"""
    dsn = os.environ.get('SENTRY_DSN')
    
    if not dsn or not SENTRY_AVAILABLE:
        print("[Observability] Sentry not configured")
        return False
    
    environment = os.environ.get('ENVIRONMENT', 'development')
    release = os.environ.get('APP_VERSION', '2.0.0')
    
    sentry_sdk.init(
        dsn=dsn,
        environment=environment,
        release=release,
        traces_sample_rate=0.1,  # 10% of requests
        profiles_sample_rate=0.1,
        integrations=[
            FastApiIntegration(),
            RedisIntegration(),
        ],
        before_send=before_send_event,
    )
    
    print(f"[Observability] Sentry initialized ({environment})")
    return True


def before_send_event(event, hint):
    """Filter sensitive data before sending to Sentry"""
    # Remove sensitive headers
    if 'request' in event:
        headers = event['request'].get('headers', {})
        sensitive_headers = ['authorization', 'cookie', 'x-api-key']
        for header in sensitive_headers:
            if header in headers:
                headers[header] = '[FILTERED]'
    
    # Remove sensitive user data
    if 'user' in event:
        user = event['user']
        if 'email' in user:
            user['email'] = hash_email(user['email'])
    
    return event


def hash_email(email: str) -> str:
    """Hash email for privacy"""
    import hashlib
    return hashlib.sha256(email.encode()).hexdigest()[:16]


# =============================================================================
# OpenTelemetry Configuration
# =============================================================================

def init_opentelemetry(app=None):
    """Initialize OpenTelemetry tracing"""
    if not OTEL_AVAILABLE:
        print("[Observability] OpenTelemetry not available")
        return None
    
    # Configure tracer provider
    provider = TracerProvider()
    
    # Add OTLP exporter if endpoint configured
    otlp_endpoint = os.environ.get('OTEL_EXPORTER_OTLP_ENDPOINT')
    if otlp_endpoint:
        exporter = OTLPSpanExporter(endpoint=otlp_endpoint)
        processor = BatchSpanProcessor(exporter)
        provider.add_span_processor(processor)
    
    trace.set_tracer_provider(provider)
    
    # Instrument FastAPI
    if app:
        FastAPIInstrumentor.instrument_app(app)
    
    # Instrument Redis
    try:
        RedisInstrumentor().instrument()
    except:
        pass
    
    print("[Observability] OpenTelemetry initialized")
    return provider


# =============================================================================
# Custom Tracing
# =============================================================================

class Tracer:
    """Custom tracer wrapper"""
    
    def __init__(self):
        self._tracer = trace.get_tracer(__name__) if OTEL_AVAILABLE else None
    
    @contextmanager
    def span(self, name: str, attributes: Optional[Dict] = None):
        """Create a tracing span"""
        if not self._tracer:
            yield None
            return
        
        with self._tracer.start_as_current_span(name) as span:
            if attributes:
                for key, value in attributes.items():
                    span.set_attribute(key, value)
            yield span
    
    def trace_method(self, name: Optional[str] = None):
        """Decorator to trace a method"""
        def decorator(func: Callable) -> Callable:
            span_name = name or func.__name__
            
            @functools.wraps(func)
            async def async_wrapper(*args, **kwargs):
                with self.span(span_name, {
                    'function': func.__name__,
                    'module': func.__module__
                }):
                    return await func(*args, **kwargs)
            
            @functools.wraps(func)
            def sync_wrapper(*args, **kwargs):
                with self.span(span_name, {
                    'function': func.__name__,
                    'module': func.__module__
                }):
                    return func(*args, **kwargs)
            
            return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper
        return decorator


tracer = Tracer()


# =============================================================================
# Metrics Collection
# =============================================================================

class Metrics:
    """Custom metrics collector"""
    
    def __init__(self):
        self.counters: Dict[str, int] = {}
        self.gauges: Dict[str, float] = {}
        self.histograms: Dict[str, list] = {}
        self.timers: Dict[str, list] = {}
    
    def increment(self, name: str, value: int = 1, tags: Optional[Dict] = None):
        """Increment a counter"""
        key = self._make_key(name, tags)
        self.counters[key] = self.counters.get(key, 0) + value
    
    def gauge(self, name: str, value: float, tags: Optional[Dict] = None):
        """Set a gauge value"""
        key = self._make_key(name, tags)
        self.gauges[key] = value
    
    def histogram(self, name: str, value: float, tags: Optional[Dict] = None):
        """Record a histogram value"""
        key = self._make_key(name, tags)
        if key not in self.histograms:
            self.histograms[key] = []
        self.histograms[key].append(value)
    
    def timer(self, name: str, duration_ms: float, tags: Optional[Dict] = None):
        """Record a timer value"""
        key = self._make_key(name, tags)
        if key not in self.timers:
            self.timers[key] = []
        self.timers[key].append(duration_ms)
    
    @contextmanager
    def timed(self, name: str, tags: Optional[Dict] = None):
        """Context manager for timing operations"""
        start = time.time()
        try:
            yield
        finally:
            duration_ms = (time.time() - start) * 1000
            self.timer(name, duration_ms, tags)
    
    def _make_key(self, name: str, tags: Optional[Dict]) -> str:
        """Create metric key from name and tags"""
        if not tags:
            return name
        
        tag_str = ','.join(f"{k}={v}" for k, v in sorted(tags.items()))
        return f"{name}[{tag_str}]"
    
    def get_summary(self) -> Dict:
        """Get metrics summary"""
        summary = {
            'counters': dict(self.counters),
            'gauges': dict(self.gauges),
            'histograms': {
                k: {
                    'count': len(v),
                    'min': min(v) if v else 0,
                    'max': max(v) if v else 0,
                    'avg': sum(v) / len(v) if v else 0,
                }
                for k, v in self.histograms.items()
            },
            'timers': {
                k: {
                    'count': len(v),
                    'p50': self._percentile(v, 50),
                    'p95': self._percentile(v, 95),
                    'p99': self._percentile(v, 99),
                }
                for k, v in self.timers.items()
            }
        }
        return summary
    
    def _percentile(self, data: list, percentile: int) -> float:
        """Calculate percentile"""
        if not data:
            return 0
        sorted_data = sorted(data)
        index = int(len(sorted_data) * percentile / 100)
        return sorted_data[min(index, len(sorted_data) - 1)]
    
    def reset(self):
        """Reset all metrics"""
        self.counters.clear()
        self.gauges.clear()
        self.histograms.clear()
        self.timers.clear()


metrics = Metrics()


# =============================================================================
# Error Tracking
# =============================================================================

def capture_exception(error: Exception, context: Optional[Dict] = None):
    """Capture exception for monitoring"""
    # Send to Sentry
    if SENTRY_AVAILABLE and sentry_sdk.Hub.current.client:
        with sentry_sdk.push_scope() as scope:
            if context:
                for key, value in context.items():
                    scope.set_extra(key, value)
            sentry_sdk.capture_exception(error)
    
    # Log locally
    print(f"[Error] {type(error).__name__}: {error}")
    if context:
        print(f"  Context: {context}")


def capture_message(message: str, level: str = 'info', context: Optional[Dict] = None):
    """Capture message for monitoring"""
    # Send to Sentry
    if SENTRY_AVAILABLE and sentry_sdk.Hub.current.client:
        with sentry_sdk.push_scope() as scope:
            if context:
                for key, value in context.items():
                    scope.set_extra(key, value)
            sentry_sdk.capture_message(message, level)
    
    # Log locally
    print(f"[{level.upper()}] {message}")


# =============================================================================
# Business Event Tracking
# =============================================================================

def track_sos_trigger(user_id: str, couple_id: Optional[str], severity: int):
    """Track SOS trigger event"""
    metrics.increment('sos.triggered', tags={'severity': str(severity)})
    
    capture_message(
        f'SOS triggered by user {user_id}',
        level='warning',
        context={'user_id': user_id, 'couple_id': couple_id, 'severity': severity}
    )


def track_game_completion(session_id: str, game_id: str, score: int, duration_ms: float):
    """Track game completion"""
    metrics.increment('game.completed', tags={'game_id': game_id})
    metrics.timer('game.duration', duration_ms, tags={'game_id': game_id})
    metrics.histogram('game.score', score, tags={'game_id': game_id})


def track_websocket_disconnect(couple_id: str, duration_ms: float, reason: str):
    """Track WebSocket disconnection"""
    metrics.increment('websocket.disconnected', tags={'reason': reason})
    metrics.timer('websocket.session_duration', duration_ms)


def track_ai_failure(user_id: str, error_type: str, game_context: Optional[str] = None):
    """Track AI service failure"""
    metrics.increment('ai.failure', tags={'error_type': error_type})
    
    capture_message(
        f'AI failure for user {user_id}',
        level='error',
        context={'user_id': user_id, 'error_type': error_type, 'game_context': game_context}
    )


def track_slow_endpoint(endpoint: str, duration_ms: float, threshold_ms: float = 1000):
    """Track slow endpoint"""
    if duration_ms > threshold_ms:
        metrics.increment('endpoint.slow', tags={'endpoint': endpoint})
        
        capture_message(
            f'Slow endpoint: {endpoint} ({duration_ms:.0f}ms)',
            level='warning',
            context={'endpoint': endpoint, 'duration_ms': duration_ms}
        )


# =============================================================================
# Health Check
# =============================================================================

def get_health_status() -> Dict:
    """Get observability health status"""
    return {
        'sentry': {
            'enabled': SENTRY_AVAILABLE,
            'configured': bool(os.environ.get('SENTRY_DSN')),
        },
        'opentelemetry': {
            'enabled': OTEL_AVAILABLE,
            'configured': bool(os.environ.get('OTEL_EXPORTER_OTLP_ENDPOINT')),
        },
        'metrics': metrics.get_summary(),
        'timestamp': datetime.now(timezone.utc).isoformat(),
    }


# =============================================================================
# Import fix
# =============================================================================

import asyncio

__all__ = [
    'init_sentry',
    'init_opentelemetry',
    'tracer',
    'metrics',
    'capture_exception',
    'capture_message',
    'track_sos_trigger',
    'track_game_completion',
    'track_websocket_disconnect',
    'track_ai_failure',
    'track_slow_endpoint',
    'get_health_status',
]
