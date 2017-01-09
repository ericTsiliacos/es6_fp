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
const liftF = f => (...value) => () => f(...value)

const PromiseIO = promise => ({
  then: (...xs) => () => promise.then(result => xs.reduce((accu, curr) => curr(accu)(), result))
})

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
  new Promise(resolve => {
    require('fs').readFile('test.txt', 'utf8', (err, data) => {
       return err
        ? resolve(Result({ left: err }))
        : resolve(Result({ right: data }));
    });
  })
)

const puts = liftF(console.log)

const main = sequence(
    puts(Pipe("hi").into(concat("world!")))
  , puts(Pipe(5).into(square, toString, reverse, concat("!")))
  , puts("1", "2")
  , PromiseIO(readFile()).then(
        liftF(mapResult(pipeline(concat("GOT HERE!"), concat("THIS TOO!"))))
      , result => result.right ? puts(result.right) : puts(result.left)
    )
  )

main();
