const compose = f => g => x => g(f(x))

const Pipe = x => ({
  into: (...xs) => xs.reduce((accu, curr) => compose(accu)(curr), x => x)(x)
})
const pipeline = (...xs) => x => xs.reduce((accu, curr) => compose(accu)(curr), x => x)(x)

const concat = x => y => y + x
const square = x => x * x
const toString = x => x + ""
const reverse = x => [...x].reverse().join('')

const sequence = (...actions) => () => actions.forEach(action => action())
const lift = value => () => value
const liftF = f => (...value) => () => f(...value)

const Result = ({ left, right }) => {
  return Object.assign(
    {},
    left ?
      {
        map: () => Result({ left })
      }
    :
      {
        map: f => Result({ right: f(right) }),
      },
    {
      left: left,
      right: right
    })
}

const mapResult = f => result => result.map(f)

const readFile = () => (
  () => new Promise(resolve => {
    require('fs').readFile('test.txt', 'utf8', (err, data) => {
       return err
        ? resolve(Result({ left: err }))
        : resolve(Result({ right: data }));
    });
  })
)

require('es6-promise').polyfill();
require('isomorphic-fetch');
const fetchIO = url => PromiseIO.of(() => fetch(url)
    .then(response => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
      .then(value => Result({ right: value }))
      .catch(err => Result({ left: err })));

const puts = liftF(console.log)

const PromiseIO = {
  chaining: thunk => ({
    then: f => PromiseIO.chaining(() => thunk().then(value => f(value)())),
    run: thunk
  }),
  of: value => PromiseIO.chaining(value)
}

const main = fetchIO('https://www.reddit.com/top/.json')
               .then(result => puts(result.right))
               .then(() => puts("ALL DONE!"))
               .then(() => readFile())
               .then(result => puts(result.right))
               .then(() => lift(5))
               .then(liftF(pipeline(square, toString, reverse, concat("!"))))
               .then(value => puts(value))

main.run()
