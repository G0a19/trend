import { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLoaderHandler } from "./../../Store/Store";
import User from "./../../shared/icons/User";
import MainBtn from "./../../shared/btns/MainBtn";
import Fetch from "./../../functions/Fetch";
import GetLocalStorage from "./../../functions/GetLocalStorage.js";

import "./UserCard.scss";

const UserCard = function (props) {
  const dispatch = useDispatch();
  const [alreadySend, setAlreadySend] = useState(false);
  const [acceptSend, setAcceptSend] = useState(false);
  const socket = useSelector((state) => state.socket.socket);
  const userId = useSelector((state) => state.userId);

  useEffect(() => {
    if (props.user.alreadySend) setAlreadySend(props.user.alreadySend);
    if (props.user.acceptSend) setAcceptSend(props.user.acceptSend);
  }, [props.user.alreadySend, props.user.acceptSend, socket, props]);

  const addFriendHandler = async () => {
    dispatch(changeLoaderHandler());
    const data = await Fetch(process.env.REACT_APP_FETCH_URL + "users/addfriends", {
      method: "POST",
      body: JSON.stringify({ friendId: props.user.id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(GetLocalStorage("token"))}`,
      },
    });
    if (data.error) props.handlerRequset(data.error);
    else props.handlerRequset(data.massage);
    setAlreadySend(data.request._id);
    await socket.emit("sendFriendRequest", { senderId: userId, receiverId: props.user.id });
    dispatch(changeLoaderHandler());
  };

  const removeFriendRequestHandler = async () => {
    dispatch(changeLoaderHandler());
    const data = await Fetch(process.env.REACT_APP_FETCH_URL + "users/deletemysendrequst/" + alreadySend, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(GetLocalStorage("token"))}`,
      },
    });
    if (data.error) props.handlerRequset(data.error);
    else props.handlerRequset(data.massage);
    setAlreadySend(false);
    dispatch(changeLoaderHandler());
  };

  const acceptSendHandler = async () => {
    dispatch(changeLoaderHandler());
    const data = await Fetch(process.env.REACT_APP_FETCH_URL + "users/acceptorreject/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(GetLocalStorage("token"))}`,
      },
      body: JSON.stringify({ requestId: acceptSend, answer: "true" }),
    });
    if (data.error) props.handlerRequset(data.error);
    else props.handlerRequset(data.massage);
    setAlreadySend(false);
    props.handlerAccept(props.user.id, props.dataFriends);
    dispatch(changeLoaderHandler());
  };

  return (
    <div className="userCard">
      {props.image ? <img src={props.image} alt="user" /> : <User />}
      <h2 className="userCard_name">{props.user.fullName}</h2>
      {!alreadySend && !acceptSend && <MainBtn text="ADD" handler={addFriendHandler} />}
      {alreadySend && <MainBtn text="Remove" handler={removeFriendRequestHandler} />}
      {acceptSend && <MainBtn text="Accept" handler={acceptSendHandler} />}
    </div>
  );
};

export default memo(UserCard);
