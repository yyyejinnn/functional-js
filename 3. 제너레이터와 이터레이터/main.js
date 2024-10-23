const log = console.log;

/** 1. 제너레이터와 이터레이터
 *
 * * 제너레이터
 * - 이터레이터이자 이터러블을 생성하는 함수 = 즉, 이터레이터를 반환하는 함수
 * - 제너레이터를 통해 어떤 값도 순회하게 만들 수 있다.
 */

function* gen() {
  /**
   * yield
   * - 값 반환: 제너레이터 함수의 실행을 일시 중지하고, 특정 값을 호출자에게 반환
   * - 상태 저장: 제너레이트 함수는 yield를 만날 때 까지 실행되며, 그 지점에서 일시 중지되어 상태를 저장
   *      그 이후 next() 메서드를 호출하면 저장된 상태부터 다시 실행
   */
  yield 1;
  yield 2;
  yield 3;

  return 10; // done: true일 때 value, for..of에서는 제외 됨
}

log('=============== ex 1 ===============');
let it = gen();
log(it.next()); // {value: 1, done: false}
log(it.next()); // {value: 2, done: false}
log(it.next()); // {value: 3, done: false}
// log(it.next()); // {value: undefined, done: true}
log(it.next()); // {value: 10, done: true}

function* gen2() {
  yield 1;
  if (false) yield 2;
  yield 3;
}

log('=============== ex 2 ===============');
let it2 = gen2();
log(it2[Symbol.iterator]() == it2); // true

log(it2.next()); // {value: 1, done: false}
log(it2.next()); // {value: 3, done: false} => yield 2가 실행되지 않았기 때문
log(it2.next()); // {value: undefined, done: true}

log('=============== ex 3 ===============');
/**
 * - 어떤 값이든 이터러블하면 순회가 가능하다.
 * - 제너레이터는 구현한 로직을 통해 이터러블한 객체를 반환할 수 있다.
 *  즉, 어떠한 값이든 순회 가능하게 만들 수 있다.
 */
let it3 = gen();
for (const a of gen()) log(a);


/**
 * 2. 제너레이터 활용
 */

// 2-1.
function* odds(num) {
  for (let i = 1; i <= num; i++) {
    if (i % 2) yield i;
  }
}

log('=============== odds() ===============');
const itOdds = odds(5);
log(itOdds.next());
log(itOdds.next());
log(itOdds.next());
log(itOdds.next());

// 2-2.
function* infinity(i = 1) {
  while (true) yield i++;
}

function* odds2(num) {
  for (let a of infinity()) {
    if (a % 2) yield a;
    if (a === num) {
      return;
    }
  }
}

log('=============== odds2() ===============');
const itOdds2 = odds2(5);
log(itOdds2.next());
log(itOdds2.next());
log(itOdds2.next());
log(itOdds2.next());

// 2-3.
function* limit(l) {
  for (let a of infinity()) {
    yield a;
    if (a === l) return;
  }
}

function* odds3(num) {
  for (let a of limit(num)) {
    if (a % 2) yield a;
  }
}

log('=============== odds3() ===============');
let str = '';
for (const a of odds(20)) str += `${a} `; // 1~20까지의 홀수 출력
log(str);


/**
 * 3. for...of, 전개 연산자, 구조분해, 나머지 연산자
 */

log('=============== ex ===============');
log(...odds3(10)); // 1 3 5 7 9
log([...odds3(5), ...odds3(10)]); // [ 1, 3, 5, 1, 3, 5, 7, 9 ]

const [head, ...tail] = odds3(5);
log(head); // 1
log(tail); // [3, 5]

const [a, b, ...rest] = odds3(10);
log(a); // 1
log(b); // 3
log(rest); // [5, 7, 9]
