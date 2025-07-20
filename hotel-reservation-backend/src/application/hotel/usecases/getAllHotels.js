const Hotel = require('../../../infrastructure/database/mongodb/models/hotel.model');

const getAllHotels = async () => {
    return await Hotel.find();
};

module.exports = getAllHotels;