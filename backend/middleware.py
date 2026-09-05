"""
FastAPI Middleware
Structured logging, validation, and error handling
"""

import time
import uuid
import json
from typing import Callable
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import structlog

# Configure structured logging
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ]
)

logger = structlog.get_logger()


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log all requests with structured data"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = str(uuid.uuid4())[:8]
        request.state.request_id = request_id
        
        start_time = time.time()
        
        # Log request
        logger.info(
            "request_started",
            request_id=request_id,
            method=request.method,
            path=request.url.path,
            client_ip=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
        )
        
        try:
            response = await call_next(request)
            
            # Calculate duration
            duration_ms = (time.time() - start_time) * 1000
            
            # Log response
            logger.info(
                "request_completed",
                request_id=request_id,
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                duration_ms=round(duration_ms, 2),
            )
            
            # Add headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Response-Time"] = f"{duration_ms:.2f}ms"
            
            return response
            
        except Exception as e:
            duration_ms = (time.time() - start_time) * 1000
            
            logger.error(
                "request_failed",
                request_id=request_id,
                method=request.method,
                path=request.url.path,
                error=str(e),
                duration_ms=round(duration_ms, 2),
            )
            
            raise


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Global error handling with consistent responses"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        try:
            return await call_next(request)
            
        except Exception as e:
            request_id = getattr(request.state, "request_id", "unknown")
            
            # Log the error
            logger.error(
                "unhandled_exception",
                request_id=request_id,
                error=str(e),
                error_type=type(e).__name__,
            )
            
            # Return safe error response
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal server error",
                    "message": "An unexpected error occurred. Please try again.",
                    "request_id": request_id,
                }
            )


class CORSMiddleware:
    """CORS configuration (already handled by FastAPI, but can be customized here)"""
    pass


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Basic rate limiting (use Redis in production)"""
    
    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests: dict = {}  # In production, use Redis
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        client_ip = request.client.host if request.client else "unknown"
        
        # Simple in-memory rate limiting (use Redis in production)
        current_time = time.time()
        window_start = current_time - 60
        
        if client_ip not in self.requests:
            self.requests[client_ip] = []
        
        # Clean old requests
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if req_time > window_start
        ]
        
        # Check limit
        if len(self.requests[client_ip]) >= self.requests_per_minute:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Rate limit exceeded",
                    "message": f"Limit: {self.requests_per_minute} requests per minute",
                    "retry_after": 60
                }
            )
        
        # Record request
        self.requests[client_ip].append(current_time)
        
        return await call_next(request)


class ValidationMiddleware(BaseHTTPMiddleware):
    """Request validation helpers"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Add request validation here if needed
        return await call_next(request)


def setup_middleware(app):
    """Apply all middleware to the app"""
    
    # Request logging
    app.add_middleware(RequestLoggingMiddleware)
    
    # Error handling
    app.add_middleware(ErrorHandlingMiddleware)
    
    # Rate limiting (optional, comment out if using external rate limiter)
    # app.add_middleware(RateLimitMiddleware, requests_per_minute=60)
    
    return app
