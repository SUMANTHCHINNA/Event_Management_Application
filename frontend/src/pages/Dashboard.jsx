import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import '../App.css';

const Dashboard = () => {
    return (
        <div className={`dashboard `}>
            <header className="header">
                <h1 className="title">EVENT MANAGER</h1>

            </header>

            <main className="main">
                <div className="dashboard-container">
                    <h2>CyberSecurity Summit</h2>
                </div>
                <Link to="/add-event" className="add-event-btn">
                    <FaPlus />
                </Link>
            </main>

            <footer className="footer"></footer>
        </div>
    );
};

export default Dashboard;
