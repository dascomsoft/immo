import validator from 'validator'

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email)
}

export const validatePhone = (phone: string): boolean => {
  return validator.isMobilePhone(phone, 'fr-FR')
}

export const validateUrl = (url: string): boolean => {
  return validator.isURL(url)
}

export const validatePrice = (price: number): boolean => {
  return price >= 0
}

export const validateArea = (area: number): boolean => {
  return area >= 0
}