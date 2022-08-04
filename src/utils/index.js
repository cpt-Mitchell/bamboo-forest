export const DataFormate = {
  timeToStr: function(time) {
    let date = new Date(time)
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      date.getDate() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes()
    )
  }
}
export const parseTime = function(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}
// 高德转百度（火星坐标gcj02ll–>百度坐标bd09ll）
export const gaoDeToBaidu = (gdLon, gdLat) => {
  let PI = (3.14159265358979324 * 3000.0) / 180.0
  let x = gdLon,
    y = gdLat
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * PI)
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * PI)
  let bdLng = z * Math.cos(theta) + 0.0065
  let bdLat = z * Math.sin(theta) + 0.006
  return {
    bdLng,
    bdLat
  }
}
// 百度转高德（百度坐标bd09ll–>火星坐标gcj02ll）
export const baiduToGaoDe = (lng, lat) => {
  let X_PI = (Math.PI * 3000.0) / 180.0
  let x = lng - 0.0065,
    y = lat - 0.006
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI)
  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
  let bdLng = z * Math.cos(theta)
  let bdLat = z * Math.sin(theta)
  return {
    bdLat,
    bdLng
  }
}

export default {
  DataFormate,
  parseTime,
  gaoDeToBaidu,
  baiduToGaoDe
}
