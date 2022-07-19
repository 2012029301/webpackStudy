function sum(...arg) {
  return arg.reduce((pre, item) => pre + item);
}

export { sum };
