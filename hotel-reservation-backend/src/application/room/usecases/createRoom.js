const Room = require('../../../infrastructure/database/mongodb/models/room.model');

const createRoom = async (data) => {
    const room = new Room(data);
    return await room.save();
};

module.exports = createRoom;