const Pipe = x => {
  const compose = f => g => x => f(g(x))
  return {
    into: (...xs) => xs.reduce((acc, cur) => compose(cur)(acc), x => x)(x)
  }
}

const concat = x => y => y + x
const square = x => x * x
const toString = x => x + ""
const reverse = x => [...x].reverse().join('')

// const main = sequence(
//     puts(Pipe("hi").into(concat("world!")))
//   , puts(Pipe(5).into(square, toStr, rev))
// )
//
// main();

const _IO = {
  sequence: (...actions) => () => actions.forEach(action => action()),
  puts: value => () => console.log(value),
  lift: value => () => value,
  then: thunk => f => f(thunk())
}

// const { sequence, puts, getLine, lift, then } = _IO

const { puts } = _IO

const _IO_ = thunk => {
  return {
    then: f => _IO_(f(thunk())),
    run: lift(thunk)()
  }
}

const lift = value => () => value

const getLine = () => {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return _IO_(lift(new Promise(resolve => {
    rl.on('line', input => {
      return resolve(input)
    })
  })));
}

const IO = value => _IO_(lift(value))

const main = getLine() //.then(p => lift(p.then(value => value)))

// main.run();
