/**
 * 仅数字
 *
 * @param {Object} evt 事件对象
 */
export function onlyNumber(evt) {
  if (!evt || !(evt instanceof Object)) return;
  return /[\d]/.test(String.fromCharCode(evt.keyCode));
}

export function checkNumberInput(evt) {
  if (!(/^\d+$/gi.test(evt.key) || evt.key === 'Backspace')) {
    // 非数字 回退键 key preventDefault
    evt.preventDefault();
  }
}

export function checkChineseInput(evt) {
  if (!(/^[\u4E00-\u9FA5]+$/gi.test(evt?.target?.value) || evt.key === 'Backspace')) {
    // 非汉字 回退键 key preventDefault
    evt.preventDefault();
  }
}
