const log = console.log;

/** 1. 기존과 달라진 ES6에서의 리스트 순회 */
// 비교 1)
const li = [1, 2, 3];

for (let i = 0; i < li.length; i++) {
  //   log(li[i]);
}

for (let a of li) {
  //   log(a);
}

// 비교 2)
const str = 'abc';
for (let i = 0; i < str.length; i++) {
  //   log(i);
}

for (let c of str) {
  //   log(c);
}



/** 2. 이터러블/이터레이터 프로토콜
 * 이터러블: [Symbol.iterator]() 를 가진 모든 객체 -> 이터레이터를 반환.
 * 이터레이터: .next()를 가진 모든 객체 -> {value, done} 객체 반환
 *
 * 이터러블/이터레이터 프로토콜: 이터러블일 for...of, 전개 연산자 등과 함께 동작하도록 하기 위한 규약
 */

/** 2-1. Array를 통해 알아보기 */
function itArray() {
  let arr = [1, 2, 3]; // arr: 이터러블
  log(arr[Symbol.iterator]); // [Function: values]

  let itArr = arr[Symbol.iterator](); // itArr: 이터레이터
  log(itArr.next()); // { value: 1, done: false }
  log(itArr.next()); // { value: 2, done: false }
  log(itArr.next()); // { value: 3, done: false }
  log(itArr.next()); // { value: undefined, done: true } -> "done: true"이면 for 문에서 빠져나옴

  let itArr2 = arr[Symbol.iterator]();
  for (let a of itArr2) log(a); // 1 2 3

  let itArr3 = arr[Symbol.iterator]();
  log(itArr3.next()); // { value: 1, done: false }
  for (let a of itArr3) log(a); // 2 3

  // iterator를 null로 바꿔버리면 for...of문을 사용할 수 없다. 당연함
  arr[Symbol.iterator] = null;
  // for (const a of arr) log(a); // TypeError: arr is not iterable
}

/** 2-2. Set, Map을 통해 알아보기
 *
 * Set, Map은 index로 접근은 불가는 하나 for문을 통해 순회는 가능하다.
 * -> for...of로 순회할 때는 index로 접근하는 것이 아닌 Symbol.iterator를 통해 순회하기 때문
 */
function itSet() {
  const set = new Set([1, 2, 3]);

  console.log(set[0], set[1], set[2]); // undefined undefined undefined
  for (const a of set) log(a); // 1 2 3

  let setIt = set[Symbol.iterator]();
  log(setIt.next()); // {value: 1, done: false}
  log(setIt.next()); // {value: 2, done: false}
  log(setIt.next()); // {value: 3, done: false}
  log(setIt.next()); // {value: undefined, done: true}
}

function itMap() {
  const map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]);

  let mapIt = map[Symbol.iterator]();
  log(mapIt.next()); // { value: Array(2), done: false }  // value: (2)['a', 1]
  log(mapIt.next()); // { value: Array(2), done: false }
  log(mapIt.next()); // { value: Array(2), done: false }
  log(mapIt.next()); // { value: undefined, done: true }

  for (const m of map) log(m); // ['a', 1] ['b', 2] ['c', 3] -> 위의 value 값이 변수로 담김

  /**
   * map.keys()는 이터레이터를 반환한다. -> key만 담기게 됨
   * .values(), .entries()도 마찬가지
   */
  let keysIt1 = map.keys();
  log(keysIt1); // [Map Iterator] { 'a', 'b', 'c' }

  let keysIt2 = keysIt1[Symbol.iterator]();
  log(keysIt2); // [Map Iterator] { 'a', 'b', 'c' }

  log(keysIt1 === keysIt2); // true

  log(keysIt2.next()); // { value: 'a', done: false }
  log(keysIt2.next()); // { value: 'b', done: false }

  for (const a of map.keys()) log(a); // a b c
  for (const a of map.values()) log(a); // 1 2 3
  for (const a of map.entries()) log(a); // ['a', 1] ['b', 2] ['c', 3]
}



/** 3. 사용자 정의 이터러블, 이터러블/이터레이터 프로토콜 정의 */
const iterable = {
  [Symbol.iterator]() {
    let i = 3;
    return {
      next() {
        return i == 0 ? { done: true } : { value: i--, done: false };
      },

      // 자기 자신을 return 하도록 (well formed iterator)
      [Symbol.iterator]() {
        return this;
      },
    };
  },
};

let it = iterable[Symbol.iterator]();
for (const a of it) log(a); // 3 2 1

/** 3-1. well formed iterator */
const arr2 = [1, 2, 3];
let itArr2 = arr2[Symbol.iterator]();
console.log(itArr2 === itArr2[Symbol.iterator]()); // true -> Symbol.iterator은 자기 자신을 return 하기 때문



/** 4. 전개 연산자
 * - 전개 연산자도 이터러블 프로토콜을 따른다.
 * - 즉, 이터러블한 객체에는 전부 적용 가능하다.
 */
const a = [1, 2];
const b = new Set([3, 4, 5]);
const c = new Map([
  ['a', 6],
  ['b', 7],
]);
// a[Symbol.iterator] = null; // Error
log([...a, ...b, ...c.values()]); // [1, 2, 3, 4, 5, 6, 7]

// itArray();
// itSet();
// itMap();
