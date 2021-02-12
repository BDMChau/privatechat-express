import React, { useReducer } from 'react';
import './styles/App.css';
import { Switch, Route, BrowserRouter } from "react-router-dom";

import Login from './pages/Auth/Login/Login';
import SignUp from './pages/Auth/SignUp/SignUp';
import Home from './pages/Msg/Home/Home';
import Profile from './pages/User/Profile/Profile';
import ResetPass from './pages/Auth/ResetPass/ResetPass';
import SendEmail from './pages/Auth/SendEmail/SendEmail';
import NavBar from './component/NavBar/NavBar';

// context, reducer
import { Context } from './context/AppContext';
import { profile, initialState } from './Reducer/profileReducer';
import { listUserOnline, initialListOnline } from './Reducer/listUserOnlineReducer';
import { listUserOffline, initialListOffline } from './Reducer/listUserOfflineReducer';
import NotFound from './pages/404 page/NotFound';


const Routing = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>

      <Route path="/login">
        <Login />
      </Route>

      <Route path="/loginbygoogle">
        <Login />
      </Route>

      <Route path="/signup">
        <SignUp />
      </Route>

      <Route path="/profile">
        <Profile />
      </Route>

      <Route path="/resetpass/:tokenResetPassword">
        <ResetPass />
      </Route>

      <Route path="/sendemail">
        <SendEmail />
      </Route>

      <Route>
        <NotFound />
      </Route>

    </Switch>
  )
}

const App = () => {
  const [state, dispatch] = useReducer(profile, initialState);
  const [listOnl, setListOnl] = useReducer(listUserOnline, initialListOnline);
  const [listOff, setListOff] = useReducer(listUserOffline, initialListOffline);

  return (
    <Context.Provider value={{
      state,
      dispatch,

      listOnl,
      setListOnl,

      listOff,
      setListOff
    }}>

      <BrowserRouter>
        <div>
          <NavBar />
        </div>
        {Routing()}

      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
