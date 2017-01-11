const { Http } = require("./http");
const { AsyncIO, puts, pipe, compose, props, liftF } = require("./async_io");
const { mapResult } = require("./result");

const fetchAndPrintNamesAsyncIO = ({ httpGet, puts }) => {
  return AsyncIO.from(httpGet)("http://uinames.com/api/")
    .then(liftF(mapResult(props("people", 1))))
    .sequence(
      () => puts("Printing name twice:"),
      pipe(props("right"), puts),
      pipe(props("right"), puts),
      () => puts("Finished")
    );
};

const main = fetchAndPrintNamesAsyncIO({ httpGet: Http.get, puts });

main.run();
