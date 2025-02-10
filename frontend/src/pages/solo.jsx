import React from "react";
import '../index.css';
import { FaUsers, FaCalendarAlt } from "react-icons/fa";

function EventPage() {
    const event = {
        name: "Cybersecurity Summits",
        description: "A summit discussing the latest cybersecurity threats and solutions.",
        date: "2025-05-12T11:00:00.000+00:00",
        attendees: 120,
        imagePath: "C://Users//hp//Desktop//event//frontend//public//pictures//cyber.jpg"
    };





    return (
        <div className="event-container">
            <div className="event-card">
                <img src={event.imagePath} alt="Event" className="event-image" />
                <div className="event-content">
                    <h2 className="event-title">{event.name}</h2>
                    <p className="event-description">{event.description}</p>
                    <div className="event-details">
                        <p><FaCalendarAlt className="icon" /> {new Date(event.date).toISOString()}</p>
                        <p><FaUsers className="icon" /> {event.attendees} Attendees</p>
                        <button className="btn">Register</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventPage;
