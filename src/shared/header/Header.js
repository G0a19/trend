import { memo, Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUserIdHandler } from "../../Store/UserId";
import GetLocalStorage from "./../../functions/GetLocalStorage";
import RemoveLocalStorage from "../../functions/RemoveLocalStorage";
import MoveUser from "../icons/MoveUser/MoveUser";
import SiteLogo from "../SiteLogo/SiteLogo";

import "./Header.scss";
import "./../../scss/helper.scss";

const Header = function () {
  const [token, setToken] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const userId = useSelector((state) => state.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    setToken(GetLocalStorage("token"));
  }, []);

  const showMenuHandler = () => {
    setShowMenu(!showMenu);
  };

  const logOutHandler = () => {
    RemoveLocalStorage("token");
    dispatch(setUserIdHandler({ userId: false }));
    window.location.reload();
  };

  return (
    <Fragment>
      <header className="header">
        <div className="contianer">
          <SiteLogo class="header_logo" />
          {userId && (
            <div className="header_wrapper">
              <MoveUser class="header_wrapper-user" function={showMenuHandler} />
              <div className={`header_wrapper-btns ${showMenu ? "show-menu" : "hide-menu"}`}>
                <button className="header_wrapper-btn">Profile</button>
                <button className="header_wrapper-btn" onClick={logOutHandler}>
                  LogOut
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="speretor"></div>
    </Fragment>
  );
};

export default memo(Header);
