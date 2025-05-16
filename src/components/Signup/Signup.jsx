import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setEmail,
    setUsername,
    setPassword,
    toggleShowPassword,
} from '../../Redux/appSlice';
import styles1 from './Signup.module.css';
import signupimg from '../../assets/login.png';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

function Signup() {
    const email = useSelector((state) => state.app.email);
    const username = useSelector((state) => state.app.username);
    const password = useSelector((state) => state.app.password);
    const showPassword = useSelector((state) => state.app.showPassword);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmedPasswordError, setConfirmedPasswordError] = useState('');

    useEffect(() => {
        dispatch(setEmail(''));
        dispatch(setUsername(''));
        dispatch(setPassword(''));
    }, []);

    const validateField = (field, value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;

        if (field === 'email') {
            if (!value) {
                setEmailError('Email is required')
            }
            else if (!emailRegex.test(value)) {
                setEmailError('Invalid email format');
            }
            else {
                setEmailError('');
            }
        } else if (field === 'username') {
            if (!value) {
                setUsernameError('Username is required');
            }
            else if (value.length < 3) {
                setUsernameError('Username must be at least 3 characters');
            }
            else {
                setUsernameError('');
            }
        } else if (field === 'password') {
            if (!value) {
                setPasswordError('Password is required');
            } else if (!passwordRegex.test(value)) {
                setPasswordError(`Password must contain:
        - 8+ characters
        - 1 uppercase letter
        - 1 lowercase letter
        - 1 number
        - 1 special character (!@#$%^&*)`);
            } else {
                setPasswordError('');
            }
        } else if (field === 'confirmedPassword') {
            if (!value) {
                setConfirmedPasswordError('Please confirm your password');
            }
            else if (value !== password) {
                setConfirmedPasswordError("Passwords don't match");
            }
            else {
                setConfirmedPasswordError('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        validateField('email', email);
        validateField('username', username);
        validateField('password', password);
        validateField('confirmedPassword', confirmedPassword);

        const isAnyFieldEmpty = !email || !username || !password || !confirmedPassword;
        const hasErrors =
            emailError || usernameError || passwordError || confirmedPasswordError;

        if (isAnyFieldEmpty || hasErrors) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: isAnyFieldEmpty
                    ? 'Please fill in all fields'
                    : 'Please fix the errors in the form before submitting.',
                confirmButtonText: 'OK',
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/signup', {
                email,
                username,
                password,
            });

            Swal.fire({
                icon: 'success',
                title: 'Signed up successfully!',
                confirmButtonText: 'OK',
            }).then(() => {
                navigate('/signin');
            });
        } catch (error) {
            if (error.response) {
                const { status } = error.response;
                if (status === 409) {
                    if (error.response.data.message.includes('Email')) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Email already exists',
                            text: 'The email you entered is already registered. Please use a different email.',
                        });
                    } else if (error.response.data.message.includes('Username')) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Username already exists',
                            text: 'The username you entered is already taken. Please choose a different username.',
                        });
                    }
                } 
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Signup Failed',
                    text: 'Something went wrong during signup. Please try again later.',
                });
            }
        }
    };


    return (
        <div className={styles1.main_container}>
            <div className={styles1.form_container}>
                <img src={signupimg} alt="Description" className={styles1.form_img} />
                <div className={styles1.form}>
                    <form className={styles1.form_inputs} onSubmit={handleSubmit}>
                        <p className={styles1.Sigunp_text}>Sign Up</p>

                        <label className={styles1.Input_label}>Username</label>
                        <input
                            className={styles1.input}
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => {
                                dispatch(setUsername(e.target.value));
                                validateField('username', e.target.value);
                            }}
                        />
                        {usernameError && (
                            <p className={styles1.error_text}>{usernameError}</p>
                        )}

                        <label className={styles1.Input_label}>Email</label>
                        <input
                            className={styles1.input}
                            placeholder="Email"
                            value={email}
                            onChange={(e) => {
                                dispatch(setEmail(e.target.value));
                                validateField('email', e.target.value);
                            }}
                        />
                        {emailError && (
                            <p className={styles1.error_text}>{emailError}</p>
                        )}

                        <label className={styles1.Input_label}>Password</label>
                        <input
                            className={styles1.input}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                dispatch(setPassword(e.target.value));
                                validateField('password', e.target.value);
                            }}
                        />
                        {passwordError && (
                            <p className={styles1.error_text}>{passwordError}</p>
                        )}

                        <label className={styles1.Input_label}>Confirm Password</label>
                        <input
                            className={styles1.input}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            value={confirmedPassword}
                            onChange={(e) => {
                                setConfirmedPassword(e.target.value);
                                validateField('confirmedPassword', e.target.value);
                            }}
                        />
                        {confirmedPasswordError && (
                            <p className={styles1.error_text}>{confirmedPasswordError}</p>
                        )}

                        <div className={styles1.form_checkbox_container}>
                            <label className={styles1.checkbox_label}>Show Password</label>
                            <input
                                type="checkbox"
                                className={styles1.form_checkbox}
                                onChange={() => dispatch(toggleShowPassword())}
                            />
                        </div>

                        <button className={styles1.form_btn} type="submit">
                            <span>Sign Up</span>
                        </button>
                    </form>

                    <p className={styles1.Sigunp_text2}>
                        Already have an account?
                        <span
                            className={styles1.Signin_text}
                            onClick={() => navigate('/signin')}
                        >
                            Sign in
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
