import React, { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import './Message.css';
import { socket } from '../../../socket/socketClient';
import SendMessageForm from '../SendMessageForm/SendMessageForm';
import { Context } from '../../../context/AppContext';
import { defaultAvatar } from '../../../utils/avatar/avatar'
import msgApi from '../../../api/msgApi';

const Message = (props) => {
    const { selectedUserData, conversationData, getLatestMessage } = props;

    const [data, setData] = useState([]);
    const [skipMessage, setSkipMessage] = useState(0);

    const [gettingAPI, setGettingAPI] = useState(true);
    const [sttScroll, setSttScroll] = useState(false);
    const [isEnd, setIsEnd] = useState(false); // end conservation

    const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')));

    const scrollRef = useRef();
    const { state } = useContext(Context);


    // get message api
    useEffect(() => {
        setData([]);
        setGettingAPI(true);
        setSkipMessage(20);
        setIsEnd(false);

        const fetchMessage = async () => {
            try {
                const data = {
                    userId: state._id,
                    selectedId: selectedUserData._id,
                    skipMessage: 0,
                    quantityMessage: 20
                };

                const dataResponse = await msgApi.fetchMessage(data, token);

                if (dataResponse.err) {
                    setGettingAPI(false);
                    return;
                }

                const reverseData = dataResponse.reverse();

                setData(reverseData);
                setGettingAPI(false);
                return;
            } catch (error) {
                console.log(error);
            }
        }

        fetchMessage();
    }, [selectedUserData])

    //  get new message socket realtime
    useEffect(() => {
        socket.on('newMessage', (result) => {
            setData(data => [...data, result]);

            // send to Home
            getLatestMessage(result);
        });
    }, []);


    // handle scroll when loading message
    useEffect(() => {
        // when first loading message
        const setSttTime1 = setTimeout(() => {
            setSttScroll(false);
        })

        // when get more message >>> see function handleScrollGetMoreMessage()
        const setSttTime2 = setTimeout(() => {
            setSttScroll(true);
        }, 1000)

        return () => {
            clearTimeout(setSttTime1)
            clearTimeout(setSttTime2)
        };
    }, [selectedUserData._id]);

    // handle auto scroll 
    useEffect(() => {
        let myRef = scrollRef.current;
        if (myRef) {
            const currentScroll = myRef.scrollTop + myRef.clientHeight;

            // auto scroll to bottom when have new message
            if (currentScroll + 300 >= myRef.scrollHeight) {
                myRef.scrollTop = myRef.scrollHeight;
            }

            // when first loading message
            else if (sttScroll === false) {
                if (myRef.scrollTop === 0) {
                    myRef.scrollTop = myRef.scrollHeight;
                }
            }

            // when get more message >>> see function handleScrollGetMoreMessage()
            else if (sttScroll === true) {
                if (myRef.scrollTop === 0) {
                    if (!isEnd) {
                        myRef.scrollTop = 500;
                    }
                }
            }
        }
    })


    const handleScrollGetMoreMessage = async (e) => {
        if (e.target.scrollTop === 0) {
            try {
                const data = {
                    userId: state._id,
                    selectedId: selectedUserData,
                    skipMessage: skipMessage,
                    quantityMessage: 10
                }

                const dataResponse = await msgApi.fetchMoreMessage(data, token);
                if (dataResponse.err) {
                    setIsEnd(true);
                    return;
                }

                const reverseData = dataResponse.reverse();

                setData(data => [...reverseData, ...data]);
                setSkipMessage(skipMessage + 10);
                return;

            } catch (error) {
                console.log(error);
            }
        }
    }

    const renderRightMessage = (mess) => {
        if (selectedUserData._id === mess.to._id) {
            if (mess.message) {
                return (
                    <div className="mess-box">
                        <p className="text">{mess.message}</p>
                        <div className='mess-ava'>
                            <div className='mess-avatar' style={{ backgroundImage: `url(${mess.from.avatar ? mess.from.avatar : defaultAvatar})` }}></div>
                        </div>
                    </div>
                )
            }
            if (mess.images) {
                return (
                    <div className="mess-box">
                        <div className='mess-image' style={{ backgroundImage: `url(${mess.images ? mess.images : null})` }}></div>
                        <div className='mess-ava'>
                            <div className='mess-avatar' style={{ backgroundImage: `url(${mess.from.avatar ? mess.from.avatar : defaultAvatar})` }}></div>
                        </div>
                    </div>
                )
            }
            if (mess.sticker) {
                return (
                    <div className="mess-box">
                        <img className="mess-sticker" src={mess.sticker} alt="" />
                        <div className='mess-ava'>
                            <div className='mess-avatar' style={{ backgroundImage: `url(${mess.from.avatar ? mess.from.avatar : defaultAvatar})` }}></div>
                        </div>
                    </div>
                )
            }
        } else {
            return null;
        }
    }

    const renderLeftMessage = (mess) => {
        if (selectedUserData._id === mess.from._id) {
            if (mess.message) {
                return (
                    <div className="mess-box">
                        <div className='mess-ava'>
                            <div className='mess-avatar' style={{ backgroundImage: `url(${mess.from.avatar ? mess.from.avatar : defaultAvatar})` }}></div>
                        </div>
                        <p className="text">{mess.message}</p>
                    </div>
                )
            }
            if (mess.images) {
                return (
                    <div className="mess-box">
                        <div className='mess-ava'>
                            <div className='mess-avatar' style={{ backgroundImage: `url(${mess.from.avatar ? mess.from.avatar : defaultAvatar})` }}></div>
                        </div>
                        <div className='mess-image' style={{ backgroundImage: `url(${mess.images ? mess.images : null})` }}></div>
                    </div>
                )
            }
            if (mess.sticker) {
                return (
                    <div className="mess-box">
                        <div className='mess-ava'>
                            <div className='mess-avatar' style={{ backgroundImage: `url(${mess.from.avatar ? mess.from.avatar : defaultAvatar})` }}></div>
                        </div>
                        <img className="mess-sticker" src={mess.sticker} alt="" />
                    </div>
                )
            }
        } else {
            return null;
        }
    }

    const renderSayHiNewFriend = () => {
        return (
            <div className="selected-user-profile">
                <div className='selected-user-ava'>
                    <div className='selected-user-avatar' style={{ backgroundImage: `url(${selectedUserData.avatar ? selectedUserData.avatar : defaultAvatar})` }}></div>
                </div>
                <span className="selected-user-name">
                    {selectedUserData.name ? selectedUserData.name : null}
                </span>

                <div className="selected-user-sayhi">
                    <span className="selected-user-text-sayhi">
                        Say hi to new friend
                                </span>
                    <img className="selected-user-icon-sayhi" src={require('../../../assets/img/sayhi.png')} title="say hi" alt="" />
                </div>
            </div>
        )
    }

    return (
        <div className="chat-msg" onScroll={(e) => handleScrollGetMoreMessage(e)}>
            <div className="msg-container" ref={scrollRef}>
                {gettingAPI
                    ? <p>Loading...</p>
                    : data.length
                        ? data.map((mess, i) => {
                            return (
                                <div className={mess.from._id === state._id ? 'rightMessage' : 'leftMessage'} key={i}>
                                    {mess.from._id === state._id
                                        ? renderRightMessage(mess)
                                        : renderLeftMessage(mess)
                                    }
                                </div>
                            )
                        })
                        : selectedUserData
                            ? renderSayHiNewFriend()
                            : null
                }
            </div>
            <div>
                <SendMessageForm userId={state._id} selectedId={selectedUserData._id} conversationData={conversationData} />
            </div>
        </div>
    );

}

Message.propTypes = {
    selectedUserData: PropTypes.shape({
        _id: PropTypes.string,
        avatar: PropTypes.string,
        name: PropTypes.string
    }),
    getLatestMessage: PropTypes.func
}

export default Message;
