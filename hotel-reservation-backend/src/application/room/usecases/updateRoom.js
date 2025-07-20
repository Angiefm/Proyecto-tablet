const Room = require('../../../infrastructure/database/mongodb/models/room.model');

const updateRoom = async (Id, data) => {
    return await Room.findByIdAndUpdate(Id, data, { new: true });
};

module.exports = updateRoom;