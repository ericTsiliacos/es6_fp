require("es6-promise").polyfill();
require("isomorphic-fetch");

const get = url => fetch(url).then(response => {
  if (response.status >= 400) {
    throw new Error("Bad response from server");
  }
  return { people: [ "Corban", "Eric" ] };
});

const Http = { get };

module.exports = { Http };