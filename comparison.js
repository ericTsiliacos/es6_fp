require("es6-promise").polyfill();
require("isomorphic-fetch");

const ApiClient = () => ({
  getPeople: () => fetch("http://uinames.com/api/").then(response => {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return { people: [ "Corban", "Eric" ] };
  })
});

const Renderer = () => ({ render: console.log });

const Service = () => ({ transformData: json => json.people[0] });

const Wrapper = ({ apiClient, service }) => ({
  doStuff: () => apiClient.getPeople().then(service.transformData)
});

const AbstractBehavior = ({ wrapper, renderer }) => ({
  execute: () => {
    wrapper.doStuff().then(data => {
      renderer.render(data);
      renderer.render(data);
    });
  }
});

const main1 = () => {
  const apiClient = ApiClient();
  const renderer = Renderer();
  const service = Service(renderer);
  const wrapper = Wrapper({ apiClient, service });
  const abstractBehavior = AbstractBehavior({ wrapper, renderer });

  abstractBehavior.execute();
};

main1();

const Result = ({ left, right }) => {
  return Object.assign(
    {},
    left
      ? { map: () => Result({ left }) }
      : { map: f => Result({ right: f(right) }) },
    { left: left, right: right }
  );
};
const mapResult = f => result => result.map(f);
const fetchIO = url => () => fetch(url)
  .then(response => {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  })
  .then(value => Result({ right: { people: [ "Corban", "Eric" ] } }))
  .catch(err => Result({ left: err }));
const liftF = f => (...value) => () => f(...value);
const puts = liftF(console.log);
const props = (...properties) => x => properties.reduce(
  (accu, curr) => accu[curr],
  x
);
const compose = f => g => x => g(f(x));
const pipe = (...xs) => x => xs.reduce(
  (accu, curr) => compose(accu)(curr),
  x => x
)(x);
const AsyncIO = {
  chaining: thunk => ({
    then: f => AsyncIO.chaining(() => thunk().then(value => f(value)())),
    then_: f => AsyncIO.chaining(() => thunk().then(() => liftF(f)()())),
    sequence: (...fs) => AsyncIO.chaining(
      () => thunk().then(value => fs.forEach(f => f(value)()))
    ),
    run: thunk
  }),
  of: thunk => AsyncIO.chaining(thunk)
};

const main2 = ({ fetch, puts }) => AsyncIO
  .of(fetch("http://uinames.com/api/"))
  .then(liftF(mapResult(props("people", 1))))
  .sequence(pipe(props("right"), puts), pipe(props("right"), puts));

main2({ fetch: fetchIO, puts }).run();