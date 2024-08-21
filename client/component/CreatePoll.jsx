import React, { useRef, useState } from 'react';
import styles from './createPoll.module.css';

const CreatePoll = () => {
    const optionRef = useRef('');
    const questionRef = useRef('');
    const [options, setOptions] = useState([]);

    const handleAddOption = (e) => {
        e.preventDefault();
        if (optionRef.current.value === '') return
        if (options.includes(optionRef.current.value)) return
        setOptions([...options, optionRef.current.value]);
        optionRef.current.value = '';
    };


    const handleCreatePoll = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/polls/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: localStorage.getItem('userToken')
                },
                body: JSON.stringify({
                    title: questionRef.current.value,
                    options: options
                })
            })

            const data = await response.json()
            if (response.ok) {
                alert(data.message)
                setOptions([])
                questionRef.current.value = ''
                optionRef.current.value = ''
            } else {
                alert('some error occured')
            }
        } catch (err) {
            console.log(err.message)
        }
    };

    return (
        <div className={styles.createpollcontainer}>
            <h1 className={styles.createpollheader}>Create a Poll</h1>
            <form className={styles.createpollform}>
                <label className={styles.createpolllabel}>Question:</label>
                <input
                    type="text"
                    ref={questionRef}
                    className={styles.createpollinput}
                />
                <br />
                <label className={styles.createpolllabel}>Options:</label>
                <ul className={styles.createpolloptions}>
                    {options.map((option, index) => (
                        <li key={index} className={styles.createpolloption}>
                            {option}
                        </li>
                    ))}
                </ul>

                <input
                    type="text"
                    ref={optionRef}
                    className={styles.createpollinput}
                />

                <button
                    onClick={handleAddOption}
                    className={`${styles.createpollbutton} ${styles.addoptionbutton}`}
                >
                    Add Option
                </button>
                <button
                    onClick={handleCreatePoll}
                    className={`${styles.createpollbutton}`}>
                    Create Poll
                </button>
            </form>
        </div >
    );
};

export default CreatePoll;