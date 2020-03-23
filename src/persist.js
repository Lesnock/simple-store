const storageKey = 'simple-store-data'

/**
 * Set some store data to the localStorage
 * @param {Any} storeData
 */
export function persistData(storeData) {
  const object = {}
  storeData.forEach((value, key) => { object[key] = value })

  const dataJSON = JSON.stringify(object)
  localStorage.setItem(storageKey, dataJSON)
}

/**
 * Get store data from localStorage
 */
export function getPersistedData() {
  if (localStorage.getItem(storageKey)) {
    const parsedJson = JSON.parse(localStorage.getItem(storageKey))
    const map = new Map()

    Object.keys(parsedJson).forEach((value, key) => { map[key] = value })
    return new Map(Object.entries(parsedJson))
  }

  return new Map()
}
