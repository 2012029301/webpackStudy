import { sum } from "./js/sum";
import "./css/index.css";
import "./less/index.less";
import { div } from "./js/common";
// core-js 全部引入解决es6+兼容性会是其体积过大
// import "core-js";
console.log(sum(1, 2, 3, 4, 5, 6), div(1, 3));
document.getElementById("btn").onclick = function () {
  // 把动态加载的打包后的文件名和之前的对应
  import(/* webpackChunkName: "math" */ "./js/add").then((res) => {
    console.log(res);
  });
};

new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
}).then((res) => {
  console.log(res);
});
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
