import React, { useEffect, useState } from 'react';
import styles from './homestyle.module.css';
import { useNavigate } from 'react-router-dom';



const Homepage = () => {

    const [polls, setPolls] = useState(null)
    const [mypolls, setMyPolls] = useState(null)
    const navigate = useNavigate()

    const getAllpolls = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/polls/allpolls`)

            const data = await response.json()
            if (response.ok) {
                setPolls(data)
            } else {
                alert('some error occured')
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    const getMyPolls = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/polls/mypolls`, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: localStorage.getItem('userToken')
                }
            })

            const data = await response.json()
            if (response.ok) {
                setMyPolls(data.mypoll)
            } else {
                alert('some error occured')
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        if (!localStorage.getItem('userToken')) {
            navigate('/login')
            return 
        }
        getAllpolls()
        getMyPolls()
    }, [])

    return (
        <>

            <br />
            <h2 style={{ textAlign: 'center' }}>My Polls</h2>
            <div className={styles.polllist}>
                {polls?.filter(p => mypolls?.includes(p._id)).map((poll) => (
                    <div
                        onClick={() => {
                            navigate(`/${poll._id}/${poll.title}`)
                        }}
                        key={poll._id} className={styles.pollcard}>
                        <h2 className={styles.question}>{poll.title}</h2>
                        <ul className={styles.options}>
                            {poll.options.map((option, idx) => (
                                <li key={idx}>
                                    <input type="radio" id={idx} />
                                    <label htmlFor={idx}>{option.option}</label>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/${poll._id}/results`,
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

                ))}
            </div>
            <br />
            <h2 style={{ textAlign: 'center' }}>All Polls</h2>
            <div className={styles.polllist}>
                {polls?.map((poll) => (
                    <div
                        onClick={() => {
                            navigate(`/${poll._id}/${poll.title}`)
                        }}
                        key={poll._id} className={styles.pollcard}>
                        <h2 className={styles.question}>{poll.title}</h2>
                        <ul className={styles.options}>
                            {poll.options.map((option, idx) => (
                                <li key={idx}>
                                    <input type="radio" id={idx} />
                                    <label htmlFor={idx}>{option.option}</label>
                                </li>
                            ))}
                        </ul>
                        <p style={{ textAlign: 'center' }}>Total Vote : {poll.votes?.length || 0}</p>

                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/${poll._id}/results`,
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
                ))}
            </div>
        </>
    );
};

export default Homepage;