import { useDispatch } from "react-redux";
import { changeLoaderHandler } from "../../Store/Store";
import Fetch from "../../functions/Fetch";
import GetLocalStorage from "../../functions/GetLocalStorage";

import User from "../icons/User";

import "./FriendRequest.scss";
import { memo } from "react";

const FriendRequest = (props) => {
  const dispach = useDispatch();

  const onAcceptHnadler = async function (answer) {
    dispach(changeLoaderHandler());
    try {
      const data = await Fetch(process.env.REACT_APP_FETCH_URL + "users/acceptorreject", {
        method: "POST",
        body: JSON.stringify({ requestId: props.data.requestId, answer: answer }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(GetLocalStorage("token"))}`,
        },
      });
      if (data.error) props.setErorr(data.error);
      else props.setSuccessMsg(data.massage);
      props.changeFriendsRequest(props.data.requestId);
    } catch (err) {
      console.log(err);
    }
    dispach(changeLoaderHandler());
  };

  const functionHandler = async function () {
    await props.removeHandler(props.data.requestId);
  };

  return (
    <div className="friendReq">
      <div className="friendReq_wrapper">
        {props.data.image && <img className="friendReq_image" src="" alt="" />}
        {!props.data.image && <User class="friendReq_image" />}
        <h4 className="friendReq_title">{props.data.name}</h4>
      </div>

      <div className="friendReq_btns">
        {!props.hideAccept && (
          <button
            className="friendReq_add"
            onClick={() => {
              onAcceptHnadler("true");
            }}
          >
            ACCEPT
          </button>
        )}
        <button
          className="friendReq_reject"
          onClick={
            !props.removeHandler
              ? () => {
                  onAcceptHnadler("false");
                }
              : functionHandler
          }
        >
          {props.removeText ?? "REJECT"}
        </button>
      </div>
    </div>
  );
};

export default memo(FriendRequest);
