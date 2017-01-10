const run = x => {
  if (typeof x === 'function') {
    x()
  } else if (x.run !== undefined) {
    x.run()
  } else {
    x
  }
}

const compose = f => g => x => g(f(x))

const Pipe = x => ({
  into: (...xs) => xs.reduce((accu, curr) => compose(accu)(curr), x => x)(x)
})
const pipeline = (...xs) => x => xs.reduce((accu, curr) => compose(accu)(curr), x => x)(x)

const prop = p => x => x[p]

const concat = x => y => y + x
const square = x => x * x
const toString = x => x + ""
const reverse = x => [...x].reverse().join('')

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

const readFile = (filename) => () => new Promise(resolve => {
  require('fs').readFile(filename, 'utf8', (err, data) => {
     return err
      ? resolve(Result({ left: err }))
      : resolve(Result({ right: data }));
  });
})

require('es6-promise').polyfill();
require('isomorphic-fetch');
const fetchIO = url => () => fetch(url)
    .then(response => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
      .then(value => Result({ right: value }))
      .catch(err => Result({ left: err }))

const puts = liftF(console.log)

const PromiseIO = {
  chaining: thunk => ({
    then: f => PromiseIO.chaining(() => thunk().then(value => f(value)())),
    then_: f => PromiseIO.chaining(() => thunk().then(() => liftF(f)()())),
    run: thunk
  }),
  of: thunk => PromiseIO.chaining(thunk),
  do: () => PromiseIO.chaining(() => Promise.resolve())
}

const main2 = puts(pipeline(square, toString, reverse, concat('!'))(2))

const main1 = PromiseIO.of(fetchIO('https://www.reddit.com/top/.json'))
                      .then(liftF(prop('right')))
                      .then(puts)
                      .then_(puts('ALL DONE!'))
                      .then_(readFile('test.txt'))
                      .then(liftF(prop('right')))
                      .then(puts)
                      .then_(lift(5))
                      .then(liftF(pipeline(square, toString, reverse, concat('!'))))
                      .then(puts)

run(main2)
run(main1)
