import "./ToggleBtns.scss";

const ToggleBtns = (props) => {
  return (
    <div className="notificationsPage_btns">
      <button
        className={`notificationsPage_btns-btn notificationsPage_btns-notifications ${props.toggle ? "notificationsPage_btns-active" : ""}`}
        onClick={() => props.setToggle(true)}
      >
        {props.text1}
      </button>
      <button
        className={`notificationsPage_btns-btn notificationsPage_btns-requests ${!props.toggle ? "notificationsPage_btns-active" : ""}`}
        onClick={() => props.setToggle(false)}
      >
        {props.text2}
      </button>
      <div className={`notificationsPage_btns-toggle ${props.toggle ? "active" : ""}`}></div>
    </div>
  );
};

export default ToggleBtns;
