import { memo } from "react";
import Shadow from "../shadow/Shadow";
import "./PopUpModal.scss";

const PopUpModal = function (props) {
  return (
    <Shadow>
      <div className="popup">
        <div className="popup_tools">
          <button className="popup_tools-circle" onClick={props.function}>
            <span className="popup_tools-red popup_tools-box"></span>
          </button>
          <button className="popup_tools-circle" onClick={props.function}>
            <span className="popup_tools-yellow popup_tools-box"></span>
          </button>
          <button className="popup_tools-circle" onClick={props.function}>
            <span className="popup_tools-green popup_tools-box"></span>
          </button>
        </div>
        <div className="popup_content">{props.massage}</div>
      </div>
    </Shadow>
  );
};

export default memo(PopUpModal);
