export function convertDivsToSpans(elem) {
  elem.style.overflow = 'hidden'
  elem.innerHTML = elem.innerText.split('').map((char) => {
    if (char === ' ')
      return '<span>&nbsp;</span>'
    return `<span class="animatedis">${char}</span>`
  }).join('')
  return elem
}
