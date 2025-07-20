const Room = require('../../../infrastructure/database/mongodb/models/room.model');

const deleteRoom = async (id) => {
    return await Room.findByIdAndDelete(id);
};

module.exports = deleteRoom;