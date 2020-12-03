import defaultConfigs from './configs'
import { getData, saveData } from './persist'

interface StoreConfigs {
  /**
   * Persist the data on refresh using localStorage (works only on browser env)
   */
  persist?: boolean;

  /**
   * Allow store to overwrite data when data already exists
   */
  allowExistingData?: boolean;
}

class Store {
  /**
   * Store data
   */
  data: Map<string | number, any>;

  /**
   * Binded effects
   */
  effects: Map<string | number, any>;

  /**
   * Store configs
   */
  configs: StoreConfigs;

  constructor(configs: StoreConfigs) {
    this.data = new Map();
    this.effects = new Map();
    this.configs = { ...defaultConfigs, ...configs };

    if (!this.isRunningOnNode() && this.configs.persist === true) {
      this.data = getData()
    }
  }

  private isRunningOnNode() {
    return typeof window === 'undefined'
  }

  /**
 * Add data to the store
 * @param {String | Number} name - Name of the key for store data
 * @param {Any} value - Initial value of the data
 * @param {Function} [effect] - Effect to run when data is updated
 */
  add(name: string | number, value: any, effect?: (value?: any, oldValue?: any) => void) {
    if (typeof name !== 'string' && typeof name !== 'number') {
      throw new Error('Name of the store key data should be a string')
    }

    if (this.configs['allowExistingData'] === false && this.data.has(name)) {
      throw new Error(`${name} already exists in the store`)
    }

    this.data.set(name, value)

    if (effect) {
      this.listen(name, effect)
    }

    // Persist data via localStorage
    if (this.configs['persist'] === true && !this.isRunningOnNode()) {
      saveData(this.data)
    }
  }

  /**
   * Get data from store
   * @param {String | Number} name - Name of the data
   */
  get(name: string | number) {
    return this.data.get(name)
  }

  /**
   * Get all data from store
   */
  all() {
    const object: { [key in string | number]: any } = {}

    this.data.forEach((value, key) => { object[key] = value })

    return object
  }

  /**
   * Get specifics data from the store
   * @param fields - Fields to be selected
   */
  only(fields = []) {
    if (!Array.isArray(fields)) {
      throw new Error('The only method should only receive an array as argument')
    }

    const filteredObject: { [key: string]: any } = {}

    fields.forEach((field) => { filteredObject[field] = this.get(field) })

    return filteredObject
  }

  /**
   * Verify if a data exists in the store
   * @param {String  | Number} name - Name of data
   */
  has(name: string | number) {
    return this.data.has(name)
  }

  /**
 * Update data in the store and run the effects
 * @param {String | Number} name - Name of the data to update value
 * @param {Any} value - Value to be updated
 */
  update(name: string | number, value: any) {
    if (!this.data.has(name)) {
      throw new Error(`${name} does not exists in the store`)
    }

    const oldValue = this.data.get(name)
    this.data.set(name, value)

    // Run effects
    this.runEffects(name, value, oldValue)

    // Perist data via localStorage
    if (this.configs['persist'] === true && !this.isRunningOnNode()) {
      saveData(this.data)
    }
  }

  /**
   * Delete some data in the store
   * @param {String | Number} name - Name of data to be deleted
   */
  delete(name: string | number) {
    if (!this.data.has(name)) {
      throw new Error(`${name} does not exists in the store`)
    }

    this.data.delete(name)

    // Perist data via localStorage
    if (this.configs['persist'] === true && !this.isRunningOnNode()) {
      saveData(this.data)
    }
  }

  /**
   * Bind an effect to a data in the store
   * @param {String | Number} name - Name of the data where the effect will be binded
   * @param {Function} callback - Effect to run when data updated
   */
  listen(name: string | number, callback: (value?: any, oldValue?: any) => void) {
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
   * @param {String  | Number} name - Name of the data
   * @param {Any} value - New value
   * @param {Any} oldValue - Old value of that data
   */
  private runEffects(name: string | number, value: any, oldValue: any) {
    if (this.effects.has(name)) {
      this.effects.get(name).forEach((callback: (value?: any, oldValue?: any) => void) => {
        callback(value, oldValue)
      })
    }
  }
}

export = Store