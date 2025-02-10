import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { FaTrash, FaEdit } from 'react-icons/fa';
import '../App.css';

const AddEvent = () => {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [attendees, setAttendees] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ eventName, description, date, attendees });
        alert("Event Added Successfully!");
    };

    return (
        <div className={`dashboard `}>
            {/* Header */}
            <header className="header">
                <h1 className="title">EVENT MANAGER</h1>

            </header>

            {/* Main Content */}
            <main className="main">
                <div className="event-card">
                    <h1>Add Event</h1>
                    <Link to="/" className="add-event-btn">Back</Link>

                    <form className="event-form" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                        <textarea value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)} required />
                        <input type="datetime-local" value={date} placeholder='Date' onChange={(e) => setDate(e.target.value)} required />
                        <input type="number" value={attendees} placeholder='No. of Attendees' onChange={(e) => setAttendees(e.target.value)} required />
                        <button type="submit" className="submit-btn">Submit</button>

                    </form>

                    <div className="event-actions">
                        <button className="edit-btn"><FaEdit /> Edit</button>
                        <button className="delete-btn"><FaTrash /> Delete</button>
                    </div>
                </div>
            </main>

            <footer className="footer"></footer>
        </div>
    );
};

export default AddEvent;
