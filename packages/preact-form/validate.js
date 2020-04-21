export const required = value => {
  if (Array.isArray(value)) return value.length > 0 ? undefined : '必填'
  return value ? undefined : '必填'
}

export const min = minNum => num => {
  if (num && num < minNum) {
    return `必须大于等于${minNum}`
  }
}

export const max = maxNum => num => {
  if (num && num > maxNum) {
    return `必须小于等于${maxNum}`
  }
}

export const range = (minNum, maxNum) => num => {
  if (num && (num < minNum || num > maxNum)) {
    return `必须填写${minNum}~${maxNum}范围内的数值`
  }
}

export const minLenght = length => str => {
  if (str && str.length < length) {
    return `字数必须大于等于${length}`
  }
}

export const maxLenght = length => str => {
  if (str && str.length > length) {
    return `字数必须小于等于${length}`
  }
}
