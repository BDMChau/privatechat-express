import React, { useState, useEffect, useRef } from 'react';
import './SendEmail.css'
import { useHistory } from "react-router-dom";
import { Input, Card, Button, Form } from 'antd';
import { MessageFilled } from '@ant-design/icons';
import authApi from '../../../api/authApi';
import { toast_success, toast_error } from '../../../utils/toast/toast';


const SendEmail = () => {
    const [email, setEmail] = useState('');
    const textInput = useRef();
    const history = useHistory();

    useEffect(() => {
        textInput.current.focus();
    }, []);

    const isValid = () => {
        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return toast_error('Invalid email, please try again!');
        }

        return true;
    }

    const handleSendEmail = async () => {
        if (email) {
            if (isValid() === true) {
                try {
                    const data = {
                        email: email
                    }

                    const dataResponse = await authApi.sendEmail(data);

                    if (dataResponse.err) {
                        return toast_error(dataResponse.err);
                    }

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
                <Form onKeyPress={(e) => e.key === 'Enter' ? handleSendEmail() : null}>
                    <Input
                        className="sendemail-input"
                        placeholder="Type your email to reset password"
                        id="email"
                        type="email"
                        ref={textInput}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="sendemail-bottom">
                        <Button className='btn-cancle-email' type="danger" onClick={() => history.replace('/login')}>Cancle</Button>
                        <Button className='btn-submit-email' type="primary" onClick={() => handleSendEmail()}>Submit</Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}

export default SendEmail;
