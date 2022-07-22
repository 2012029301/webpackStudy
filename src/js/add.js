const add = function (...arg) {
  console.log(11111111111);
  return arg.reduce((pre, item) => pre + item);
};
export default add;
