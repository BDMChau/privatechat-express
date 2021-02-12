import React, { useState, useEffect, useRef } from 'react';
import './ResetPass.css'
import { useHistory, useParams } from "react-router-dom";
import { Input, Card, Button } from 'antd';
import { MessageFilled } from '@ant-design/icons';
import Form from 'antd/lib/form/Form';
import { toast_success, toast_error } from '../../../utils/toast/toast';
import authApi from '../../../api/authApi';
import cryptojs from 'crypto-js';

const ResetPass = () => {
    const [password, setPassword] = useState('');
    const textInput = useRef();
    const history = useHistory();
    const { tokenResetPassword } = useParams();

    useEffect(() => {
        textInput.current.focus();
    }, []);

    const isValid = () => {
        if (password.length < 6) {
            return toast_error('password length at least 6 characters!');
        }

        return true;
    }

    const handleResetPass = async () => {
        if (password) {
            if (isValid() === true) {
                try {
                    const encryptedPass = await cryptojs.AES.encrypt(password, 'secretKey').toString();
                    const data = {
                        password: encryptedPass,
                        tokenResetPassword: tokenResetPassword
                    }

                    const dataResponse = await authApi.resetPassword(data);

                    if (dataResponse.err) {
                        return toast_error(dataResponse.err);
                    }

                    history.push('/login');
                    return toast_success(dataResponse.msg);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    return (
        <div className="row sendemail-form" >
            <Card className="login-card">
                <div className="login-title">
                    <div className="icon">
                        <MessageFilled style={{ fontSize: '45px', color: '#1A82E0' }} />
                        <h2 className="icon-title">Chat</h2>
                    </div>
                </div>
                <Form onKeyPress={(e) => e.key === 'Enter' ? handleResetPass() : null}>
                    <Input.Password
                        className="resetpass-input"
                        placeholder="Type your new password"
                        id="password"
                        type="password"
                        ref={textInput}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="resetpass-bottom">
                        <Button className='btn-cancle-resetpass' type="danger" onClick={() => history.replace('/login')}>Cancle</Button>
                        <Button className='btn-submit-resetpass' type="primary" onClick={() => handleResetPass()}>Submit</Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}

export default ResetPass;
