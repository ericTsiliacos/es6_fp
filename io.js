const IO = {
  chaining: f => ({
    run: f,
    then: thunk => IO.chaining((...values) => {
      const value = f(values);
      return thunk(value).run();
    }),
    map: thunk => IO.chaining(value => thunk(f(value)))
  }),
  of: f => (...values) => IO.chaining(() => f(...values)),
  lift: value => IO.of(() => value)(),
  unit: () => IO.of(() => {})(),
  sequence: (...actions) => IO.chaining(() => actions.forEach(a => a.run()))
};

module.exports = { IO };
