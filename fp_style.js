const { Http } = require("./http");
const { AsyncIO, puts, pipe, compose, props, liftF } = require("./async_io");
const { mapResult } = require("./result");

const fetchAndPrintNames = ({ fetchAsyncIO, puts }) => fetchAsyncIO
  .then(liftF(mapResult(props("people", 1))))
  ._thread_(puts("Printing name twice:"))
  .sequence(pipe(props("right"), puts), pipe(props("right"), puts))
  ._sequence(puts("Finished"));

const main = fetchAndPrintNames({
  fetchAsyncIO: AsyncIO.from(Http.get)("http://uinames.com/api/"),
  puts
});

main.run();
