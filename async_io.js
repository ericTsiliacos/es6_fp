const { Result } = require("./result");

const liftF = f => (...value) => () => f(...value);

const compose = f => g => x => g(f(x));

const pipe = (...xs) => x => xs.reduce(
  (accu, curr) => compose(accu)(curr),
  x => x
)(x);

const props = (...properties) => x => properties.reduce(
  (accu, curr) => accu[curr],
  x
);

const puts = liftF(console.log);

const liftPromise = f => () => f()
  .then(value => Result({ right: value }))
  .catch(err => Result({ left: err }));

const AsyncIO = {
  chaining: thunk => ({
    then: f => AsyncIO.chaining(() => thunk().then(value => f(value)())),
    sequence: (...fs) => AsyncIO.chaining(
      () => thunk().then(value => fs.forEach(f => f(value)()))
    ),
    _sequence: (...fs) => AsyncIO.chaining(
      () => thunk().then(() => fs.forEach(f => f()))
    ),
    _thread_: f => AsyncIO.chaining(
      () => thunk().then(value => {
        f();
        return value;
      })
    ),
    run: thunk
  }),
  of: thunk => AsyncIO.chaining(thunk),
  from: thunk => value => AsyncIO.chaining(liftPromise(liftF(thunk)(value)))
};

module.exports = { AsyncIO, liftF, compose, pipe, props, puts };
