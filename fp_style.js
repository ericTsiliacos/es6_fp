const { Http } = require("./http");
const { AsyncIO, puts, pipe, compose, props, liftF } = require("./async_io");
const { mapResult } = require("./result");

const main = ({ fetch, puts, url }) => fetch(url)
  .then(liftF(mapResult(props("people", 1))))
  ._thread_(puts("Printing name twice:"))
  .sequence(pipe(props("right"), puts), pipe(props("right"), puts))
  ._sequence(puts("Finished"));

main({
  fetch: AsyncIO.from(Http.get),
  puts,
  url: "http://uinames.com/api/"
}).run();
