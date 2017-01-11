const { Http } = require("./http");
const { AsyncIO, puts, pipe, compose, props, liftF } = require("./async_io");
const { mapResult } = require("./result");

const main = ({ fetchAsyncIO, puts }) => fetchAsyncIO
  .then(liftF(mapResult(props("people", 1))))
  ._thread_(puts("Printing name twice:"))
  .sequence(pipe(props("right"), puts), pipe(props("right"), puts))
  ._sequence(puts("Finished"));

main({
  fetchAsyncIO: AsyncIO.from(Http.get)("http://uinames.com/api/"),
  puts
}).run();
