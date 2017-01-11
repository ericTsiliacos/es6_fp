const IO = {
  chaining: f => ({
    run: f,
    then: thunk => IO.chaining((...values) => {
      const value = f(values);
      return thunk(value).run();
    })
  }),
  of: f => (...values) => IO.chaining(() => f(...values)),
  sequence: (...actions) => IO.chaining(() => actions.forEach(a => a.run()))
};

module.exports = { IO };
