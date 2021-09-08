import Vue from 'vue';

Vue.prototype.$sanitizeWeight = function (value) {
  if (value) {
    let newWeight = value;
    newWeight.replace(/[^0-9.]/g, '');

    const dotCount = (newWeight.match(/\./g) || []).length;

    if (!newWeight.endsWith('.') || dotCount > 1) {
      newWeight = `${Math.trunc(parseFloat(newWeight) * 100) / 100}`;
    }
    return newWeight;
  }
};

Vue.prototype.$sanitizeText = function (value) {
  let val = value;
  if (value.length > 65) {
    val = value.substring(0, 65);
  }
  val = val.replace(/\n/g, '');
  return val;
};

Vue.prototype.$kgToStone = function (val) {
  if (typeof val === 'string') {
    return val;
  }
  return val / 6.35029318;
};

Vue.prototype.$stoneToKg = function (val) {
  if (typeof val === 'string') {
    return val;
  }
  return val * 6.35029318;
};

Vue.prototype.$round = function (val) {
  return Math.round(val * 100) / 100;
};
