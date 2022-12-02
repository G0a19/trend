const Fetch = async function (url, options = {}) {
  try {
    const call = await fetch(url, options);
    const response = await call.json();
    return response;
  } catch (err) {
    console.log(err);
  }
};

export default Fetch;
