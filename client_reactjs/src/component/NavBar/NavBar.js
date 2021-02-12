import React, { useContext } from 'react';
import './NavBar.css';
import { Menu } from 'antd';
import { LogoutOutlined, HomeOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { useHistory, NavLink } from "react-router-dom";
import { Context } from '../../context/AppContext';
import authApi from '../../api/authApi';
import { toast_success, toast_error } from '../../utils/toast/toast';

const NavBar = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(Context);


    const handleLogout = async () => {
        if (state) {
            try {
                const data = {
                    userId: state._id
                };

                const dataResponse = await authApi.signOut(data);

                if (dataResponse.err) {
                    return toast_error(dataResponse.err);
                }

                history.replace('/login');
                dispatch({ type: "LOGOUT" });
                localStorage.clear();

                toast_success(dataResponse.msg);
            } catch (error) {
                console.log(error);
            }
        } else {
            history.replace('/login');
        }

    }

    const renderItem = () => {
        if (state) {
            return (
                <div style={{ width: '100%', outline: 'none', boxShadow: 'none', border: 'none' }} >
                    <Menu className="menu-home" mode="horizontal">
                        <Menu.Item className="menu-item" title="Home" key="home" icon={<HomeOutlined style={{ fontSize: '25px' }} />}><NavLink to="/"></NavLink> </Menu.Item>
                    </Menu>

                    <Menu className="menu" mode="horizontal">
                        <Menu.Item className="menu-item" title="Home" key="home" icon={<UserOutlined style={{ fontSize: '20px' }} />}> Profile <NavLink to="/profile"></NavLink> </Menu.Item>

                        <Menu.Item className="menu-item" title="Log Out" key="signout" onClick={() => handleLogout()} icon={<LogoutOutlined style={{ fontSize: '20px' }} />}> Log out </Menu.Item>
                    </Menu>
                </div>
            )
        } else {
            return (
                <Menu className="menu" mode="horizontal">
                    <Menu.Item className="menu-item" title="Log In" key="signout" onClick={() => handleLogout()} icon={<LoginOutlined style={{ fontSize: '20px' }} />}> Log in </Menu.Item>
                </Menu>
            )
        }
    }

    return (
        <div className="navbar">
            {renderItem()}
        </div>
    );
}

export default NavBar;
