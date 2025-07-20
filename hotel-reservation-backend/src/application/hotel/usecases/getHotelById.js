const Hotel = require('../../../infrastructure/database/mongodb/models/hotel.model');

const getHotelById = async(id) =>{
    return await Hotel.findById(id);
};

module.exports = getHotelById;