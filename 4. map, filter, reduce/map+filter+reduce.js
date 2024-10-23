const { log, map, filter, reduce } = require('./module.js');

const products = [
  { name: '반팔티', price: 15000 },
  { name: '긴팔티', price: 20000 },
  { name: '핸드폰케이스', price: 15000 },
  { name: '후드티', price: 30000 },
  { name: '바지', price: 25000 },
];

const add = (a, b) => a + b;

// price가 20000 미만인 상품들의 가격 총합
log(
  reduce(
    add,
    0,
    map((p) => p.price,
        filter((p) => p.price < 20000, products))
  )
);

// price가 20000 이상인 상품들의 가격 총합
log(
    reduce(
        add,
        0,
        filter((p) => p >= 20000,
            map((p) => p.price, products))
    )
);


/** FP적인 사고로 생각해보기 */
// 1.
log(
    reduce(
      add,
      [10, 20, 30, 45] // 이렇게 숫자 배열로 평가될 수 있는 함수를 기대
    )
);

// 2.
log(
    reduce(
      add,
      map(p => p.price, products) // products 역시 price 값을 가진 객체 배열로 평가될 함수를 기대
    )
);
