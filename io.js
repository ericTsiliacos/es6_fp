const IO = {
  chaining: f => ({
    run: f,
    then: thunk => IO.chaining((...values) => {
      const value = f(values);
      thunk(value).run();
    })
  }),
  of: f => (...values) => IO.chaining(() => f(...values))
};

module.exports = { IO };
