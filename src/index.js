import { persistData, getPersistedData } from './persist'

class Store {
  constructor(configs = {}) {
    this.data = new Map()
    this.effects = new Map()
    this.configs = new Map()

    this.setConfigs(configs)

    if (this.configs.persist === true) {
      this.data = getPersistedData()
    }
  }

  setConfigs(configurations = {}) {
    if (typeof configurations !== 'object') {
      throw new TypeError('Configuration should be an object')
    }

    Object.keys(configurations).forEach((key) => this.configs.set(key, configurations[key]))
  }

  isRunningOnNode() {
    return typeof window === 'undefined'
  }

  /**
 * Add some data key to the store
 * @param {String} name - Name of the key for store data
 * @param {Any} value - Initial value of the data
 * @param {Function} [effect] - Effect to run when data is updated
 */
  add(name, value, effect) {
    if (typeof name !== 'string') {
      throw new Error('Name of the store key data should be a string')
    }

    if (this.data.has(name)) {
      throw new Error(`${name} already exists in the store`)
    }

    this.data.set(name, value)

    if (effect) {
      this.bindEffect(name, effect)
    }

    // Persist data via localStorage
    if (this.configs.persist === true && !this.isRunningOnNode()) {
      persistData(this.data)
    }
  }

  /**
   * Get some data from store
   * @param {String} name
   */
  get(name) {
    if (!this.data.has(name)) {
      return undefined
    }

    return this.data.get(name)
  }

  /**
 * Update data in the store and run the effects
 * @param {*} name - Name of the data to update value
 * @param {*} value - Value to be updated
 */
  update(name, value) {
    if (!this.data.has(name)) {
      throw new Error(`${name} does not exists in the store`)
    }

    const oldValue = this.data.get(name)
    this.data.set(name, value)

    // Run effects
    this.runEffects(name, value, oldValue)

    // Perist data via localStorage
    if (this.configs.persist === true && !this.isRunningOnNode()) {
      persistData(this.data)
    }
  }

  /**
 * Delete some data in the store
 * @param {String} name - Name of data to be deleted
 */
  delete(name) {
    if (!this.data.has(name)) {
      throw new Error(`${name} does not exists in the store`)
    }

    this.data.delete(name)

    // Perist data via localStorage
    if (this.configs.persist === true && !this.isRunningOnNode()) {
      persistData(this.data)
    }
  }

  /**
 * Bind an effect to a data in the store
 * @param {String} name - Name of the data where the effect will be binded
 * @param {Function} callback - Effect to run when data updated
 */
  bindEffect(name, callback) {
    if (!this.data.has(name)) {
      throw new Error(`${name} does not exists in the store`)
    }

    if (!this.effects.has(name)) {
      this.effects.set(name, [])
    }

    const currentEffects = this.effects.get(name)
    this.effects.set(name, [...currentEffects, callback])
  }

  /**
 * Run effects of some data change in the store
 * @param {String} name - Name of the data
 * @param {Any} value - New value
 * @param {Any} oldValue - Old value of that data
 */
  runEffects(name, value, oldValue) {
    if (this.effects.has(name)) {
      this.effects.get(name).forEach((callback) => {
        callback(value, oldValue)
      })
    }
  }
}

export default Store
