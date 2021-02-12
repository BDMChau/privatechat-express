import React, { useState, useEffect, useContext, useRef } from 'react';
import './Profile.css'
import { Input, Menu, Dropdown } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Context } from '../../../context/AppContext';
import { useHistory } from "react-router-dom";
import { defaultAvatar } from '../../../utils/avatar/avatar'
import userApi from '../../../api/userApi';
import { toast_success, toast_error } from '../../../utils/toast/toast';


const Profile = () => {
    const { state, dispatch } = useContext(Context);
    const [newName, setNewName] = useState(state ? state.name : '');
    const [editNameStt, setEditNameStt] = useState(Boolean);
    const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
    const inputRef = useRef(null);
    const history = useHistory();

    useEffect(() => {
        if (!state) {
            history.replace('/login')
        }
    }, [])

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [editNameStt])

    const handleEditName = async () => {
        try {
            const data = {
                newName: newName
            }

            const dataResponse = await userApi.changeName(data, token);

            localStorage.setItem('user', JSON.stringify({ ...state, name: dataResponse.name }));
            dispatch({ type: "UPDATENAME", payload: dataResponse.name });

            setEditNameStt(false);
            return toast_success(dataResponse.msg)

        } catch (error) {
            console.log(error);
            return toast_error('Update failed')
        }
    }

    const handleEditAvatar = async (avatar) => {
        try {
            var formData = new FormData();
            formData.append("file", avatar);
            formData.append("upload_preset", "chatApp");
            formData.append("cloudinary_name", "do3l051oy");
            formData.append('folder', 'chatApp_Avatar');

            const avatarResponse = await userApi.postAvatarToCloud(formData);

            const data = {
                avatar: avatarResponse.url
            }

            const dataResponse = await userApi.addAvatar(data, token);

            if (dataResponse.err) {
                return toast_error(dataResponse.err);
            }

            localStorage.setItem('user', JSON.stringify({ ...state, avatar: dataResponse.avatar }));
            dispatch({ type: "UPDATEAVATAR", payload: dataResponse.avatar });

            return toast_success(dataResponse.msg);

        } catch (error) {
            console.log(error);
            return toast_error('Updated failed');
        }
    }

    const handleRemoveAvatar = async () => {
        try {
            const data = {
                userId: state._id
            }

            const dataResponse = await userApi.removeAvatar(data, token);

            if (dataResponse.err) {
                return toast_error(dataResponse.err)
            }

            localStorage.setItem('user', JSON.stringify({ ...state, avatar: dataResponse.avatar }));
            dispatch({ type: "UPDATEAVATAR", payload: dataResponse.avatar });
            return toast_success(dataResponse.msg);

        } catch (error) {
            console.log(error);
            return toast_error('Updated failed');
        }
    }

    const renderDropDown = () => {
        return (
            <Menu className="menu-avatar">
                <Menu.Item key="0" title="Change Avatar" className="menu-avatar-item">
                    <Input
                        title="Change Avatar"
                        className="input-avatar-menu-item"
                        type="file"
                        onChange={(e) => handleEditAvatar(e.target.files[0])}

                    />
                    Change Avatar
                </Menu.Item>
                <Menu.Item key="1" title="Remove Avatar" onClick={() => handleRemoveAvatar()} className="menu-avatar-item">
                    Remove Avatar
                </Menu.Item>
            </Menu>
        )
    }

    return (
        state
            ? <div className='row profile'>
                <div className="avatar-form">
                    <div
                        className='avatar'
                        style={{
                            backgroundImage: `url(${state ? state.avatar ? state.avatar : defaultAvatar : null})`,
                        }}>

                    </div>
                    {state.avatar
                        ? <Dropdown overlay={renderDropDown()} trigger={['click']} className="input-avatar" title="Avatar">
                            <p title="Avatar"></p>
                        </Dropdown>
                        : <Input
                            title="Avatar"
                            className="input-avatar"
                            type="file"
                            onChange={(e) => { handleEditAvatar(e.target.files[0]) }}

                        />

                    }
                </div>
                {editNameStt
                    ? <div>
                        <Input
                            type="text"
                            title="Change Name"
                            className='input-change-name'
                            value={newName}
                            placeholder='Nickname...'
                            ref={inputRef}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' ? handleEditName() : null}

                        />
                        <CloseOutlined
                            className="close-name-icon"
                            onClick={() => setEditNameStt(false)}
                        />
                    </div>

                    : <div className="name-form-edit">
                        <span
                            className="name"
                            title={state ? state.name : null}
                        >
                            {state ? state.name : null}
                        </span>
                        <EditOutlined
                            className="edit-name-icon"
                            onClick={() => setEditNameStt(true)}
                        />
                    </div>
                }
            </div>
            : null
    );
}

export default Profile;
