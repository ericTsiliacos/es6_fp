const { IO } = require("./io");
const { pipe, props } = require("./async_io");

const print = IO.of(console.log);
const getLine = IO.of(() => "hello world!");

const main = print("starting")
  .then(() => print("next"))
  .then(() => IO.lift({ people: [ "Eric" ] }))
  .then(pipe(props("people", 0), print))
  .then(() => print("all done!"));

main.run();
