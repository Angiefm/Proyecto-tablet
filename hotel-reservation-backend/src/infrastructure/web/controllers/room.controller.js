const searchRooms = require('../../../application/room/usecases/searchRooms');

const {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
} = require('../../../application/room/usecases');

const roomController = {
    createRoom: async (req, res) => {
        try {
            const room = await createRoom(req.body);
            res.status(201).json(room);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getAllRooms: async (req, res) => {
        try {
            const rooms = await getAllRooms();
            res.json(rooms);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    
    getRoomById: async (req, res) => {
        try {
            const room = await getRoomById(req.params.id);
            if (!room) return res.status(404).json({ error: 'No encontrado' });
            res.json(room);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    
    updateRoom: async (req, res) => {
        try {
            const room = await updateRoom(req.params.id, req.body);
            res.json(room);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    
    deleteRoom: async (req, res) => {
        try {
            await deleteRoom(req.params.id);
            res.status(204).end();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    searchRooms: async (req, res) => {
        try {
        const results = await searchRooms(req.query);
        res.json(results);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

};


module.exports = roomController;
