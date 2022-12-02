import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import uuid from "react-uuid";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from "recharts";
import Fetch from "../../../../functions/Fetch";
import GetLocalStorage from "../../../../functions/GetLocalStorage";
import GetMyVoteHandler from "../../../../functions/GetMyVote";
import Validation from "../../../../functions/Validation";
import Input from "../../../../shared/inputs/Input";
import User from "../../../../shared/icons/User";

import "./SingleTrend.scss";

const SingleTrend = (props) => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [voteName, setVoteName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [newVote, setNewVote] = useState("");
  const userId = useSelector((state) => state.userId);
  const socket = useSelector((state) => state.socket.socket);

  const resetStatesHandler = () => {
    setData([]);
    setOptions([]);
  };

  const voteHandler = async (e) => {
    setVoteName(e.target.value);
    setIsLoading(true);
    const fetchData = await Fetch(process.env.REACT_APP_FETCH_URL + "trendoftheweek/newVote", {
      method: "POST",
      body: JSON.stringify({ trendId: props.data.id, stockName: e.target.value }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(GetLocalStorage("token"))}`,
      },
    });
    await socket.emit("changeTrendData", { trendId: props.data.id, data: fetchData });
    resetStatesHandler();
    let allVotes = [];
    fetchData.existTrendOfTheWeek.stocks.forEach((vote, index) => {
      allVotes.push({ name: vote.stockName, number: vote.users.length });
      setOptions((prev) => [...prev, vote.stockName]);
    });
    allVotes = allVotes.sort((a, b) => b.number - a.number);
    allVotes.forEach((vote, index) => {
      if (index < 4) setData((prev) => [...prev, { name: vote.name, number: vote.number }]);
    });
    setVoteName(GetMyVoteHandler(fetchData.existTrendOfTheWeek, userId));
    setIsLoading(false);
  };

  const onChangeNewVoteHandler = (e) => {
    setNewVote((data) => {
      return { ...data, [e.target.name]: e.target.value };
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (newVote && Validation(Object.keys(newVote)[0], newVote.trendvote)) {
      setIsLoading(true);
      const fetchData = await Fetch(process.env.REACT_APP_FETCH_URL + "trendoftheweek/newVote", {
        method: "POST",
        body: JSON.stringify({ trendId: props.data.id, stockName: newVote.trendvote }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(GetLocalStorage("token"))}`,
        },
      });
      if (fetchData.error) {
        setErrorMsg(fetchData.error);
        setIsLoading(false);
        return;
      }
      await socket.emit("changeTrendData", { trendId: props.data.id, data: fetchData });
      resetStatesHandler();
      let allVotes = [];
      fetchData.existTrendOfTheWeek.stocks.forEach((vote, index) => {
        allVotes.push({ name: vote.stockName, number: vote.users.length });
        setOptions((prev) => [...prev, vote.stockName]);
      });
      allVotes = allVotes.sort((a, b) => b.number - a.number);
      allVotes.forEach((vote, index) => {
        if (index < 4) setData((prev) => [...prev, { name: vote.name, number: vote.number }]);
      });
      setVoteName(GetMyVoteHandler(fetchData.existTrendOfTheWeek, userId));
      setNewVote("");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    resetStatesHandler();
    if (props.data && props.data.stocks) {
      let allVotes = [];
      props.data.stocks.forEach((vote, index) => {
        allVotes.push({ name: vote.stockName, number: vote.users.length });
        setOptions((prev) => [...prev, vote.stockName]);
      });
      allVotes = allVotes.sort((a, b) => b.number - a.number);
      allVotes.forEach((vote, index) => {
        if (index < 4) setData((prev) => [...prev, { name: vote.name, number: vote.number }]);
      });
      setVoteName(GetMyVoteHandler(props.data, userId));
    }
    socket.on("getTrendData", ({ trendId, data }) => {
      if (trendId === props.data.id) {
        resetStatesHandler();
        let allVotes = [];
        data.existTrendOfTheWeek.stocks.forEach((vote, index) => {
          allVotes.push({ name: vote.stockName, number: vote.users.length });
          setOptions((prev) => [...prev, vote.stockName]);
        });
        allVotes = allVotes.sort((a, b) => b.number - a.number);
        allVotes.forEach((vote, index) => {
          if (index < 4) setData((prev) => [...prev, { name: vote.name, number: vote.number }]);
        });
        setVoteName(GetMyVoteHandler(props.data, userId));
      }
    });
  }, [props.data, props.data.length, props.data.stocks, socket, userId]);

  return (
    <div className="singleTrend">
      {isLoading && (
        <div className="singleTrend_loader">
          <div className="singleTrend_loader-load"></div>
        </div>
      )}
      {props.data && props.data.admin && props.data.adminId && (
        <a href={window.location.origin + "/user/" + props.data.adminId} className="singleTrend_user">
          <User />
          <span className="singleTrend_user-name">{props.data.admin.name}</span>
        </a>
      )}
      <ResponsiveContainer width="100%" height={400}>
        {props.data.charType === 1 ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="number" fill="#82ca9d" />
          </BarChart>
        ) : (
          <PieChart>
            <Tooltip />
            <Pie data={data} dataKey="number" outerRadius={120} fill="#82ca9d" label />
          </PieChart>
        )}
      </ResponsiveContainer>
      <div className="singleTrend_options">
        {options &&
          options.map((option) => (
            <div className="singleTrend_options-option" key={uuid()}>
              <input checked={voteName === option} onChange={voteHandler} name="option" type="radio" value={option} />
              <div className="singleTrend_options-check"></div>
              <span className="singleTrend_options-name">{option}</span>
            </div>
          ))}
        {errorMsg && <div className="singleTrend_error">{errorMsg}</div>}
        {options && !errorMsg && (
          <form className="singleTrend_form" onSubmit={onSubmitHandler}>
            <Input type="text" name="trendvote" labelText="New vote" change={onChangeNewVoteHandler} />
            <button className="singleTrend_form-btn">+</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default React.memo(SingleTrend);
