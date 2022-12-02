import { useEffect, useState } from "react";
import Fetch from "../../../../functions/Fetch";
import Contianer from "../../../../shared/contianer/Contianer";
import ToggleBtns from "../../../../shared/ToggleBtns/ToggleBtns";

import "./MyVote.scss";

const MyVote = () => {
  const [data, setData] = useState();
  const [numberOfTrends, setNumberOfTrends] = useState(0);
  const [toggle, setToggle] = useState(true);

  const changeToggle = (value) => {
    setToggle(value);
  };

  const getTrends = async () => {
    try {
      const fetchData = await Fetch(process.env.REACT_APP_FETCH_URL + "trendoftheweek/getalltrends/" + numberOfTrends);
      console.log(fetchData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTrends();
  }, []);

  return (
    <Contianer clasess={"myvote"}>
      <ToggleBtns text1="My votes" text2="My trends" toggle={toggle} setToggle={changeToggle} />
      <div>hi</div>
    </Contianer>
  );
};

export default MyVote;
