const { Http } = require("./http");

const ApiClient = url => ({ getPeople: () => Http.get(url) });
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

const main = () => {
  const apiClient = ApiClient("http://uinames.com/api/");
  const renderer = Renderer();
  const service = Service();
  const wrapper = Wrapper({ apiClient, service });
  const abstractBehavior = AbstractBehavior({ wrapper, renderer });

  abstractBehavior.execute();
};

main();
