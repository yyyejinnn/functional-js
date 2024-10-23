const log = console.log;

const products = [
  { name: '반팔티', price: 15000 },
  { name: '긴팔티', price: 20000 },
  { name: '핸드폰케이스', price: 15000 },
  { name: '후드티', price: 30000 },
  { name: '바지', price: 25000 },
];

/**
 * FP에서는 인자와 리턴 값으로 소통하는 것을 권장한다.
 * -> 직접적인 변화를 주는 것은 좋지 않음
 * -> 반환된 값을 가지고 개발자가 직접 핸들링 할 수 있도록
 */

/** 1. map */
const notMap = () => {
  let names = [];

  for (let p of products) {
    names.push(p);
  }

  log(names); // 이렇게 함수 내부에서 또다른 변화 주는 것 X
};

const map = (f, iter) => {
  let res = [];

  for (let a of iter) {
    res.push(f(a));
  }

  return res;
};

log('=============== map ex1===============');
log(map((p) => p.name, products)); // [ '반팔티', '긴팔티', '핸드폰케이스', '후드티', '바지' ]
log(map((p) => p.price, products)); // [ 15000, 20000, 15000, 30000, 25000 ]


/** 1-2. 이터러블 프로토콜을 따른 map의 다형성 */
log([1, 2, 3].map((a) => a + 1)); // [2, 3, 4]

// document.querySelectorAll('*').map((el) => el.nodeName); // ReferenceError: document is not defined
// log(document.querySelectorAll('*').map); // 순회 가능할 것 같으나 map 메서드가 없음 (document는 Array를 상속하고 있지 않기 때문)

/**
 * document.querySelectorAll('*')는 이터러블 프로토콜을 따르고 있고,
 * 위에서 생성한 map 함수는 이터러블 프로토콜을 따르는 for-of 구문을 사용하기 때문에 순회 가능
 */
// log(map((el) => el.nodeName, document.querySelectorAll('*'))); // ['HTML', 'HEAD', 'META', ...]
// log(it.next());
// log(it.next());
// log(it.next());
// log(it.next());
// log(it.next());

function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

log('=============== map ex2===============');

log(map((a) => a * a, gen())); // iterable 하면 모두 map할 수 있다.

let m = new Map([
  ['a', 10],
  ['b', 20],
]);
log(m); // Map(2) { 'a' => 10, 'b' => 20 }
log(new Map(map(([k, a]) => [k, a * 2], m))); // Map(2) { 'a' => 20, 'b' => 40 }



/** 2. filter */

const notFilter = () => {
  let under20000 = [];

  for (let p of products) {
    if (p.price < 20000) {
      under20000.push(p);
    }
  }

  log(...under20000);
};

const filter = (f, iter) => {
  let res = [];

  for (let a of iter) {
    if (f(a)) res.push(a);
  }

  return res;
};

log('=============== filter ex===============');
log(...filter((p) => p.price < 20000, products));
log(...filter((p) => p.price > 20000, products));

log(filter((n) => n % 2, [1, 2, 3, 4])); // [1, 3]

log(
  // [ 1, 3, 5 ]
  filter(
    (n) => n % 2,
    (function* (i = 1) {
      while (i <= 5) yield i++;
    })()
  )
);



/** 3. reduce */
let nums = [1, 2, 3, 4, 5];

const notReduce = () => {
  let total = 0;

  for (let n of nums) {
    total += n;
  }

  log(total);
};

const add = (a, b) => a + b;
const reduce = (f, acc, iter) => {
  /** acc 생략 시, reduce(add, 1, [2, 3, 4, 5])와 같이 동작하도록 */
  if (!iter) {
    iter = acc[Symbol.iterator](); // iter 초기화
    acc = iter.next().value; // 1번째 값으로 초기화
  }

  /** 내부적으로 다음과 같이 동작하도록 구현
   * log(add(add(add(add(add(0, 1), 2), 3), 4), 5));
   */
  for (let a of iter) {
    acc = f(acc, a);
  }

  return acc;
};

log('=============== reduce ex===============');
log(reduce(add, 0, nums)); // 15
log(reduce(add, [1, 2, 3, 4, 5])); // 15
log(reduce((acc, p) => acc + p.price, 0, products)); // 105000
