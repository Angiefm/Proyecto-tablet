const Room = require('../../../infrastructure/database/mongodb/models/room.model');

const getAllRooms = async () => {
    return await Room.find();
};

module.exports = getAllRooms;
