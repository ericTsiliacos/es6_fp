const Database = () => ({
  connect: () => ({ query: () => Promise.resolve({ people: [ "Eric" ] }) })
});
const Renderer = () => ({ render: console.log });
const PeopleRepository = databaseConnection => ({
  getPeople: () => databaseConnection.query()
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
  const databaseConnection = Database().connect();
  const peopleRepository = PeopleRepository(databaseConnection);
  const renderer = Renderer();
  const useCase = UseCase({ peopleRepository, renderer });

  useCase.execute();
};

main();
