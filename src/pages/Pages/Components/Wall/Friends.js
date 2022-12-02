import { useState, useEffect, Fragment, memo } from "react";
import uuid from "react-uuid";
import Search from "../../../../shared/icons/Search";
import UserLoader from "../../../../shared/loader/UserLoader";
import Fetch from "../../../../functions/Fetch";
import GetLocalStorage from "../../../../functions/GetLocalStorage.js";
import UserCard from "../../../../shared/userCard/UserCard";
import PopUpModal from "../../../../shared/popupmodal/PopUpModal";
import { useDispatch } from "react-redux";
import { changeLoaderHandler } from "../../../../Store/Store";

import "./Friends.scss";
import MainBtn from "../../../../shared/btns/MainBtn";
import Contianer from "../../../../shared/contianer/Contianer";

const Friends = function () {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [massage, setMassage] = useState(false);
  const [friends, setFriends] = useState([]);
  const [data, setData] = useState(false);
  let [showLoadMoreBtn, setShowLoadMoreBtn] = useState(true);
  let [showResetBtn, setShowResetBtn] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [numberOfFriends, setNumberOfFriends] = useState(0);
  const openInputClass = isOpen ? "open_input" : "";
  const openBtnClass = isOpen ? "open_btn" : "";

  const sendRequestHandler = (massage) => {
    setMassage(massage);
  };

  const closePopUpHandler = () => {
    setMassage(false);
  };

  const acceptRequestHandler = (id, dataFriends) => {
    dataFriends = dataFriends.filter((friend) => friend.id !== id);
    setData(dataFriends);
    friendsDomHandler(dataFriends);
  };

  const friendsDomHandler = async (data, loadMore = false) => {
    if (loadMore) {
    } else {
      setFriends([]);
    }
    await data.forEach((user, index) =>
      setFriends((prev) => [
        ...prev,
        <UserCard key={uuid()} user={user} handlerRequset={sendRequestHandler} handlerAccept={acceptRequestHandler} dataFriends={data} />,
      ])
    );
  };

  const getUsers = async function (loadMore = false) {
    if (!loadMore) {
      setFriends([]);
      setUsers([]);
    }
    const { innerWidth: width } = window;
    if (width >= 992) {
      for (let numberOfUser = 0; numberOfUser < 8; numberOfUser++) {
        setUsers((prev) => [...prev, <UserLoader key={uuid()} />]);
      }
    } else {
      for (let numberOfUser = 0; numberOfUser < 5; numberOfUser++) {
        setUsers((prev) => [...prev, <UserLoader key={uuid()} />]);
      }
    }

    const data = await Fetch(process.env.REACT_APP_FETCH_URL + "friends/get/" + numberOfFriends, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(GetLocalStorage("token"))}`,
      },
    });

    if (data.length < 8) setShowLoadMoreBtn(false);
    setNumberOfFriends(numberOfFriends + 8);
    setData(data);
    friendsDomHandler(data, loadMore);
    console.log(data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const searchFriendsHandler = async () => {
    if (inputValue.trim().length <= 0) return;
    await dispatch(changeLoaderHandler());
    setInputValue("");
    const dataFetch = await Fetch(process.env.REACT_APP_FETCH_URL + "friends/serach/" + inputValue, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(GetLocalStorage("token"))}`,
      },
    });
    if (dataFetch.error) {
      setMassage(dataFetch.error);
    } else {
      setShowLoadMoreBtn(false);
      setNumberOfFriends(0);
      console.log(dataFetch);
      await friendsDomHandler(dataFetch.users, false);
      setShowResetBtn(true);
    }
    await dispatch(changeLoaderHandler());
  };

  const onSubmitHandler = async function (e) {
    e.preventDefault();
    await searchFriendsHandler();
  };

  const openInputHandler = async function (e) {
    if (isOpen === true) await searchFriendsHandler();
    setIsOpen(!isOpen);
  };

  const loadMoreHandler = async (loadMore = true) => {
    await dispatch(changeLoaderHandler());
    await getUsers(loadMore);
    await dispatch(changeLoaderHandler());
  };

  const onResetHnadler = async () => {
    await dispatch(changeLoaderHandler());
    await getUsers(false);
    await setShowLoadMoreBtn(true);
    await setShowResetBtn(false);
    await dispatch(changeLoaderHandler());
  };

  const inputHandler = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <Fragment>
      {massage && <PopUpModal massage={massage} function={closePopUpHandler} />}
      <Contianer classes={"Friends"}>
        <form className="Friends_input" onSubmit={onSubmitHandler}>
          <input
            className={"Friends_search " + openInputClass}
            type="text"
            placeholder="Search"
            name="friendName"
            onChange={inputHandler}
            value={inputValue}
          />
          <button className={"Friends_input-btn " + openBtnClass} onClick={openInputHandler} type="button">
            <Search class={"Friends_input-svg"} />
          </button>
        </form>

        <div className="Friends_users">{friends.length > 0 ? friends : users}</div>
        {showLoadMoreBtn && data && <MainBtn text="LOAD" classes="Friends_load" handler={loadMoreHandler} />}
        {showResetBtn && !showLoadMoreBtn && data && <MainBtn text="RESET" classes="Friends_load" handler={onResetHnadler} />}
      </Contianer>
    </Fragment>
  );
};

export default memo(Friends);
