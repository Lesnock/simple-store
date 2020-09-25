const storageKey = 'simple-store-data'

/**
 * Get store data from localStorage
 */
export function getData(): Map<string, any> {
  if (localStorage.getItem(storageKey)) {
    const data = JSON.parse(<string>localStorage.getItem(storageKey))

    const map: Map<string, any> = new Map()

    Object.keys(data).forEach(key => { map.set(key, data[key]) })

    return map
  }

  return new Map()
}

/**
 * Save store data in localStorage
 * @param data 
 */
export function saveData(data: Map<any, any>) {
  const object: { [key: string]: any } = {}
  data.forEach((value, key) => { object[key] = value })

  const dataJSON = JSON.stringify(object)
  localStorage.setItem(storageKey, dataJSON)
}
