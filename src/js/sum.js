function sum(...arg) {
  return arg.reduce((pre, item) => pre + item);
}
function sum2(...arg) {
  // console.log(111);
  return arg.reduce((pre, item) => pre + item);
}

export { sum, sum2 };
