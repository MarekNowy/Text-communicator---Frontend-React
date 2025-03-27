import styles from './loginPanel.module.css'; 
import axios from 'axios';  
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSocket } from '../Context/socket';

function LoginPanel() {
    const navigate =  useNavigate();

    const userRef = useRef<HTMLInputElement | null>(null);
    const errRef = useRef<HTMLParagraphElement | null>(null);

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEmail('');
        setPwd('');

        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                email: email,
                password: pwd  
            });
            console.log(response)
            const access_token: string = response?.data.access_token;
            const refresh_token: string = response?.data.refresh_token;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            setSuccess(true);
          
            
        } catch (err: any) {
            if (!err.response) {
                setErrMsg('No Server Response');

            } else if (err.response?.status === 401) {
                setErrMsg('Invalid Login Data');

            } else if (err.response.status === 404) {
                setErrMsg("Cannot find the user");
                
            } else {
                setErrMsg('Login Failed');
            }
        }
    };

    useEffect(() => {
        if (userRef.current) userRef.current.focus();
    }, []);
    
    useEffect(() => {
        if(success){
        const token = localStorage.getItem('access_token')
        createSocket(token as string);
        navigate("/home")
        }
    }, [success])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd]);

    return (
       
            <section>
                <p ref={errRef} className={errMsg ? styles.errMsg : styles.offscreen} aria-live="assertive">
                    {errMsg}
                </p>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="userEmail">Email</label>
                    <input 
                        type="email" 
                        id="userEmail"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                    <label htmlFor="userPassword">Password</label>
                    <input 
                        type="password" 
                        id="userPassword"
                        autoComplete="off"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />
                    <button>Sign In</button>
                    <p>
                        Need an Account?<br/>
                        <span className="line">
                            <a href="/register">Sign Up</a>    
                        </span>
                    </p>
                </form>
            </section>
            );}
        

export default LoginPanel;