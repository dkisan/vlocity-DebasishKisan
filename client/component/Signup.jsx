import React, { useRef, useState } from 'react';
import styles from './signupstyle.module.css'
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {

    const navigate = useNavigate()

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneNumberRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const imageRef = useRef(null);

    const [image, setImage] = useState(null)

    const imageHandler = (event) => {
        setImage(event.target.files[0])
    }


    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const userData = {
                name: nameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
                confirmPassword: confirmPasswordRef.current.value,
            };

            if (!Object.values(userData).every(Boolean)) {
                alert("Please fill all fields.");
                return;
            }

            if (userData.password !== userData.confirmPassword) {
                alert("Passwords do not match");
                passwordRef.current.focus()
                return;
            }

            const formData = new FormData()
            formData.append('image', image)
            formData.append('userData', JSON.stringify(userData))

            const response = await fetch(`${import.meta.env.VITE_URL}/users/signup`, {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                navigate('/login');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Some error occurred');
            }
        } catch (error) {
            console.error(error);
        }

    };

    return (
        <div className={styles.container}>
            <div className={styles.signupform}>
                <h1>Signup</h1>
                <form onSubmit={handleSignup}>
                    <label htmlFor='nameid'>Name:</label>
                    <input
                        id='nameid'
                        type="text"
                        ref={nameRef}
                    />
                    <br />
                    <label htmlFor='emailid'>Email:</label>
                    <input
                        id='emailid'
                        type="email"
                        ref={emailRef}
                    />
                    <br />
                    <label htmlFor='passwordid'>Password:</label>
                    <input
                        id='passwordid'
                        type="password"
                        ref={passwordRef}
                    />
                    <br />
                    <label htmlFor='confirmid'>Confirm Password:</label>
                    <input
                        id='confirmid'
                        type="password"
                        ref={confirmPasswordRef}
                    />
                    <br />
                    <label htmlFor='imageid'>Profile Picture:</label>
                    <input
                        id='imageid'
                        type="file"
                        accept="image/*"
                        ref={imageRef}
                        onChange={imageHandler}
                    />
                    <button type="submit">Signup</button>
                </form>
                <p style={{ marginTop: '10px', textAlign: 'right' }}>Already Have an Account
                    <Link to={'/login'}>Login</Link>
                </p>
            </div>
        </div>
    );
};


export default Signup;