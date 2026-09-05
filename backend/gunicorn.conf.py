"""
Gunicorn Configuration for Production Deployment
Render.com compatible configuration
"""

import os
import multiprocessing

# =============================================================================
# Server Socket
# =============================================================================

# Bind to the port provided by Render or default to 8001
bind = f"0.0.0.0:{os.environ.get('PORT', '8001')}"

# =============================================================================
# Worker Processes
# =============================================================================

# Number of worker processes
# Render provides WEB_CONCURRENCY env var, or use CPU count
workers = int(os.environ.get('WEB_CONCURRENCY', multiprocessing.cpu_count() * 2 + 1))

# Worker class - use uvicorn for ASGI (WebSocket support)
worker_class = "uvicorn.workers.UvicornWorker"

# Worker connections for eventlet/gelet (not used with Uvicorn)
worker_connections = 1000

# Maximum requests per worker before restart (prevents memory leaks)
max_requests = 1000
max_requests_jitter = 50

# Timeout for worker processes (seconds)
timeout = 120

# Graceful timeout for worker shutdown
graceful_timeout = 30

# Keep-alive connections
keepalive = 5

# =============================================================================
# Server Mechanics
# =============================================================================

# Daemon mode (set to False for containerized environments)
daemon = False

# Process name
proc_name = "lovetrae_api"

# =============================================================================
# Logging
# =============================================================================

# Log level
loglevel = os.environ.get('LOG_LEVEL', 'info').lower()

# Access log (set to '-' for stdout)
accesslog = "-"

# Error log
errorlog = "-"

# Access log format
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# =============================================================================
# Process Naming
# =============================================================================

def post_fork(server, worker):
    """Called just after a worker has been forked."""
    server.log.info(f"Worker spawned (pid: {worker.pid})")


def pre_fork(server, worker):
    """Called just prior to forking the worker."""
    pass


def when_ready(server):
    """Called just after the server is started."""
    server.log.info("Gunicorn server is ready. Spawning workers...")


def worker_int(worker):
    """Called when a worker receives SIGINT or SIGQUIT."""
    worker.log.info("Worker received INT or QUIT signal")


def on_exit(server):
    """Called just before exiting Gunicorn."""
    server.log.info("Gunicorn server is shutting down...")
