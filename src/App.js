import { useEffect, useState, Fragment, memo } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import GetLocalStorage from "./functions/GetLocalStorage";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { setUserIdHandler } from "./Store/UserId";
import { setSocketHandler } from "./Store/Socket";
import { setNotificationsNumberHandler } from "./Store/notificationsNumber";
import Fetch from "./functions/Fetch";

import Login from "./pages/Login/Login";
import Pages from "./pages/Pages/Pages";
import PopUpModal from "./shared/popupmodal/PopUpModal";
import Forgot from "./pages/Forgot/Forgot";

import "./App.scss";

function App() {
  const [token, setToken] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [userId, setUserId] = useState(false);
  const [socket, setSocket] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async function () {
      setToken(GetLocalStorage("token"));
      if (token) {
        const { exp, userId } = jwt_decode(token);
        dispatch(setUserIdHandler({ userId: userId }));
        setUserId(userId);
        const expirationTime = exp * 1000 - 60000;
        if (Date.now() >= expirationTime) {
          setIsLogout(true);
        } else {
          const remaningTime = expirationTime - new Date();
          if (window.location.href.indexOf("notifications") === -1) {
            const data = await Fetch(process.env.REACT_APP_FETCH_URL + "users/getnotificationsnumber/" + userId);
            dispatch(setNotificationsNumberHandler({ number: data.notifications }));
          }
          setTimeout(() => {
            setIsLogout(true);
          }, remaningTime);
        }
      }

      if (!GetLocalStorage("token") && !window.location.href.includes(process.env.REACT_APP_SITE_URL + "forgot")) {
        navigate("/");
      }
    };

    checkToken();
  }, [dispatch, navigate, token]);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    dispatch(setSocketHandler({ socket: socket }));
    if (userId) socket.emit("newUser", userId);
    setSocket(socket);
  }, [dispatch, userId]);

  const logOutHandler = function () {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <Fragment>
      {isLogout && <PopUpModal massage="Expiration Time is over" function={logOutHandler} />}
      <Routes>
        {!token && (
          <Fragment>
            <Route path="/*" element={<Login />} />
            <Route path="forgot" element={<Forgot />} />
          </Fragment>
        )}

        {token && (
          <Fragment>
            <Route path="/*" element={<Pages />} />
          </Fragment>
        )}
      </Routes>
    </Fragment>
  );
}

export default memo(App);
