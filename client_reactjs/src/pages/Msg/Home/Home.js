import React, { useEffect, useState, useContext } from 'react';
import './Home.css';

import { useHistory } from "react-router-dom";
import { defaultAvatar } from '../../../utils/avatar/avatar'
import { updateSocketId } from '../../../socket/socketClient';

import MessageList from '../MessageList/MessageList';
import Message from '../Message/Message';
import { Context } from '../../../context/AppContext';
import authApi from '../../../api/authApi';
import {toast_error} from '../../../utils/toast/toast';

const Home = () => {
    const [selectedUserData, setSelectedUserData] = useState('');
    const [latestMessage, setLatestMessage] = useState([]);
    const [conversation, setConversation] = useState({});
    const { state, dispatch } = useContext(Context);
    const history = useHistory();

    // check userid valid
    useEffect(() => {
        if (JSON.parse(localStorage.getItem('userid'))) {
            const userId = JSON.parse(localStorage.getItem('userid'));

            const checkUserValid = async () => {
                try {
                    const data = {
                        id: userId
                    }

                    const dataResponse = await authApi.checkUserId(data);

                    if (dataResponse.err) {
                        history.replace('/login');
                        return toast_error(dataResponse.err)
                    }

                    localStorage.setItem('user', JSON.stringify(dataResponse.user));
                    await dispatch({ type: "USERLOGIN", payload: dataResponse.user });

                    // update socket.id
                    if(state._id){
                        updateSocketId(state._id);
                    }

                    return;
                } catch (error) {
                    console.log(error);
                }
            }

            checkUserValid();
        } else {
            history.replace('/login')
        }
    }, [])


    const selectedUser = (user) => {
        setSelectedUserData(user);
    }

    const conversationData = (data) => {
        setConversation(data);
    }

    const renderChatList = () => {
        if (state) {
            return (
                <MessageList selectedUser={(user) => selectedUser(user)} latestMessage={latestMessage} conversationData={(data) => conversationData(data)} />
            )
        }

    }

    const getLatestMessage = (mess) => {
        // send to MessageList
        setLatestMessage(mess);
    }


    return (
        <div className="home-page">
            <div className="chat-container">
                {renderChatList()}
                <div className="message-container">
                    {selectedUserData
                        ? <Message selectedUserData={selectedUserData} getLatestMessage={(mess) => getLatestMessage(mess)} conversationData={conversation} />
                        : <div className="welcome-banner">
                            <span className="text-welcome">Welcome, {state ? state.name ? state.name : null : null}!</span>
                            <div className='ava-welcome'>
                                <div className='avatar-welcome' style={{ backgroundImage: `url(${state ? state.avatar ? state.avatar : defaultAvatar : defaultAvatar})` }}></div>
                            </div>
                            <span className="text-desc">Let's start talking. Great things might happen.</span>
                        </div>
                    }
                </div>
            </div>

        </div>
    );
}

export default Home;
