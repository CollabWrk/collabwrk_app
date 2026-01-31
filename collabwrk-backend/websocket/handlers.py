import logging
import socketio

logger = logging.getLogger(__name__)

def register_handlers(sio: socketio.AsyncServer):
    
    @sio.event
    async def connect(sid, environ, auth):
        logger.info(f"Client connected: {sid}")
        
        # Check if user provided info to join specific rooms
        if auth and auth.get('user_id'):
            await sio.save_session(sid, {'user_id': auth['user_id']})
            logger.info(f"User {auth['user_id']} associated with sid {sid}")

    @sio.event
    async def disconnect(sid):
        logger.info(f"Client disconnected: {sid}")

    @sio.event
    async def join_room(sid, data):
        # Allow clients to join rooms (e.g. "company_123", "thread_456")
        room = data.get('room')
        if room:
            sio.enter_room(sid, room)
            logger.info(f"Client {sid} joined room {room}")
            await sio.emit('joined', {'room': room}, to=sid)

    @sio.event
    async def leave_room(sid, data):
        room = data.get('room')
        if room:
            sio.leave_room(sid, room)
            logger.info(f"Client {sid} left room {room}")
