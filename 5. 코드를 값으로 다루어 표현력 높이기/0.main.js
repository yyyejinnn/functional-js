// const { reduce } = require('../4. map, filter, reduce/module.js');
const { log, curry, reduce, filter, map } = require('./module.js');

const products = [
  { name: '반팔티', price: 15000 },
  { name: '긴팔티', price: 20000 },
  { name: '핸드폰케이스', price: 15000 },
  { name: '후드티', price: 30000 },
  { name: '바지', price: 25000 },
];

const add = (a, b) => a + b;

/**
 * - FP에서는 함수를 인자로 사용하는 경우가 많다.
 * - 평가되는 시점을 원하는대로 다룰 수 있음
 */


/** 1. go, pipe */

// 1-1. go
const go = (...args) => reduce((a, f) => f(a), args);

go(
  0,
  (a) => a + 10,
  (a) => a + 100,
  log
); // 100


// 1-2. pipe
const p1 = (...fs) => () => {}; // pipe는 함수를 리턴한다.
const p2 = (...fs) => (a) => go(a, ...fs); // 인자를 받을 수 있도록

const p2f = p2(
  (a) => a + 1,
  (a) => a + 10,
  (a) => a + 100
);
log(p2f(1)); // 112

// 인자 두 개 받고 싶으면?
go(
  add(0, 1), // go는 이렇게 하면 됨
  (a) => a + 10,
  (a) => a + 100,
  log
);

// pipe는..?
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

const f = pipe(
  (a, b) => a + b,
  (a) => a + 10,
  (a) => a + 100
);

/** f(0, 1)
 * go((0, 1) => 0 + 1, a => a + 10, a => a + 100))
 * go(1, a => a + 10, a => a + 100);
 * reduce((1, a => a + 10) => 1 => 1 + 10, [ a => a + 100 ])
 * reduce((11, a => a + 100) => 11 => 11 + 100)
 * => 111
 */
f(0, 1);
log(f(0, 1)); // 111



/** 2. curry -> module.js에 설명 보고 오기 */

// 2-1. 예시
const mult = curry((a, b) => a * b);

const m1 = mult(4, 5);
log(m1); // 20

const m2 = mult(3); // (b) => 3 * b
log(m2(1)); // 3
log(m2(2)); // 6
log(m2(3)); // 9


// 2-2. curry로 가독성 높이기
// 기존
log(
  reduce(
    add,
    map(
      (p) => p.price,
      filter((p) => p.price < 20000, products)
    )
  )
);

// go 사용
go(
  products,
  (products) => filter((p) => p.price < 20000, products), // 20000 미만인 상품들
  (products) => map((p) => p.price, products), // 20000 미만인 상품들의 가격
  (prices) => reduce(add, prices), // 20000 미만인 상품들의 가격 총합
  log
);

/** curry와 맵핑한 map, filter, reduce 사용
 * - curry로 인해 filter, map, reduce는 함수를 반환
 * - 실제 함수 실행 권한은 go에게 위임 (go가 마지막 인자를 넘기는 순간 실행되기 때문에)
 */
go(
  products,
  (products) => filter((p) => p.price < 20000)(products),
  (products) => map((p) => p.price)(products),
  (products) => reduce(add)(products),
  log
);

// 다음과 같이 축약가능 -> 가독성 굿
go(
  products,
  filter((p) => p.price < 20000),
  map((p) => p.price),
  reduce(add),
  log
);
/** 실행 흐름 생각해보기
 * filter = (a, ..._) => _.length ? (f, iter) => {...}(a, ..._)
 *                                  : (..._) => ((f, iter) => {})(a, ..._)
 * filter((p) => p.price < 20000) -> (..._) => ((f, iter) => {})((p) => p.price < 20000, ..._) // 인자 하나라 또다른 인자 받는 함수 호출
 * (..._) => ((f, iter) => {})((p) => p.price < 20000, products) // ..._에 products 들어감
 * return filteredProducts
 *
 * map((p) => p.price) -> (..._) => ((f, iter) => {})((p) => p.price, ..._)
 * (..._) => ((f, iter) => {})((p) => p.price, filteredProducts)
 * return mappedPrices
 *
 * reduce(add): (..._) => ((f, acc, iter) => {})(add(a, b), ..._)
 * (..._) => ((f, acc, iter) => {})(add(a, b), mappedPrices)
 * return reducePrice
 */



/** 3. 함수 조합으로 함수 만들기 */
go(
  products,
  (products) => filter((p) => p.price < 20000, products),
  (products) => map((p) => p.price, products),
  (prices) => reduce(add, prices),
  log
);

const totalPrice = pipe( // 파이프 얘도 새로운 함수 반환 함
  map((p) => p.price),
  reduce(add)
);

// map, reduce를 totalPrice로 합침
go(products, (products) => filter((p) => p.price < 20000, products), totalPrice, log);

const baseTotalPrice = (predi) => pipe(filter(predi), totalPrice);

// filter, totalPrice를 baseTotalPrice로 합침
go(
  products,
  baseTotalPrice((p) => p.price < 20000),
  log
);

go(
  products,
  baseTotalPrice((p) => p.price >= 20000),
  log
);
