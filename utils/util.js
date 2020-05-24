const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 判断是否为手机号  
const isPhoneAvailable = phone => {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(phone)) {
    return false;
  }
  return true;
}

const isPlainObject = target =>
  target &&
  target.toString() == '[object Object]' &&
  Object.getPrototypeOf(target) == Object.prototype;

const _jsonify = target => {
  if (target && typeof target.toJSON === 'function') return target.toJSON();
  if (Array.isArray(target)) return target.map(_jsonify);
  return target;
};

const jsonify = target =>
  isPlainObject(target) ?
  Object.keys(target).reduce(
    (result, key) => ({
      ...result,
      [key]: _jsonify(target[key])
    }), {}
  ) :
  _jsonify(target);

module.exports = {
  formatTime: formatTime,
  isPhoneAvailable: isPhoneAvailable,
  jsonify: jsonify,
  isPlainObject: isPlainObject
}
