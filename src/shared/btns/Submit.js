import "./Submit.scss";

const Submit = function (props) {
  return (
    <button className="submit_btn" type="submit">
      {props.text}
    </button>
  );
};

export default Submit;
