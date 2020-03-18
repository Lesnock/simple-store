const key = 'simple-store-data'

/**
 * Set some store data to the localStorage
 * @param {Any} storeData
 */
export function persistData(storeData) {
  const dataJSON = JSON.stringify(storeData)
  localStorage.setItem(key, dataJSON)
}

/**
 * Get store data from localStorage
 */
export function getPersistedData() {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key))
  }

  return new Map()
}
