import "./Contianer.scss";
import "./../../scss/helper.scss";

const Contianer = (props) => {
  return (
    <div className={props.classes + " contianer_component"}>
      <div className="contianer_component_inner">{props.children}</div>
    </div>
  );
};

export default Contianer;
