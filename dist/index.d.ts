interface StoreConfigs {
    persist?: boolean;
    allowExistingData?: boolean;
}
declare class Store {
    data: Map<string, any>;
    effects: Map<string, any>;
    configs: StoreConfigs;
    constructor(configs: StoreConfigs);
    private isRunningOnNode;
    /**
   * Add data to the store
   * @param {String} name - Name of the key for store data
   * @param {Any} value - Initial value of the data
   * @param {Function} [effect] - Effect to run when data is updated
   */
    add(name: string, value: any, effect: (value?: any, oldValue?: any) => void): void;
    /**
     * Get data from store
     * @param {String} name
     */
    get(name: string): any;
    /**
     * Get all data from store
     */
    all(): {
        [key: string]: any;
    };
    /**
     * Get specifics data from the store
     */
    only(fields?: never[]): {
        [key: string]: any;
    };
    /**
     * Verify if a data exists in the store
     */
    has(name: string): boolean;
    /**
   * Update data in the store and run the effects
   * @param {*} name - Name of the data to update value
   * @param {*} value - Value to be updated
   */
    update(name: string, value: any): void;
    /**
     * Delete some data in the store
     * @param {String} name - Name of data to be deleted
     */
    delete(name: string): void;
    /**
     * Bind an effect to a data in the store
     * @param {String} name - Name of the data where the effect will be binded
     * @param {Function} callback - Effect to run when data updated
     */
    listen(name: string, callback: (value?: any, oldValue?: any) => void): void;
    /**
     * Run effects of some data change in the store
     * @param {String} name - Name of the data
     * @param {Any} value - New value
     * @param {Any} oldValue - Old value of that data
     */
    private runEffects;
}
export = Store;
