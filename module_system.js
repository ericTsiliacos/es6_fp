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

const main = sequence(
    puts(Pipe("hi").into(concat("world!")))
  , puts(Pipe(5).into(square, toString, reverse, concat("!")))
)

main();
