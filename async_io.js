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

const AsyncIO = {
  chaining: thunk => ({
    then: f => AsyncIO.chaining(() => thunk().then(value => f(value)())),
    then_: f => AsyncIO.chaining(() => thunk().then(() => liftF(f)()())),
    sequence: (...fs) => AsyncIO.chaining(
      () => thunk().then(value => fs.forEach(f => f(value)()))
    ),
    sequence_: (...fs) => AsyncIO.chaining(
      () => thunk().then(() => fs.forEach(f => liftF(f)()()))
    ),
    run: thunk
  }),
  of: thunk => AsyncIO.chaining(thunk)
};

module.exports = { AsyncIO, liftF, compose, pipe, props, puts };
