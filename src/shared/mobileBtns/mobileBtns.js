import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "./../icons/Home";
import Friend from "../icons/Friend";
import Bell from "../icons/Bell";
import Plus from "../icons/Plus";
import Vote from "./../icons/Vote";

import "./mobileBtns.scss";

const onClickHandler = function (event) {
  const btns = document.querySelectorAll(".active_btn");
  btns.forEach((btn) => btn.classList.remove("active_btn"));
  event.currentTarget.classList.add("active_btn");
};

const MobileBtns = function () {
  const notificationsNumber = useSelector((state) => state.notificationsNumber);

  return (
    <Fragment>
      <div className="mobileBtns_sperate"></div>
      <div className="mobileBtns">
        <div className="mobileBtns_wrapper">
          <NavLink to={"/"} className={(navData) => (navData.isActive ? "active_btn mobileBtns_btn" : "mobileBtns_btn")} onClick={onClickHandler}>
            <Home class={"mobileBtns_btn-icon"} />
            <span className="mobileBtns_btn-text">Home</span>
          </NavLink>
          <NavLink
            to={"/friends"}
            className={(navData) => (navData.isActive ? "active_btn mobileBtns_btn" : "mobileBtns_btn")}
            onClick={onClickHandler}
          >
            <Friend class={"mobileBtns_btn-icon"} />
            <span className="mobileBtns_btn-text">Friends</span>
          </NavLink>
          <NavLink
            to={"/add"}
            className={(navData) => (navData.isActive ? "active_btn mobileBtns_btn mobileBtns_btn-middle" : "mobileBtns_btn mobileBtns_btn-middle")}
            onClick={onClickHandler}
          >
            <Plus class={"mobileBtns_btn-icon"} />
            <span className="mobileBtns_btn-text">Add</span>
          </NavLink>
          <NavLink
            to={"/notifications"}
            className={(navData) => (navData.isActive ? "active_btn mobileBtns_btn" : "mobileBtns_btn")}
            onClick={onClickHandler}
          >
            <div className="mobileBtns_btn-wrapper">
              {notificationsNumber > 0 && <div className="mobileBtns_btn-notifications">{notificationsNumber}</div>}
              <Bell class={"mobileBtns_btn-icon"} />
            </div>
            <span className="mobileBtns_btn-text">Notifications</span>
          </NavLink>
          <NavLink
            to={"/myvotes"}
            className={(navData) => (navData.isActive ? "active_btn mobileBtns_btn" : "mobileBtns_btn")}
            onClick={onClickHandler}
          >
            <Vote class={"mobileBtns_btn-icon"} />
            <span className="mobileBtns_btn-text">My votes</span>
          </NavLink>
        </div>
      </div>
    </Fragment>
  );
};

export default MobileBtns;
