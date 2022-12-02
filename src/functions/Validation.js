const Validation = function (name, value) {
  if (name === "email") return /.+@.+\.[A-Za-z]+$/.test(value);
  if (name === "password") return value.length >= 6;
  if (name === "fullname") return value.length >= 6;
  if (name === "trendname" || name === "trendvote") return value.length >= 2;
  else return true;
};

export default Validation;
