import socketio
from aiohttp import web
import logging
from websocket.handlers import register_handlers

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='aiohttp',
    cors_allowed_origins='*'  # Allow all origins for MVP
)

# Register event handlers
register_handlers(sio)

# Create AioHTTP application
app = web.Application()
sio.attach(app)

# Health check for deployment
async def health_check(request):
    return web.Response(text="WebSocket Server OK")

app.router.add_get('/', health_check)
app.router.add_get('/health', health_check)

if __name__ == '__main__':
    web.run_app(app, port=8765)
