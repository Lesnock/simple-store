const key = 'simple-store-data'

/**
 * Set some store data to the localStorage
 * @param {Any} storeData
 */
export function persistData(storeData) {
  const object = Object.fromEntries(storeData)

  const dataJSON = JSON.stringify(object)
  localStorage.setItem(key, dataJSON)
}

/**
 * Get store data from localStorage
 */
export function getPersistedData() {
  if (localStorage.getItem(key)) {
    const parsedJson = JSON.parse(localStorage.getItem(key))
    return new Map(Object.entries(parsedJson))
  }

  return new Map()
}
