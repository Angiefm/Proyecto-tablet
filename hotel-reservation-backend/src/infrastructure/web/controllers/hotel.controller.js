const {
    createHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
} = require('../../../application/hotel/usecases');

const hotelController = {
    createHotel: async (req, res) => {
        try {
            const hotel = await createHotel(req.body);
            res.status(201).json(hotel);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getAllHotels: async (req, res) => {
        try {
            const hotels = await getAllHotels();
            res.json(hotels);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getHotelById: async (req, res) => {
        try {
            const hotel = await getHotelById(req.params.id);
            if (!hotel) return res.status(404).json({ error: 'No encontrado' });
            res.json(hotel);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updateHotel: async (req, res) => {
        try {
            const hotel = await updateHotel(req.params.id, req.body);
            res.json(hotel);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    deleteHotel: async (req, res) => {
        try {
            const hotel = await deleteHotel(req.params.id);
            res.status(204).end();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

module.exports = hotelController;
