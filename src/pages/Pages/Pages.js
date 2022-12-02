import { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addNotificationsNumberHandler } from "../../Store/notificationsNumber";

import Header from "../../shared/header/Header";
import Loader from "../../shared/loader/Loader";
import MobileBtns from "../../shared/mobileBtns/mobileBtns";
import Home from "./Components/Home/Home";
import Friends from "./Components/Wall/Friends";
import TrendPage from "./Components/TrendPage/TrendPage";
import Notifications from "./Components/Notifications/Notifications";
import MyVote from "./Components/MyVote/MyVote";
import Notification from "../../shared/Notification/Notification";

import "./Pages.scss";
import { Route, Routes } from "react-router-dom";
import Add from "./Components/Add/Add";

const Pages = function () {
  const [notifications, setNotifications] = useState(false);
  const loader = useSelector((state) => state.loader);
  const socket = useSelector((state) => state.socket.socket);
  const dispatch = useDispatch();

  const setNotificationsHnadler = useCallback(
    (msg) => {
      setNotifications(msg);
      dispatch(addNotificationsNumberHandler());
      console.log(msg);
      setTimeout(() => {
        setNotifications(false);
      }, 3500);
    },
    [dispatch]
  );

  useEffect(() => {
    socket.on("getFriendRequest", (data) => {
      data = JSON.parse(data);
      setNotificationsHnadler(data.massage);
    });
  }, [setNotificationsHnadler, socket]);

  return (
    <Fragment>
      {notifications && <Notification msg={notifications} />}
      <Header />
      <div className="Pages contianer_page">
        <div className="Pages_wrapper">
          <MobileBtns />
          <div className="Pages_friends"></div>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/add" element={<Add />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/myvotes" element={<MyVote />} />
          <Route path="/trend/*" element={<TrendPage />} />
        </Routes>
      </div>
      {loader && <Loader />}
      <div className="sperate"></div>
    </Fragment>
  );
};

export default Pages;
