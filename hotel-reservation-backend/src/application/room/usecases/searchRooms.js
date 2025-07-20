const Room = require('../../../infrastructure/database/mongodb/models/room.model');

const searchRooms = async ({ people, location, minPrice, maxPrice }) => {
  const errors = [];

  if (!people || isNaN(people) || parseInt(people) <= 0) {
    errors.push('El número de personas debe ser mayor a 0');
  }

  if (minPrice && isNaN(minPrice)) {
    errors.push('El precio mínimo debe ser un número válido');
  }

  if (maxPrice && isNaN(maxPrice)) {
    errors.push('El precio máximo debe ser un número válido');
  }

  if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
    errors.push('El precio mínimo no puede ser mayor al máximo');
  }

  if (errors.length > 0) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }

  const roomFilters = {
    capacity: { $gte: parseInt(people) },
    isAvailable: true
  };

  if (minPrice || maxPrice) {
    roomFilters.pricePerNight = {};
    if (minPrice) roomFilters.pricePerNight.$gte = parseFloat(minPrice);
    if (maxPrice) roomFilters.pricePerNight.$lte = parseFloat(maxPrice);
  }

  const rooms = await Room.find(roomFilters).populate('hotelId');

  const filteredRooms = location
    ? rooms.filter(room =>
        room.hotelId?.location?.toLowerCase().includes(location.toLowerCase())
      )
    : rooms;

  if (filteredRooms.length === 0) {
    const error = new Error('No se encontraron habitaciones con esos filtros');
    error.status = 404;
    throw error;
  }

  return filteredRooms;
};

module.exports = searchRooms;
