import { useEffect, useState } from "react";
import Contianer from "../../../../shared/contianer/Contianer";
import "./Home.scss";

const Home = () => {
  const [data, setData] = useState([]);
  const [numberOfTrends, setNumberOfTrends] = useState(5);

  useEffect(() => {}, []);

  return (
    <Contianer>
      <div></div>
    </Contianer>
  );
};

export default Home;
