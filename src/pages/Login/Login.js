import { Fragment, useState, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setNotificationsNumberHandler } from "../../Store/notificationsNumber";

import Header from "../../shared/header/Header";
import Input from "../../shared/inputs/Input";
import Submit from "../../shared/btns/Submit";
import Validation from "../../functions/Validation";
import Fetch from "../../functions/Fetch";
import SetLocalStorage from "../../functions/SetLocalStorage";
import Loader from "../../shared/loader/Loader";
import PopUpModal from "../../shared/popupmodal/PopUpModal";
import User from "./../../shared/icons/User";

import "./Login.scss";

const Login = function () {
  const dispatch = useDispatch();
  const [isRegister, setIsRegister] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [secss, setSecss] = useState(false);
  const [goodMsg, setGoodMsg] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  const ChangeFrame = function () {
    setGoodMsg(false);
    setErrMsg(false);
    if (isRegister) {
      setIsRegister(false);
      return;
    }
    setIsRegister(true);
  };

  const onForgotHandler = function (e) {
    setErrMsg(false);
    setGoodMsg(false);
    setIsRegister("forgot");
  };

  const onChangeHandler = useCallback(function (e) {
    setErrMsg(false);
    setFormData((data) => {
      return { ...data, [e.target.name]: e.target.value };
    });
  }, []);

  const onLoginHandler = async function (event) {
    event.preventDefault();
    const keys = Object.keys(formData);
    const values = Object.values(formData);

    if (event.target.getAttribute("data-register") === "forgot") {
      setFormData({ email: formData.email });
    }

    for (let name = 0; name < Object.keys(formData).length; name++) {
      if (!Validation(keys[name], values[name])) return;
    }

    let url = process.env.REACT_APP_FETCH_URL + "users/signin";
    if (event.target.getAttribute("data-register") === "true") url = process.env.REACT_APP_FETCH_URL + "users/register";

    if (event.target.getAttribute("data-register") === "forgot") url = process.env.REACT_APP_FETCH_URL + "users/forgotpassword";

    setIsLoading(true);
    const data = await Fetch(url, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setIsLoading(false);
    if (data.error) {
      setErrMsg(data.error);
      return;
    }
    if (event.target.getAttribute("data-register") === "forgot") {
      setIsRegister(false);
      setGoodMsg(data.massage);
      setErrMsg(false);
      return;
    }
    if (data.token) {
      await SetLocalStorage("token", data.token);
      await dispatch(setNotificationsNumberHandler({ number: data.notificationsNumber }));
      window.location.reload();
    } else setSecss(true);
  };

  const closeModalHandler = function () {
    setSecss(false);
    window.location.reload();
  };

  return (
    <Fragment>
      {secss && <PopUpModal massage="Registration was successful" function={closeModalHandler} />}
      {isLoading && <Loader />}
      <Header />
      <main className="login">
        <div className="contianer">
          <User class={"login_icon"} />
          <h2 className="login_title">Anygrows</h2>
          <form className="login_form" onSubmit={onLoginHandler} data-register={isRegister}>
            {isRegister === "forgot" && (
              <Fragment>
                <Input type="email" labelText="Email" name="email" change={onChangeHandler} req={true} />
                <Submit text="Send Email" />
                <button className="login_form-register" type="button" onClick={ChangeFrame}>
                  Log in
                </button>
              </Fragment>
            )}
            {!isRegister && (
              <Fragment>
                <Input type="email" labelText="Email" name="email" change={onChangeHandler} req={true} />
                <Input type="password" labelText="Password" name="password" change={onChangeHandler} req={true} />
                <Submit text="Login" />
                <button className="login_form-register" type="button" onClick={ChangeFrame}>
                  Register
                </button>
                <button className="login_form-forgot login_form-register" type="button" onClick={onForgotHandler}>
                  Forgot password
                </button>
              </Fragment>
            )}
            {isRegister === true && (
              <Fragment>
                <Input type="text" labelText="Full name" name="fullname" change={onChangeHandler} req={true} />
                <Input type="email" labelText="Email" name="email" change={onChangeHandler} req={true} />
                <Input type="password" labelText="Password" name="password" change={onChangeHandler} req={true} />
                <Submit text="Register" />
                <button className="login_form-register" type="button" onClick={ChangeFrame}>
                  Log in
                </button>
              </Fragment>
            )}
            {goodMsg && <span className="login_form-good">{goodMsg}</span>}
            {errMsg && <span className="login_form-error">{errMsg}</span>}
          </form>
        </div>
      </main>
    </Fragment>
  );
};

export default memo(Login);
