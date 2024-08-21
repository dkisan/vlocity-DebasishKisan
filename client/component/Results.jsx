import React, { useState, useEffect } from 'react';
import styles from './result.module.css'
import { useParams } from 'react-router-dom';

import { io } from 'socket.io-client'

const Results = () => {
    const [poll, setPoll] = useState({});

    const params = useParams()

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

    const socket = io(`${import.meta.env.VITE_URL}`)

    const setLiveHandler = (optionid) => {
        setPoll(prev => {
            const data = { ...prev }
            const existindex = data.options.findIndex(option => option._id === optionid);

            if (existindex !== -1) {
                data.options[existindex].votes += 1;
            }
            return data;
        })
    }



    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected to the server')
        })

        socket.on('livepoll', (optionid) => {
            setLiveHandler(optionid)
        })

    }, []);

    return (
        <div className={styles.resultscontainer}>
            <h1 className={styles.resultstitle}>Results</h1>
            <h2 className={styles.pollquestion}>{poll.title}</h2>
            <ul className={styles.resultslist}>
                {poll && poll.options?.map((option) => (
                    <li key={option._id} className={styles.resultitem}>
                        <span className={styles.optionname}>{option.option}</span>
                        <span className={styles.votecount}>{option.votes} votes</span>
                        <div className={styles.progressbar}>
                            <div
                                className={styles.progressbarfill}
                                style={{
                                    width: `${(option.votes / 60) * 100}%`,
                                }}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Results;