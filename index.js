const data = new Map()
const effects = new Map()

export function createStore(configs) {

}

/**
 * Add some data key to the store
 * @param {String} name 
 * @param {Any} value 
 * @param {Function} effect
 */
export function addData(name, value, effect) {
    if (data.has(name)) {
        throw new Error(`${name} already exists in the store`)
    }

    data.set(name, value)

    if (effect) {
        bindEffect(name, effect)
    }
}

/**
 * Bind an effect to a data in the store
 * @param {String} name 
 * @param {Function} callback 
 */
export function bindEffect(name, callback) {
    if (!data.has(name)) {
        throw new Error(`${name} does not exists in the store`)
    }

    if (!effects.has(name)) {
        effects.set(name, [])
    }

    const currentEffects = effects.get(name)
    effects.set(name, [ ...currentEffects, callback ])
}

/**
 * Update data in the store and run the effects
 * @param {*} name 
 * @param {*} value 
 */
export function updateStore(name, value) {
    if (!data.has(name)) {
        throw new Error(`${name} does not exists in the store`)
    }

    const oldValue = data.get(name)
    data.set(name, value)

    // Run effects
    runEffects(name, value, oldValue)
}

/**
 * Run effects of some data change in the store
 * @param {String} name 
 * @param {Any} value 
 * @param {Any} oldValue 
 */
export function runEffects(name, value, oldValue) {
    if (effects.has(name)) {
        effects.get(name).forEach(callback, () => {
            callback(value, oldValue)
        })
    }
}

/**
 * Delete some data in the store
 * @param {String} name 
 */
export function deleteData(name) {
    if (!data.has(name)) {
        throw new Error(`${name} does not exists in the store`)
    }

    data.delete(name)
}