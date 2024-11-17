import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StaffReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [editingReservation, setEditingReservation] = useState(null);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/reservations');
            setReservations(response.data);
        } catch (error) {
            console.error('Error fetching reservations', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/reservations/${id}`);
            fetchReservations();
        } catch (error) {
            console.error('Error deleting reservation', error);
        }
    };

    const handleUpdate = (reservation) => {
        setEditingReservation(reservation);
    };

    const handleSaveUpdate = async () => {
        try {
            await axios.put(`http://localhost:5000/reservations/${editingReservation._id}`, editingReservation);
            setEditingReservation(null);
            fetchReservations();
        } catch (error) {
            console.error('Error updating reservation', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingReservation(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <h1>Manage Reservations</h1>
            {reservations.map(reservation => (
                <div key={reservation._id}>
                    <h3>{reservation.name}</h3>
                    <p>Email: {reservation.email}</p>
                    <p>Date: {new Date(reservation.date).toLocaleDateString()}</p>
                    <p>Time: {reservation.time}</p>
                    <p>Party Size: {reservation.partySize}</p>
                    <p>Notes: {reservation.notes}</p>
                    <button onClick={() => handleDelete(reservation._id)}>Cancel Reservation</button>
                    <button onClick={() => handleUpdate(reservation)}>Update Reservation</button>
                </div>
            ))}

            {editingReservation && (
                <div>
                    <h2>Edit Reservation</h2>
                    <form>
                        <input
                            type="text"
                            name="name"
                            value={editingReservation.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={editingReservation.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="date"
                            name="date"
                            value={editingReservation.date.split('T')[0]}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="time"
                            name="time"
                            value={editingReservation.time}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="partySize"
                            value={editingReservation.partySize}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="notes"
                            value={editingReservation.notes}
                            onChange={handleChange}
                        />
                        <button type="button" onClick={handleSaveUpdate}>Save</button>
                        <button type="button" onClick={() => setEditingReservation(null)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StaffReservationsPage;
