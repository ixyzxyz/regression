const performance = require("perf_hooks").performance;
const regression = require("./regression");
/*
const start = performance.now();
const train_xy = [];
for (let x1 = 0; x1 < 10; x1++) {
  for (let x2 = 0; x2 < 10; x2++) {
    for (let x3 = 0; x3 < 10; x3++) {
      train_xy.push({x:[x1, x2, x3], y:(1 * x1 + 2 * x2 + 3 * x3 + 4)});
    }
  }
}
const x = [1, 2, 3];
console.log(`x:[${x}] -> y:${regression.predictedValue(train_xy)(x)}`);
console.log(`Regression Coefficients = [${regression.coefficients(train_xy)}]`);
const stop = performance.now();
console.log(`${(0.001 * (stop - start)).toFixed(6)}sec`);
*/
const start = performance.now();
const train_xy = [];
for (let x1 = 0; x1 < 10; x1++) {
  for (let x2 = 0; x2 < 10; x2++) {
    train_xy.push({x:[x1, x2], y:(x1 * x2)});
    //train_xy.push({x:[x1, x2], y:(x1 ** 2 + x2 ** 2)});
  }
}
const x = [2.2, 7.7];
const neighbors = 4;
console.log(`x:[${x}] -> y:${regression.predictedValueFromNeighbors(train_xy)(x, neighbors)}`);
const stop = performance.now();
console.log(`${(0.001 * (stop - start)).toFixed(6)}sec`);