import React, { useState, useEffect, useRef } from 'react';
import './SignUp.css'
import { Input, Card, Button, Form, notification } from 'antd';
import { useHistory, NavLink } from "react-router-dom";
import { MessageFilled } from '@ant-design/icons';
import authApi from '../../../api/authApi';
import { toast_success, toast_error } from '../../../utils/toast/toast';
import cryptojs from 'crypto-js';

notification.config({
    duration: 3
});

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const textInput = useRef(null);
    const history = useHistory();

    useEffect(() => {
        textInput.current.focus();
    }, [])

    const isValid = () => {
        if (!name || !email || !password || !confirmPassword) {
            return toast_error('Please fill in all fields!');
        }

        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return toast_error('Invalid email, please try again!');

        }

        if (password.length < 6) {
            return toast_error('password length at least 6 characters');
        }

        if (confirmPassword !== password) {
            return toast_error('Password confirm is not match!');
        }

        return true;
    }

    const postData = async () => {
        if (isValid() === true) {
            try {
                const encryptedPass = await cryptojs.AES.encrypt(password, 'secretKey').toString();
                const data = {
                    name: name,
                    email: email,
                    password: encryptedPass
                }

                const dataResponse = await authApi.postDataSignUp(data);

                if (dataResponse.err) {
                    return toast_error(dataResponse.err);
                }

                history.replace('/login');
                toast_success(dataResponse.msg);
                toast_success(dataResponse.msg2);

                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");

            } catch (error) {
                console.log(error);
            }
        }
    }


    return (
        <div className="row signup-form" >
            <Card className="signup-card">
                <div className="signup-title">
                    <div className="icon">
                        <MessageFilled style={{ fontSize: '45px', color: '#1A82E0' }} />
                        <h2 className="icon-title">Chat</h2>
                    </div>

                </div>
                <Form onKeyPress={(e) => e.key === 'Enter' ? postData() : null}>
                    <Input
                        className="signup-input"
                        placeholder="Nickname"
                        type="text"
                        ref={textInput}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        className="signup-input"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input.Password
                        className="signup-input"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Input.Password
                        className="signup-input2"
                        placeholder="Confirm password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form>
                <Button className="btn-signup" type="primary" onClick={() => postData()}>Sign up</Button>

                <div className="signup-bottom">
                    <h3>You have an account? <NavLink to="/login" style={{ paddingLeft: '5px' }}>Sign in</NavLink> </h3>
                </div>
            </Card>
        </div>
    );
}

export default SignUp;
