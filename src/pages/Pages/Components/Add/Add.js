import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Contianer from "../../../../shared/contianer/Contianer";
import Input from "../../../../shared/inputs/Input";
import Validation from "../../../../functions/Validation";
import PopUpModal from "../../../../shared/popupmodal/PopUpModal";
import { changeLoaderHandler } from "../../../../Store/Store";
import GetLocalStorage from "../../../../functions/GetLocalStorage";

// images
import chart1 from "./../../../../assets/chart1.png";
import chart2 from "./../../../../assets/chart2.png";

import "./Add.scss";
import Fetch from "../../../../functions/Fetch";
const Add = function () {
  const [formData, setFormData] = useState({ trendname: "", trendvote: "", charType: -1 });
  const [errMsg, setErrMsg] = useState(false);
  const [secss, setSecss] = useState(false);
  const [trendId, setTrendId] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    setErrMsg(false);
    setFormData((data) => {
      return { ...data, [e.target.name]: e.target.value };
    });
  };

  const closeModalHandler = () => {
    navigate("/trend/" + trendId);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const keys = Object.keys(formData);
    const values = Object.values(formData);
    for (let name = 0; name < Object.keys(formData).length; name++) {
      if (!Validation(keys[name], values[name])) return;
    }
    if (formData.charType === -1) {
      setErrMsg("One of the fields are missing");
      return;
    } else formData.charType = Number(formData.charType);
    await dispatch(changeLoaderHandler());
    const data = await Fetch(process.env.REACT_APP_FETCH_URL + "trendoftheweek/newtrend", {
      method: "POST",
      body: JSON.stringify({ name: formData.trendname, stockName: formData.trendvote, charType: formData.charType }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(GetLocalStorage("token"))}`,
      },
    });
    setSecss(data.msg);
    setTrendId(data.id);
    await dispatch(changeLoaderHandler());
  };

  return (
    <Fragment>
      {secss && <PopUpModal massage={secss} function={closeModalHandler} />}
      <Contianer classes={"add"}>
        <h2 className="add_title">New Trend</h2>
        <form className="add_form" onSubmit={onSubmitHandler}>
          <div className="add_form-wrapper">
            <div className="add_form-oneside">
              <Input type="text" labelText="Trend name" name="trendname" change={onChangeHandler} req={true} />
              <Input type="text" labelText="Trend Vote" name="trendvote" change={onChangeHandler} req={true} />
            </div>
            <div className="add_form-anotherside">
              <div className="add_check">
                <input className="add_check-input" name="charType" type="radio" value="1" onClick={onChangeHandler} />
                <img className="add_check-img" src={chart1} alt="chart" />
              </div>
              <div className="add_check">
                <input className="add_check-input" name="charType" type="radio" value="2" onClick={onChangeHandler} />
                <img className="add_check-img" src={chart2} alt="chart" />
              </div>
            </div>
          </div>
          {errMsg && <span className="add_error">{errMsg}</span>}
          <button className="add_submit" type="submit">
            Create
          </button>
        </form>
      </Contianer>
    </Fragment>
  );
};

export default Add;
