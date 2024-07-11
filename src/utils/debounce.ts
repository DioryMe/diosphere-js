export function debounce(func: any, wait: number, immediate = false) {
  let timeout: any
  // eslint-disable-next-line func-names
  return (): typeof func => {
    // @ts-ignore
    const context = this
    const args = arguments
    // eslint-disable-next-line func-names
    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
