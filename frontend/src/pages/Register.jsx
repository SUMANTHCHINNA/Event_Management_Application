import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import '../index.css';

function Login() {
    return (

        <div className="main">
            <div className="sub-main">
                <Link to="/Login" className="register-btn">
                    <FaUserPlus className="register-icon" /> Login
                </Link>
                <form className="form">
                    <h2 className="card-title">EVENT MANAGER</h2>
                    <input type="text" className="email" placeholder="Username" /><br />
                    <input type="text" className="email" placeholder="Email address or phone number" /><br />
                    <input type="password" className="email" placeholder="password" /><br />
                    <button className="btn">Register</button>
                    <button className="btn">SignIn as Guest</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
