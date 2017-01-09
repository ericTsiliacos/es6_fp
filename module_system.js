const compose = f => g => x => g(f(x))

const Pipe = x => ({
  into: (...xs) => xs.reduce((accu, curr) => compose(accu)(curr), x => x)(x)
})

const concat = x => y => y + x
const square = x => x * x
const toString = x => x + ""
const reverse = x => [...x].reverse().join('')

const sequence = (...actions) => () => actions.forEach(action => action())
const puts = value => () => console.log(value)
const lift = value => () => value

const PromiseIO = promise => ({
  then: f => PromiseIO(promise.then(result => f(result)())),
  finally: f => () => PromiseIO(promise.then(result => f(result)()))
})

const Result = ({ left, right }) => {
  return Object.assign(
    {},
    left ?
      {
        map: () => Result({ left }),
      }
    :
      {
        map: f => Result({ right: f(right) }),
      },
    {
      left: () => left,
      right: () => right
    })
}

const readFile = () => (
  PromiseIO(new Promise(resolve => {
    require('fs').readFile('test.txt', 'utf8', (err, data) => {
       return err
        ? resolve(Result({ left: err }))
        : resolve(Result({ right: data }));
    });
  }))
)

const main = sequence(
    puts(Pipe("hi").into(concat("world!")))
  , puts(Pipe(5).into(square, toString, reverse, concat("!")))
  , readFile()
    .then(result => lift(result.map(i => i + "GOT HERE!")))
    .then(result => lift(result.map(i => i + "\n" + "THIS TWO!")))
    .finally(result => result.right() ? puts(result.right()) : puts(result.left()))
  )

main();
