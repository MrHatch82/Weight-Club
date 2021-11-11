import Vue from 'vue';
import { DateTime } from 'luxon';

Vue.prototype.$sanitizeWeight = function (value) {
  if (value) {
    let newWeight = value;
    newWeight.replace(/[^0-9.]/g, '');

    const dotCount = (newWeight.match(/\./g) || []).length;

    if (!newWeight.endsWith('.') || dotCount > 1) {
      newWeight = `${Math.round(parseFloat(newWeight) * 100) / 100}`;
    }
    return newWeight;
  }
};

Vue.prototype.$sanitizeInt = function (value) {
  if (value) {
    const newWeight = value;
    newWeight.replace(/[^0-9]/g, '');

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

Vue.prototype.$displayWeight = function (val, store) {
  if (val === null) {
    return null;
  }
  if (store.state.weightUnit === 'kg') {
    return `${$round(val)} kg`;
  }

  let lb = $round($kgToStoneLb(val));
  lb = lb !== 0 ? `${lb} lb` : '';

  let stone = $kgToStoneInt(val);
  stone = stone !== 0 ? `${stone} stone` : '';

  if (!stone && !lb) {
    return '0 lb';
  }

  if (stone && lb) {
    stone += ', ';
  }

  return `${stone}${lb}`;
};

const $kgToStone = function (val) {
  if (typeof val === 'string') {
    return val;
  }

  if (val === null) {
    return null;
  }

  return val / 6.35029318;
};

Vue.prototype.$kgToStone = $kgToStone;

const $kgToStoneInt = function (val) {
  if (typeof val === 'string') {
    return val;
  }

  if (val >= 0) {
    return Math.floor(val / 6.35029318);
  }

  return Math.ceil(val / 6.35029318);
};

Vue.prototype.$kgToStoneInt = $kgToStoneInt;

const $kgToStoneLb = function (val) {
  if (typeof val === 'string') {
    return val;
  }
  return ((val / 6.35029318) % 1) * 14;
};

Vue.prototype.$kgToStoneLb = $kgToStoneLb;

Vue.prototype.$stoneToKg = function (val) {
  if (typeof val === 'string') {
    return val;
  }
  const stoneTotal = parseInt(val.stone) + parseFloat(val.lb) / 14;
  return stoneTotal * 6.35029318;
};

const $round = function (val) {
  return Math.round(val * 100) / 100;
};

Vue.prototype.$round = $round;

Vue.prototype.$he = require('he');

Vue.prototype.$isTodayOrNDaysBefore = (dateString, n = 0) => {
  const days = [];
  let result = false;

  for (let index = 0; index <= n; index++) {
    days.push(DateTime.now().startOf('day').minus({ days: index }));
  }

  days.forEach((day) => {
    if (DateTime.fromISO(dateString).startOf('day').equals(day)) {
      result = true;
    }
  });

  return result;
};
