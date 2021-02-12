import React, { useState, useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import './SendMessageForm.css';
import { Button, Input, Form } from 'antd';
import { sendMessageSocket, sendImageSocket, sendStickerSocket } from '../../../socket/socketClient';
import { stickerPiyomaruArray } from '../../../utils/sticker/piyomaru'
import { AreaChartOutlined, SendOutlined, TagsOutlined } from '@ant-design/icons';
import { Context } from '../../../context/AppContext';
import Axios from 'axios';


const SendMessageForm = (props) => {
    const { selectedId, conversationData } = props;

    const [message, setMessage] = useState('');
    const [urlImage, setUrlImages] = useState('');
    const [urlSticker, setUrlSticker] = useState('');

    const [hoverImageBtn, setHoverImageBtn] = useState(Boolean);
    const [hoverSendBtn, setHoverSendBtn] = useState(Boolean);
    const [hoverStickerBtn, setHoverStickerBtn] = useState(Boolean);
    const [displaySticker, setDisplaySticker] = useState(Boolean);

    const inputRef = useRef();
    const { state } = useContext(Context);


    useEffect(() => {
        inputRef.current.focus();
        setMessage('');
        setUrlImages('');
    }, [selectedId])

    // send image
    useEffect(() => {
        if (urlImage) {
            sendImageSocket(urlImage, conversationData);
            setUrlImages('');
        }
    }, [urlImage && conversationData])

    // send sticker
    useEffect(() => {
        if (urlSticker) {
            sendStickerSocket(urlSticker, conversationData);
            setUrlSticker('');
        }
    }, [urlSticker && conversationData])

    // send text
    const sendMessage = (e) => {
        if (e) {
            e.preventDefault();

            const trimmedMess = message.trim();
            if (trimmedMess) {
                sendMessageSocket(trimmedMess, conversationData);
                setMessage('');
            }
        }
    }


    const handlePostImage = async (files) => {
        try {
            const fileForm = new FormData;
            Object.values(files).map((file) => {
                fileForm.append("file", file);
            })

            Axios({
                //url: "http://filesuploadserver.herokuapp.com/api/user/uploadfiles",
                url: "http://localhost:4000/api/user/uploadfiles",

                method: "post",
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiIxZjM2NDEyNGJmNjFhMGNhMmZmMyIsInVzZXJuYW1lIjoiTWluaENoYXUiLCJpYXQiOjE2MDk2NzI5MzN9.SEf_Ji7Oy-_7juSBVo7cLgaRVwqHjJbTIzC0n4qcIDo"
                },
                data: fileForm
            }).then((res) => {
                console.log(res.data)
            })

            // var formData = new FormData();
            // formData.append("file", file);
            // formData.append("upload_preset", "chatApp");
            // formData.append("cloudinary_name", "do3l051oy");
            // formData.append('folder', 'chatApp_Avatar');

            // const dataResponse = await msgApi.postImageToCloud(formData);
            // setUrlImages(dataResponse.url);
            return;

        } catch (error) {
            console.log(error);
        }
    }


    const renderStickerCollection = () => {
        return (
            <div className="sticker-container">
                { stickerPiyomaruArray.map((sticker, i) => {
                    return (
                        <img key={i} className="sticker-item" src={sticker} onClick={(e) => setUrlSticker(e.target.src)} alt='' />
                    )
                })}
            </div>
        )

    }

    return (
        <div className="send-mess-form">
            {displaySticker
                ? renderStickerCollection()
                : null
            }
            <Form
                className="input"
                onKeyPress={(e) => e.key === 'Enter' ? sendMessage(e) : null}
            >
                <Input
                    className="input-text"
                    title="Type a message..."
                    type="text"
                    value={message}
                    placeholder="Type a message..."
                    onChange={(e) => setMessage(e.target.value)}
                    ref={inputRef}
                />

                <div className="btn">
                    <div
                        className="sticker-box"
                        onClick={() => setDisplaySticker(!displaySticker)}
                        onMouseOver={() => setHoverStickerBtn(true)}
                        onMouseLeave={() => setHoverStickerBtn(false)}
                    >
                        <TagsOutlined className="sticker-icon" style={{ color: hoverStickerBtn ? '#0e7adc' : '#238ff1' }} />
                    </div>

                    <div className="image-box">
                        <Input
                            className="input-image"
                            value={""}
                            title="Photo"
                            type="file"
                            onChange={(e) => handlePostImage(e.target.files)}
                            onMouseOver={() => setHoverImageBtn(true)}
                            onMouseLeave={() => setHoverImageBtn(false)}
                            multiple={true}

                        />
                        <AreaChartOutlined className="photo-icon" style={{ color: hoverImageBtn ? '#0e7adc' : '#238ff1' }} />
                    </div>

                    <Button
                        className="btn-send"
                        title="Send"
                        type="submit"
                        onClick={(e) => sendMessage(e)}
                        onMouseOver={() => setHoverSendBtn(true)}
                        onMouseLeave={() => setHoverSendBtn(false)}
                    >
                        <SendOutlined className="send-icon" style={{ color: hoverSendBtn ? '#0e7adc' : '#238ff1' }} />
                    </Button>
                </div>
            </Form>
        </div>
    );
}

SendMessageForm.propTypes = {
    selectedId: PropTypes.string,
    conversationData: PropTypes.object
}


export default SendMessageForm;
