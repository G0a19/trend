import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { changeLoaderHandler } from "../../../../Store/Store";
import GetLocalStorage from "../../../../functions/GetLocalStorage";
import Fetch from "../../../../functions/Fetch";
import Contianer from "../../../../shared/contianer/Contianer";
import SingleTrend from "../SingleTrend/SingleTrend";

import "./TrendPage.scss";

const TrendPage = function () {
  const [trend, setTrend] = useState([]);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getTrendData = async () => {
      await dispatch(changeLoaderHandler());
      const data = await Fetch(process.env.REACT_APP_FETCH_URL + "trendoftheweek/gettrendbyid/" + location.pathname.split("/")[2], {
        headers: {
          Authorization: `Bearer ${JSON.parse(GetLocalStorage("token"))}`,
        },
      });
      if (data.error) {
        navigate("/home");
        return;
      }
      setTrend(data);
      await dispatch(changeLoaderHandler());
    };

    getTrendData();
  }, [dispatch, location.pathname]);

  return <Contianer classes={"trendPage"}>{trend && <SingleTrend data={trend} />}</Contianer>;
};

export default React.memo(TrendPage);
