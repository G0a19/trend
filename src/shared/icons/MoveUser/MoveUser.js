import { useState } from "react";

import "./MoveUser.scss";

const MoveUser = function (props) {
  const [active, setActive] = useState(false);

  const clickHnadler = function () {
    props.function();
    setActive(!active);
  };

  return (
    <button className={"moveUser " + props.class} onClick={clickHnadler}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class={`user ${active ? "toggle" : ""}`}>
        <rect x="24.5" y="22.875" width="15" height="5" />
        <path
          d="M37.25,38.999v-3.5c0.788-0.39,3.04-3.071,3.275-5.166c0.621-0.047,1.594-0.616,1.879-2.861
               c0.154-1.206-0.457-1.883-0.828-2.097c0,0,0.924-1.755,0.924-3.874c0-4.249-1.668-7.875-5.25-7.875c0,0-1.244-2.625-5.25-2.625
               c-7.423,0-10.5,4.762-10.5,10.5c0,1.932,0.924,3.874,0.924,3.874c-0.371,0.214-0.984,0.893-0.828,2.097
               c0.285,2.245,1.258,2.814,1.879,2.861c0.235,2.095,2.487,4.776,3.275,5.166v3.5c-1.412,4.235-10.792,2.78-14.366,8.49
               C16.962,53.279,24.044,57,32,57s15.038-3.721,19.616-9.511C48.042,41.779,38.662,43.234,37.25,38.999z M27.944,26.706
               c-0.979,0.072-1.86-0.415-2.359-1.185c0.444-0.438,1.103-0.745,1.862-0.801c1.01-0.074,1.909,0.315,2.383,0.937
               C29.396,26.244,28.728,26.649,27.944,26.706z M34.169,25.658c0.475-0.622,1.373-1.012,2.384-0.938
               c0.76,0.056,1.418,0.363,1.862,0.801c-0.499,0.77-1.381,1.256-2.359,1.185C35.272,26.648,34.604,26.244,34.169,25.658z"
        />
        <circle className="solid" fill="none" strokeWidth="4" strokeMiterlimit="10" cx="32" cy="32" r="30" />
        <circle className="animation" fill="none" strokeWidth="4" strokeMiterlimit="10" cx="32" cy="32" r="30" />
      </svg>
    </button>
  );
};

export default MoveUser;
