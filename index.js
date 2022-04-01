const clothes = [
  ['crow_mask', 'face'],
  ['blue_sunglasses', 'face'],
  ['smoky_makeup', 'face'],
];

function solution(clothes) {
  let result;
  const totalClothes = clothes.length;
  const typeList = [];
  clothes.map(
    (clothe) => (typeList[clothe[1]] = (typeList[clothe[1]] | 0) + 1)
  );

  const typeListEntiry = Object.entries(typeList);

  if (typeListEntiry.length === 1) {
    result = totalClothes;
  } else {
    const cntType = Object.values(typeList).reduce((acc, cnt) => acc * cnt, 1);
    result = cntType + totalClothes;
  }

  return result;
}

// const r = solution(clothes);
// console.log(r);

function solution(clothes) {
  return (
    Object.values(
      clothes.reduce((obj, t) => {
        obj[t[1]] = obj[t[1]] ? obj[t[1]] + 1 : 1;
        return obj;
      }, {})
    ).reduce((a, b) => a * (b + 1), 1) - 1
  );
}
