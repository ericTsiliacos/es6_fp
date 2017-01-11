const Result = ({ left, right }) => {
  return Object.assign(
    {},
    left
      ? { map: () => Result({ left }) }
      : { map: f => Result({ right: f(right) }) },
    { left: left, right: right }
  );
};

const mapResult = f => result => result.map(f);

module.exports = { Result, mapResult };
