const Hotel = require('../../../infrastructure/database/mongodb/models/hotel.model');

const createHotel = async (data) => {
    const hotel = new Hotel(data);
    return await hotel.save();
};

module.exports = createHotel;