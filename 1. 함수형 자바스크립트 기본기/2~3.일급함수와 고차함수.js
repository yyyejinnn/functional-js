const log = console.log;

/**
 * * 일급 함수: 함수가 값으로 다뤄질 수 있다.
 *
 * * 고차 함수: 함수를 값으로 다루는 함수
 * 1. 함수를 인자로 받아서 실행하는 함수
 * 2. 새로운 함수를 리턴하는 함수
 */

/** 고차 함수1. 함수를 인자로 받아서 실행하는 함수 */
const apply1 = (f) => f(1);
const add2 = (a) => a + 2;

log(apply1(add2)); // 3
// apply1(a => a + 2);
// (a => a + 2)(1);
// 1 + 2

log(apply1((a) => a - 1)); // 0
// (a => a - 1)(1);
// 1 - 1

const times = (f, n) => {
  let i = -1;
  while (++i < n) f(i);
};

times(log, 5); // 0 1 2 3 4
// while(++i < 5) log(i);

times((a) => log(a + 10), 3); // 10, 11, 12
// while(++i < 3) log(i + 10);


/** 고차 함수 2. 새로운 함수를 리턴하는 함수
 * 
 * * addMaker()은 클로저를 만드는 함수 -> a값을 기억하고 있다.
 * - (b => a + b)는 함수이자 a를 기억하는 클로저
 * - 함수가 함수를 반환하는 이유는 결국 "클로저를 만들기 위함"이다.
*/
const addMaker = (a) => {
  return (b) => a + b;
};

const add10 = addMaker(10); // (b) => 10 + b;

log(add10(5)); // 15
// addMaker(10)(5);
// ((a) => (b => a + b))(10)(5);
// (b => 10 + b)(5); -> a 값을 기억하고 있음
// 10 + 5
