const Reservation = require('../../../model/Reservation');

class ReservationService {
    static async createReservation(data) {
        const newReservation = new Reservation(data);
        await newReservation.save();
        return newReservation;
    }

    static async getAllReservations() {
        return await Reservation.find();
    }

    static async getReservationById(id) {
        return await Reservation.findById(id);
    }

    static async updateReservation(id, data) {
        return await Reservation.findByIdAndUpdate(id, data, { new: true });
    }

    static async deleteReservation(id) {
        return await Reservation.findByIdAndDelete(id);
    }
}

module.exports = ReservationService;
