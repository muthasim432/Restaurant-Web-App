import React, { useState } from 'react';
import axios from 'axios';
import './ReservationPage.css'; 

const ReservationPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [partySize, setPartySize] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reservationData = {
            name,
            email,
            date,
            time,
            partySize,
            notes
        };

        try {
            await axios.post('http://localhost:5000/reservations', reservationData);
            alert('Reservation booked successfully!');
        } catch (error) {
            console.error('Error booking reservation', error);
            alert('Failed to book reservation');
        }
    };

    return (
        <div className="reservation-container">
            <h1>Book a Reservation</h1>
            <form onSubmit={handleSubmit} className="reservation-form">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="date"
                    placeholder="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <input
                    type="time"
                    placeholder="Time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Party Size"
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <button type="submit">Reserve</button>
            </form>
        </div>
    );
};

export default ReservationPage;
