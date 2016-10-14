var _elementStyle = document.createElement('div').style

var _vendor = (function () {
  let vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT']
  let transform
  let i = 0
  let l = vendors.length

  for (; i < l; i++) {
    transform = vendors[i] + 'ransform'
    if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1)
  }

  return false
})()

exports.prefixStyle = function (style) {
  if (_vendor === false) return false
  if (_vendor === '') return style
  return _vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

exports.test = () => {
  console.log('test')
}
