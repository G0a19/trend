const SetLocalStorage = function (name, data) {
  localStorage.setItem(name, JSON.stringify(data));
};

export default SetLocalStorage;
