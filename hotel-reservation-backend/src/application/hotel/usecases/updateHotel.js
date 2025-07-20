const Hotel = require('../../../infrastructure/database/mongodb/models/hotel.model');

const updateHotel = async (id, data) =>{
    return await Hotel.findByIdAndUpdate(id, data, { new: true });
};

module.exports = updateHotel;