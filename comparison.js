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
      renderer.render("Printing name twice:");
      renderer.render(data);
      renderer.render(data);
      renderer.render("Finished");
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

// main1();
const {
  AsyncIO,
  puts,
  pipe,
  compose,
  props,
  liftF,
  mapResult,
  Result
} = require("./async_io");

const fetchIO = url => () => fetch(url)
  .then(response => {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return { people: [ "Corban", "Eric" ] };
  })
  .then(value => Result({ right: value }))
  .catch(err => Result({ left: err }));

const main2 = ({ fetch, puts }) => AsyncIO
  .of(fetch("http://uinames.com/api/"))
  .then(liftF(mapResult(props("people", 1))))
  .sequence(
    () => puts("Printing name twice:"),
    pipe(props("right"), puts),
    pipe(props("right"), puts)
  )
  .sequence_(puts("Finished"));

main2({ fetch: fetchIO, puts }).run();