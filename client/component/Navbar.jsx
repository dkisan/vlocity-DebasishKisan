import React, { useEffect, useState } from 'react';
import styles from './navbarstyle.module.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    let initial = 1;

    const getUser = async () => {
        const response = await fetch(`${import.meta.env.VITE_URL}/users/getuser`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: localStorage.getItem('userToken')
            }
        })
        const data = await response.json()
        setUser(data)
    }

    useEffect(() => {
        if (!localStorage.getItem('userToken')) navigate('/login')
        if (initial) {
            getUser()

        }

        initial--;
    }, [])
    return (
        <nav className={styles.navbar}>
            <ul>
                <li><Link to={'/'} >Home</Link></li>
                <li><Link to={'/create'} >Create</Link></li>
                {user && <li>
                    <span>{user.name}</span>
                    <button style={{ marginLeft: '8px', padding: '2px 4px' , cursor:'pointer'}} onClick={(e) => {
                        e.preventDefault()
                        localStorage.removeItem('userToken')
                        navigate('/login')
                    }}>Logout</button>
                </li>}
            </ul>
        </nav >
    );
};

export default Navbar;