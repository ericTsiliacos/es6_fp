const { IO } = require("./io");
const { pipe, props } = require("./async_io");
const { Result } = require("./result");
const assert = require("assert");

const print = IO.of(console.log);
const getLine = IO.of(() => "hello world!");

const main = ({ print }) => print("starting")
  .then(() => print("next"))
  .then(() => IO.lift({ people: [ "Eric" ] }))
  .then(pipe(props("people", 0), print))
  .then(() => print("all done!"));

const log = [];
main({ print: IO.of((...values) => log.push(values)) }).run();

assert.deepStrictEqual(log, [
  [ "starting" ],
  [ "next" ],
  [ "Eric" ],
  [ "all done!" ]
]);

main({ print }).run();
const performAsyncIO = IO.of(() => Promise.resolve(Result({ right: 1 })));

performAsyncIO().then(p => {
  p.then(result => {
    console.log(result.right);
  });
  return IO.unit();
}).run();

const concat = x => y => y + x;

getLine().map(concat("!!!!")).map(concat("...")).then(print).run();
