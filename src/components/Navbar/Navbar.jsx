import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useSelector, useDispatch } from 'react-redux';
import { resetUser } from '../../Redux/appSlice';

const Navbar = () => {
  const loggedOut = useSelector((state) => state.app.loggedOut);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('ID');

    dispatch(resetUser());

    navigate('/signin');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: 'transparent' }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">
          FitPeak
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/profile">
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/workout">
                Workouts
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/Fitness-goals">
                Set Goal
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/progress">
                Progress
              </Link>
            </li>

            {loggedOut ? (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/signin">
                  Login
                </Link>
              </li>
            ) : (

              <li className="nav-item">
                <button className="nav-link text-white btn btn-link" onClick={handleLogout}>
                  Log out
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
