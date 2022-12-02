import { Link } from "react-router-dom";

import "./Notification.scss";

const Notification = function (props) {
  return (
    <Link to={props.link ?? "/notifications"} className="notification">
      {props.msg}
    </Link>
  );
};

export default Notification;
