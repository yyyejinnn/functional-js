// const { log, curry, reduce, filter, map, go, pipe } = require('./module.js');
import { log, curry, reduce, filter, map, go, pipe } from './module.mjs';

const products = [
  { name: '반팔티', price: 15000, quantity: 1, is_selected: true },
  { name: '긴팔티', price: 20000, quantity: 2, is_selected: false },
  { name: '핸드폰케이스', price: 15000, quantity: 3, is_selected: true },
  { name: '후드티', price: 30000, quantity: 4, is_selected: false },
  { name: '바지', price: 25000, quantity: 5, is_selected: false },
];

// 1. 기존 go, pipe
const totalQuantityGo = (products) =>
  go(
    products,
    map((p) => p.quantity),
    reduce((a, b) => a + b)
  );

const totalQuantity1 = pipe(
  map((p) => p.quantity),
  reduce((a, b) => a + b)
);

const totalPrice1 = pipe(
  map((p) => p.price * p.quantity),
  reduce((a, b) => a + b)
);

log('=========== ex1. ===========');
log(totalQuantity1(products)); // 15
log(totalPrice1(products)); // 345000

// 2.  공통 로직 추출
const add = (a, b) => a + b;

const totalQuantity2 = pipe(
  map((p) => p.quantity),
  reduce(add)
);

const totalPrice2 = pipe(
  map((p) => p.price * p.quantity),
  reduce(add)
);

// 3. 공통 로직 추출2 -> 추상화, 다형성을 높여보자!
// - 현재 map(...) 인자 제외하고 전부 동일한 로직이고
// - products 도메인에 한정된 함수이다.

// !! sum은 숫자가 아닌 문자열에도 적용할 수 있다! (다형성)
const sum = curry((f, iter) => go(iter, map(f), reduce(add)));

const totalQuantity = sum((p) => p.quantity);
const totalPrice = sum((p) => p.price * p.quantity);

log('=========== ex3. ===========');
log(totalQuantity(products)); // 15
log(totalPrice(products)); // 345000

export { totalQuantity, totalPrice, sum };
