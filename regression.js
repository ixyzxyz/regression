exports.coefficients = function (data_xy) {
/*
  xmn[i][j] * coefficients[j] = ym[i]
  xmn[i][j] = data_x[i][j]
  xmn[i][n - 1] = 1
  coefficients[i] = w[i]
  coefficients[n - 1] = b
  ym[i] = data_y[i]
*/
  const xmn = [];
  const ym = [];
  setData();
  const m = xmn.length;
  const n = xmn[0].length;
  const matrix = Array(n).fill().map(() => Array(n).fill(0));
  const inverse = Array(n).fill().map(() => Array(n).fill(0));
  const pseudoInverse = Array(n).fill().map(() => Array(m).fill(0));
  const coefficients = Array(n).fill(0);
  getCoefficients();
  return coefficients;
  function setData() {
    for (const data of data_xy) {
      xmn.push([...data.x, 1]);
      ym.push(data.y);
    }
  }
  function invert() {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        inverse[i][j] = (i == j) ? 1 : 0;
      }
    }
    for (let i = 0; i < n; i++) {
      const buffer = 1 / matrix[i][i];
      for (let j = 0; j < n; j++) {
        matrix[i][j] *= buffer;
        inverse[i][j] *= buffer;
      }
      for (let j = 0; j < n; j++) {
        if (i != j) {
          const buffer = matrix[j][i];
          for (let k = 0; k < n; k++) {
            matrix[j][k] -= buffer * matrix[i][k];
            inverse[j][k] -= buffer * inverse[i][k];
          }
        }
      }
    }
  }
  function pseudoInvert() {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        matrix[i][j] = 0;
        for (let k = 0; k < m; k++) {
          matrix[i][j] += xmn[k][i] * xmn[k][j];
        }
      }
    }
    invert();
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        pseudoInverse[i][j] = 0;
        for (let k = 0; k < n; k++) {
          pseudoInverse[i][j] += inverse[i][k] * xmn[j][k];
        }
      }
    }
  }
  function getCoefficients() {
    pseudoInvert();
    for (let i = 0; i < n; i++) {
      coefficients[i] = 0;
      for (let k = 0; k < m; k++) {
        coefficients[i] += pseudoInverse[i][k] * ym[k];
      }
    }
/*
    console.log(xmn);
    console.log(ym);
    console.log(coefficients);
*/
/*
    let identity = Array(n).fill().map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        identity[i][j] = 0;
        for (let k = 0; k < m; k++) {
          identity[i][j] += pseudoInverse[i][k] * xmn[k][j];
        }
      }
    }
    console.log(identity);
*/
  }
}
exports.predictedValue = function (data_xy) {
  const coefficients = exports.coefficients(data_xy);
  return x => {
    let sum = 0;
    for (let i = 0; i < coefficients.length - 1; i++) sum += coefficients[i] * x[i];
    return sum + coefficients[coefficients.length - 1];
  }
}
exports.predictedValueFromNeighbors = function (data_xy) {
  Array.prototype.transpose = function () { return this[0].map(column => this.map(row => row[column])); };
  const variances = data_xy.map($ => $.x).transpose().map($ => variance($));
  const metrices = variances.map($ => 1 / $);
  return (x, neighbors) => {
    const sub_data_xy = data_xy.sort(($1, $2) => distance(metrices)($1.x, x) - distance(metrices)($2.x, x)).slice(0, neighbors);
    console.log(sub_data_xy);
    return exports.predictedValue(sub_data_xy)(x);
  }
  function variance(array) {
    let mean = 0;
    for (const element of array) mean += element;
    mean /= array.length;
    let variance = 0;
    for (const element of array) variance += (element - mean) ** 2;
    variance /= array.length;
    return variance;
  }
  function distance(metrices) {
    Array.prototype.sum = function () { return this.reduce((sum, $) => sum + $); };
    return (point$, point) => Math.sqrt(metrices.map((_, i) => metrices[i] * (point$[i] - point[i]) ** 2).sum());
  }
}