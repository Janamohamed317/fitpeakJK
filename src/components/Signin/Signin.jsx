import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setEmail,
  setPassword,
  toggleShowPassword,
  setLoggedOut,
} from '../../Redux/appSlice';

import styles from './Signin.module.css';
import login_img from '../../assets/login.png';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

function Signin() {
  const email = useSelector((state) => state.app.email);
  const password = useSelector((state) => state.app.password);
  const showPassword = useSelector((state) => state.app.showPassword);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    dispatch(setEmail(''));
    dispatch(setPassword(''));
  }, []);

  const validateSignIn = (field, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (field === 'email') {
      if (!value) {
        setEmailError('Email is required');
      }
      else if (!emailRegex.test(value)) {
        setEmailError('Invalid email format')
      }
      else {
        setEmailError('');
      }
    } else if (field === 'password') {
      if (!value) {
        setPasswordError('Password is required');
      }
      else if (!passwordRegex.test(value)) {
        setPasswordError(`Password must contain:
                          - 8+ characters
                          - 1 uppercase letter
                          - 1 lowercase letter
                          - 1 number
                          - 1 special character (!@#$%^&*)`);
      } else setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateSignIn('email', email);
    validateSignIn('password', password);

    const isAnyFieldEmpty = !email || !password;
    const hasErrors = emailError || passwordError;

    if (isAnyFieldEmpty) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (hasErrors) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix the errors in the form before submitting',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        dispatch(setLoggedOut(false));
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('ID', response.data.user.userId);

        Swal.fire({
          icon: 'success',
          title: 'Logged in successfully!',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate('/');
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Credentials',
            text: 'The email or password you entered is incorrect.',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Something went wrong during login. Please try again later.',
            confirmButtonText: 'OK',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'There was an issue connecting to the server. Please check your internet connection.',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.form_container}>
        <img src={login_img} alt="Description" className={styles.form_img} />
        <div className={styles.form}>
          <form className={styles.form_inputs} onSubmit={handleSubmit}>
            <p className={styles.Login_text}>Sign in</p>

            <label className={styles.Input_label}>Email</label>
            <input
              className={styles.inputs}
              placeholder="Email"
              value={email}
              onChange={(e) => {
                dispatch(setEmail(e.target.value));
                validateSignIn('email', e.target.value);
              }}
            />
            {emailError && <p className={styles.error_text}>{emailError}</p>}

            <label className={styles.Input_label}>Password</label>
            <input
              className={styles.inputs}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                dispatch(setPassword(e.target.value));
                validateSignIn('password', e.target.value);
              }}
            />
            {passwordError && <p className={styles.error_text}>{passwordError}</p>}

            <div className={styles.form_checkbox_container}>
              <label className={styles.checkbox_label}>Show Password</label>
              <input
                type="checkbox"
                className={styles.form_checkbox}
                onChange={() => dispatch(toggleShowPassword())}
              />
            </div>

            <button className={styles.form_btn} type="submit">
              <span>Sign In</span>
            </button>
          </form>

          <p className={styles.Login_text2}>
            Don't have an account?
            <span
              className={styles.Signup_text}
              onClick={() => {
                dispatch(setEmail(''));
                dispatch(setPassword(''));
                navigate('/signup');
              }}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
