const { IO } = require("./io");
const { pipe, props } = require("./async_io");
const { Result } = require("./result");

const print = IO.of(console.log);
const getLine = IO.of(() => "hello world!");

const main = print("starting")
  .then(() => print("next"))
  .then(() => IO.lift({ people: [ "Eric" ] }))
  .then(pipe(props("people", 0), print))
  .then(() => print("all done!"));

main.run();

const performAsyncIO = IO.of(() => Promise.resolve(Result({ right: 1 })));

performAsyncIO().then(p => {
  p.then(result => {
    console.log(result.right);
  });
  return print("inside");
}).run();
