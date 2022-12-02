const GetMyVoteHandler = function (data, userId) {
  const myUser = data.allUsers.find((user) => user.id === userId);
  if (!myUser) return false;
  return data.stocks[myUser.number].stockName;
};

export default GetMyVoteHandler;
