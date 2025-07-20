const Hotel = require('../../../infrastructure/database/mongodb/models/hotel.model');

const deleteHotel = async (id) => {
    return await Hotel.findByIdAndDelete(id);
};

module.exports = deleteHotel;