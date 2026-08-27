export const formatPrice = (price: number, currency: string = '€'): string => {
  return `${price.toLocaleString('fr-FR')} ${currency}`
}

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const formatDateTime = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const isObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id)
}