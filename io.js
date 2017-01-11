const IO = {
  chaining: f => ({
    run: f,
    then: thunk => IO.chaining(() => {
      f();
      thunk().run();
    })
  }),
  of: f => value => IO.chaining(() => f(value))
};

module.exports = { IO };
