import { useState, memo } from "react";
import Validation from "./../../functions/Validation";
import "./Input.scss";

const Input = function (props) {
  const [isTouchClass, setIsTouchClass] = useState(false);
  const [isError, setIsError] = useState(false);

  const checkIfIsTouch = function (event) {
    if (Validation(event.target.name, event.target.value)) {
      setIsError(false);
    } else {
      setIsError("error-border");
    }
    if (event.target.value.length > 0) {
      setIsTouchClass("input_lableTouch");
      return;
    }
    setIsTouchClass(false);
  };

  return (
    <div className="input">
      <input
        name={props.name}
        className={"input_type " + isError}
        type={props.type}
        onKeyUp={checkIfIsTouch}
        onChange={props.change}
        required={Boolean(props.req)}
      ></input>
      <label className={"input_text " + isTouchClass}>{props.labelText}</label>
    </div>
  );
};

export default memo(Input);
