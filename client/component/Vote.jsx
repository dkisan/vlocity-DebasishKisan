import React, { useState, useEffect } from 'react';
import styles from './vote.module.css'
import { useNavigate, useParams } from 'react-router-dom';

import { io } from 'socket.io-client'

const Vote = () => {
    const params = useParams()
    const [poll, setPoll] = useState({});
    const [selectedOption, setSelectedOption] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_URL}`)

    })

    const getPoll = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/polls/${params.voteid}`)

            const data = await response.json()
            if (response.ok) {
                setPoll(data)
            } else {
                alert('some error occured')
            }
        } catch (err) {
            console.log(err.message)
        }
    }



    useEffect(() => {
        getPoll()
    }, []);

    const handleVote = async () => {
        try {
            const socket = io(`${import.meta.env.VITE_URL}`)

            const selectedOptionId = poll.options.find((option) => option.option === selectedOption)._id;

            const response = await fetch(`${import.meta.env.VITE_URL}/polls/${params.voteid}/vote`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: localStorage.getItem('userToken')
                },
                body: JSON.stringify({ optionId: selectedOptionId })
            });

            const data = await response.json()
            if (response.ok) {
                alert(data.message)
                socket.emit('vote', selectedOptionId)
            } else {
                alert('some error occured')
            }
        } catch (err) {
            console.log(err.message)
        }
    };

    return (
        <div className={styles.votecontainer}>
            <h2 className={styles.pollquestion}>{poll.title}</h2>
            <ul className={styles.optionslist}>
                {poll.options?.map((option, idx) => (
                    <li key={option._id} className={styles.optionitem}>
                        <input
                            type="radio"
                            value={option.option}
                            checked={selectedOption === option.option}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className={styles.radiobutton}
                        />
                        <span className={styles.optionname}>{option.option}</span>
                    </li>
                ))}
            </ul>
            <button className={styles.votebutton} onClick={handleVote}>
                Vote
            </button>
            <button
                onClick={() => {
                    navigate(`/${params.voteid}/results`,
                        {
                            replace: true
                        }
                    )
                }
                }
                style={{ marginLeft: '20px' }} className={styles.votebutton}>
                Results
            </button>
        </div>
    );
};

export default Vote;