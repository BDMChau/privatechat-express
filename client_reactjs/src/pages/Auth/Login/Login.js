import React, { useState, useEffect, useRef, useContext } from 'react';
import './Login.css'
import { useHistory, NavLink } from "react-router-dom";
import { Input, Card, Button, Form } from 'antd';
import { MessageFilled } from '@ant-design/icons';
import { Context } from '../../../context/AppContext';
import authApi from '../../../api/authApi';
import { toast_success, toast_error } from '../../../utils/toast/toast';
import cryptojs from 'crypto-js';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const textInput = useRef(null);
    const history = useHistory();
    const { dispatch } = useContext(Context);

    useEffect(() => {
        textInput.current.focus();
    }, [])

    const isValid = () => {
        if (!email || !password) {
            return toast_error('Missing credentials!');
        }

        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return toast_error('Invalid email, please try again!');
        }

        if (localStorage.getItem('user')) {
            return toast_error('Please log out first!');
        }

        return true;
    }

    const postData = async () => {
        if (isValid() === true) {
            try {
                const encryptedPass = await cryptojs.AES.encrypt(password, 'secretKey').toString();
                const data = {
                    email: email,
                    password: encryptedPass
                }

                const dataResponse = await authApi.postDataLogin(data);

                if (dataResponse.err) {
                    return toast_error(dataResponse.err);
                }

                localStorage.setItem('token', JSON.stringify(dataResponse.userToken));
                localStorage.setItem('userid', JSON.stringify(dataResponse.user._id));
                dispatch({ type: "USERLOGIN", payload: dataResponse.user });

                history.replace('/');
                toast_success(dataResponse.msg);

                setEmail("");
                setPassword("");
            } catch (error) {
                throw error;
            }
        }

    }


    return (
        <div className="row login-form" >
            <Card className="login-card">
                <div className="login-title">
                    <div className="icon">
                        <MessageFilled style={{ fontSize: '45px', color: '#1A82E0 ' }} />
                        <h2 className="icon-title">Chat</h2>
                    </div>
                </div>

                <Form onKeyPress={(e) => e.key === 'Enter' ? postData() : null}>
                    <Input
                        className="login-input"
                        placeholder="Email"
                        id="email"
                        type="email"
                        ref={textInput}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input.Password
                        className="login-input2"
                        style={{ color: 'black' }}
                        placeholder="Password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                </Form>
                <Button className='btn-login' type="primary" onClick={() => postData()}>Sign in</Button>

                <div className="login-bottom">
                    <h3 style={{ color: 'black' }}>
                        You don't have account? <NavLink to="/signup" className="btn-to-signup"> Sign up </NavLink>
                    </h3>
                    <h4>
                        <NavLink className="forgot-pass" to="/sendemail">Forgot Your Password</NavLink>
                    </h4>
                </div>
            </Card>
        </div>
    );
}

export default Login;
