/* eslint-disable no-useless-escape */
export const numberOnly = {
  // 只能输入数字
  bind: function (el, { value }) {
    // 几位小数
    let reg
    let { max = 30, decimal = 2, isBank = false } = value
    if (decimal === 0) {
      reg = /\d*/g
    } else {
      reg = new RegExp(`^\\d*(\.?\\d{0,${decimal}})`, 'gim')
    }
    let oldValue = el.value
    el._numberOnly = function () {
      if (el.value === oldValue) {
        return
      } else {
        oldValue = el.value
      }
      if (!isBank) {
        let tmp = el.value.match(reg)[0] || ''
        let tmpArr = tmp.split('.')
        if (tmpArr[1] !== undefined) {
          tmp = tmpArr[0].substr(0, max) + '.' + tmpArr[1]
        } else {
          tmp = tmpArr[0] ? tmpArr[0].substr(0, max) : ''
        }
        el.value = Number.isNaN(+tmp) ? '' : tmp
      }
    }
    el.addEventListener('input', el._numberOnly)
  },
  update: function (el, { value, oldValue }) {
    // let {max = 30, decimal = 2} = value
    // // 最大位数
    // let val = el.value
    // val = val.substr(0, max)
    // let tmp = val.match(new RegExp(`^\\d*(\.?\\d{0,${decimal}})`, "gim"))[0] || ''
    // el.value = Number.isNaN(+tmp) ? '' : tmp
    el.dispatchEvent(new Event('input'))
  },
  unbind: function (el) {
    el.removeEventListener('input', el._numberOnly)
  }
}
