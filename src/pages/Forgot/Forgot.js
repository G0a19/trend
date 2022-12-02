import { Fragment, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import Header from "../../shared/header/Header";
import Input from "../../shared/inputs/Input";
import Submit from "../../shared/btns/Submit";
import Validation from "../../functions/Validation";
import Fetch from "../../functions/Fetch";
import Loader from "../../shared/loader/Loader";
import PopUpModal from "../../shared/popupmodal/PopUpModal";
import User from "./../../shared/icons/User";

import "./Forgot.scss";

const Forgot = function () {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [secss, setSecss] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const jwt = searchParams.get("jwt");
    if (!jwt) {
      navigate("/");
      return;
    }
    let token;
    try {
      token = jwt_decode(jwt);
    } catch (err) {
      navigate("/");
      return;
    }
    const { exp, userId } = token;
    if (!exp || !userId) {
      navigate("/");
      return;
    }
    setFormData((data) => {
      return { ...data, userId: userId };
    });
    const expirationTime = exp * 1000 - 60000;
    if (Date.now() >= expirationTime) {
      navigate("/");
      return;
    } else {
      const remaningTime = expirationTime - new Date();
      setTimeout(() => {
        navigate("/");
      }, remaningTime);
    }
  }, [navigate, searchParams]);

  const onChangeHandler = function (event) {
    setErrMsg(false);
    setFormData((data) => {
      return { ...data, [event.target.name]: event.target.value };
    });
  };

  const onSubmitHandler = async function (event) {
    event.preventDefault();
    const keys = Object.keys(formData);
    const values = Object.values(formData);

    for (let name = 0; name < Object.keys(formData).length; name++) {
      if (!Validation("password", values[name])) return;
    }

    if (formData.password !== formData.newpassword) {
      setErrMsg("The passwords must be the same");
      return;
    }

    setIsLoading(true);
    try {
      const data = await Fetch(
        process.env.REACT_APP_FETCH_URL + "users/resetpassword",
        {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIsLoading(false);
      if (data.error) setErrMsg(data.error);

      setSecss(data.massage);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const closeModalHandler = function () {
    setSecss(false);
    navigate("/");
  };

  return (
    <Fragment>
      {secss && <PopUpModal massage={secss} function={closeModalHandler} />}
      {isLoading && <Loader />}
      <Header />
      <main className="forgot">
        <div className="contianer">
          <User class={"forgot_icon"} />
          <h2 className="forgot_title">Anygrows</h2>
          <form className="forgot_form" onSubmit={onSubmitHandler}>
            <Fragment>
              <Input
                type="password"
                labelText="New password"
                name="password"
                change={onChangeHandler}
                req={true}
              />
              <Input
                type="password"
                labelText="confirm password"
                name="newpassword"
                change={onChangeHandler}
                req={true}
              />
              <Submit text="Reset password" />
            </Fragment>
            {secss && <span className="forgot_form-good">{secss}</span>}
            {errMsg && <span className="forgot_form-error">{errMsg}</span>}
          </form>
        </div>
      </main>
    </Fragment>
  );
};

export default Forgot;
