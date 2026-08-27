export const generateSlug = (text: string): string => {
  const slug = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères non alphanumériques par des tirets
    .replace(/^-+|-+$/g, '') // Supprimer les tirets au début et à la fin

  // Ajouter un timestamp pour garantir l'unicité
  const timestamp = Date.now().toString(36)
  return `${slug}-${timestamp}`
}

export const generateSlugWithoutTimestamp = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const generateUniqueSlug = async (
  text: string,
  existingSlugs: string[]
): Promise<string> => {
  let slug = generateSlugWithoutTimestamp(text)
  let uniqueSlug = slug
  let counter = 1

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`
    counter++
  }

  return uniqueSlug
}