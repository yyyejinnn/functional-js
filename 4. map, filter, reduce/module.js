const log = console.log;

const map = (f, iter) => {
  let res = [];

  for (let a of iter) {
    res.push(f(a));
  }

  return res;
};

const filter = (f, iter) => {
  let res = [];

  for (let a of iter) {
    if (f(a)) res.push(a);
  }

  return res;
};

const reduce = (f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
};

module.exports = { log, map, filter, reduce };
