import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import '../index.css';

function Login() {
    return (
        <div className="main">
            <Link to="/Register" className="register-btn">
                <FaUserPlus className="register-icon" /> Register
            </Link>
            <div className="sub-main">
                <form className="form">
                    <h2 className="card-title">EVENT MANAGER</h2>
                    <input type="text" className="email" placeholder="Email address or phone number" /><br />
                    <input type="password" className="email" placeholder="password" /><br />
                    <button className="btn">Log in</button>
                    <button className="btn">SignIn as Guest</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
