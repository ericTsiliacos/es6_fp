const { Http } = require("./http");
const { AsyncIO, puts, pipe, compose, props, liftF } = require("./async_io");
const { mapResult, Result } = require("./result");

const fetchIO = url => () => Http
  .get(url)
  .then(value => Result({ right: value }))
  .catch(err => Result({ left: err }));

const main = ({ fetch, puts }) => AsyncIO
  .of(fetch("http://uinames.com/api/"))
  .then(liftF(mapResult(props("people", 1))))
  ._thread_(puts("Printing name twice:"))
  .sequence(pipe(props("right"), puts), pipe(props("right"), puts))
  ._sequence(puts("Finished"));

main({ fetch: fetchIO, puts }).run();
