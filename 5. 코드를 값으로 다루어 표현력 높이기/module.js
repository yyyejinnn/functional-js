const log = console.log;

/** curry
 * 함수를 받아서 함수를 리턴하고, 인자를 원하는 만큼 받았을 때 평가하는 함수
 *
 * 1. curry는 f라는 함수를 인자로 받아 새로운 함수를 반환하는 화살표 함수
 * 2. 첫번째 반환 함수: (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);
 * 3. 인자 검사 및 호출
 *  3-1. _.length가 참이면 f(a, ..._)를 호출해 즉시 결과를 반환
 *  3-2. 거짓이면 다시 curry(f)를 호출해 나머지 인자를 받아 f(a, ..._)를 호출
 * 
 * const curry = f => // 함수를 인자로 받아
 *  (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._); // 새로운 함수 리턴!
 */


const curry = f =>
            (a, ..._) =>     // 인자와 함께 실행됐을 때
                _.length ? f(a, ..._)           // 인자가 두개 이상이라면 즉시 실행
                    : (..._) => f(a, ..._); // 아니라면 함수 리턴, 후에 받은 인자와 함께 실행


const map = curry((f, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(f(a));
  }
  return res;
});

const filter = curry((f, iter) => {
  let res = [];
  for (const a of iter) {
    if (f(a)) res.push(a);
  }
  return res;
});

const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
});

module.exports = { log, curry, map, filter, reduce };
