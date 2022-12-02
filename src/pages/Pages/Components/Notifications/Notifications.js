import { useDispatch, useSelector } from "react-redux";
import { Fragment, memo, useCallback, useEffect, useState } from "react";

import Contianer from "../../../../shared/contianer/Contianer";
import FriendRequest from "../../../../shared/FriendRequest/FriendRequest";
import PopUpModal from "../../../../shared/popupmodal/PopUpModal";
import ToggleBtns from "../../../../shared/ToggleBtns/ToggleBtns";

import Fetch from "../../../../functions/Fetch";
import GetLocalStorage from "../../../../functions/GetLocalStorage";
import { setNotificationsNumberHandler } from "../../../../Store/notificationsNumber";
import { changeLoaderHandler } from "../../../../Store/Store";

import "./Notifications.scss";

const Notifications = (props) => {
  const [friendsReq, setFriendsReq] = useState(false);
  const [myReq, setMyReq] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [error, setErorr] = useState(false);
  const loader = useSelector((state) => state.loader);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMyFriendsRequests = async () => {
      try {
        dispatch(changeLoaderHandler());
        const data = await Fetch(process.env.REACT_APP_FETCH_URL + "users/getmyfriendrequests/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(GetLocalStorage("token"))}`,
          },
        });
        await setFriendsReq(data);
        const myRequests = await Fetch(process.env.REACT_APP_FETCH_URL + "users/getmysendrequst", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(GetLocalStorage("token"))}`,
          },
        });
        if (myRequests) setMyReq(myRequests);
        dispatch(changeLoaderHandler());
      } catch (err) {}
    };
    dispatch(setNotificationsNumberHandler({ number: 0 }));
    getMyFriendsRequests();
  }, [dispatch]);

  const closePopUpHandler = function () {
    setSuccessMsg(false);
    setErorr(false);
  };

  const changeFriendsRequest = function (id) {
    setFriendsReq((prev) => prev.filter((req) => req.requestId !== id));
  };

  const removeMyRequestHnadler = useCallback(
    async (id) => {
      dispatch(changeLoaderHandler());
      const data = await Fetch(process.env.REACT_APP_FETCH_URL + "users/deletemysendrequst/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(GetLocalStorage("token"))}`,
        },
      });
      setMyReq((prev) => prev.filter((req) => req.requestId !== id));
      dispatch(changeLoaderHandler());
      if (data.error) setErorr(data.error);
      else setSuccessMsg(data.massage);
    },
    [dispatch]
  );

  const changeToggle = (value) => {
    setToggle(value);
  };

  return (
    <Fragment>
      {successMsg && <PopUpModal massage={successMsg} function={closePopUpHandler} />}
      {error && <PopUpModal massage={error} function={closePopUpHandler} />}
      <Contianer classes="notificationsPage">
        <ToggleBtns text1="notifications" text2="my requests" toggle={toggle} setToggle={changeToggle} />
        {!toggle && (
          <div className="notificationsPage_wrapper">
            {!loader && (!myReq || myReq.length === 0) && <h2 className="notificationsPage_title">No requests found</h2>}
            {myReq &&
              myReq &&
              myReq.map((user, index) => (
                <FriendRequest
                  key={index + Math.random()}
                  data={user}
                  setSuccessMsg={setSuccessMsg}
                  setErorr={setErorr}
                  changeFriendsRequest={changeFriendsRequest}
                  removeText="REMOVE"
                  hideAccept={true}
                  removeHandler={removeMyRequestHnadler}
                />
              ))}
          </div>
        )}
        {toggle && (
          <div className="notificationsPage_wrapper">
            {!loader && (!friendsReq || friendsReq.length === 0) && <h2 className="notificationsPage_title">No notifications found</h2>}
            {friendsReq &&
              friendsReq &&
              friendsReq.map((user, index) => (
                <FriendRequest
                  key={index + Math.random()}
                  data={user}
                  setSuccessMsg={setSuccessMsg}
                  setErorr={setErorr}
                  changeFriendsRequest={changeFriendsRequest}
                />
              ))}
          </div>
        )}
      </Contianer>
    </Fragment>
  );
};

export default memo(Notifications);
