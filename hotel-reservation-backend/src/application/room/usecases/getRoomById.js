const Room = require('../../../infrastructure/database/mongodb/models/room.model');

const getRoomById = async (id) => {
    return await Room.findById(id);
};

module.exports = getRoomById;