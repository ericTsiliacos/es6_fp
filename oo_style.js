const { Http } = require("./http");

const ApiClient = url => ({ fetchPeople: () => Http.get(url) });
const Renderer = () => ({ render: console.log });
const PeopleRepository = apiClient => ({
  getPeople: () => apiClient.fetchPeople()
});
const UseCase = ({ peopleRepository, renderer }) => ({
  execute: () => {
    peopleRepository
      .getPeople()
      .then(json => json.people[0])
      .then(data => {
        renderer.render("Printing name twice:");
        renderer.render(data);
        renderer.render(data);
        renderer.render("Finished");
      });
  }
});

const main = () => {
  const apiClient = ApiClient("http://uinames.com/api/");
  const peopleRepository = PeopleRepository(apiClient);
  const renderer = Renderer();
  const useCase = UseCase({ peopleRepository, renderer });

  useCase.execute();
};

main();
