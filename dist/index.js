"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var configs_1 = __importDefault(require("./configs"));
var persist_1 = require("./persist");
var Store = /** @class */ (function () {
    function Store(configs) {
        this.data = new Map();
        this.effects = new Map();
        this.configs = __assign(__assign({}, configs_1.default), configs);
        if (!this.isRunningOnNode() && this.configs.persist === true) {
            this.data = persist_1.getData();
        }
    }
    Store.prototype.isRunningOnNode = function () {
        return typeof window === 'undefined';
    };
    /**
   * Add data to the store
   * @param {String} name - Name of the key for store data
   * @param {Any} value - Initial value of the data
   * @param {Function} [effect] - Effect to run when data is updated
   */
    Store.prototype.add = function (name, value, effect) {
        if (typeof name !== 'string') {
            throw new Error('Name of the store key data should be a string');
        }
        if (this.configs['allowExistingData'] === false && this.data.has(name)) {
            throw new Error(name + " already exists in the store");
        }
        this.data.set(name, value);
        if (effect) {
            this.listen(name, effect);
        }
        // Persist data via localStorage
        if (this.configs['persist'] === true && !this.isRunningOnNode()) {
            persist_1.saveData(this.data);
        }
    };
    /**
     * Get data from store
     * @param {String} name
     */
    Store.prototype.get = function (name) {
        return this.data.get(name);
    };
    /**
     * Get all data from store
     */
    Store.prototype.all = function () {
        var object = {};
        this.data.forEach(function (value, key) { object[key] = value; });
        return object;
    };
    /**
     * Get specifics data from the store
     */
    Store.prototype.only = function (fields) {
        var _this = this;
        if (fields === void 0) { fields = []; }
        if (!Array.isArray(fields)) {
            throw new Error('The only method should only receive an array as argument');
        }
        var filteredObject = {};
        fields.forEach(function (field) { filteredObject[field] = _this.get(field); });
        return filteredObject;
    };
    /**
     * Verify if a data exists in the store
     */
    Store.prototype.has = function (name) {
        return this.data.has(name);
    };
    /**
   * Update data in the store and run the effects
   * @param {*} name - Name of the data to update value
   * @param {*} value - Value to be updated
   */
    Store.prototype.update = function (name, value) {
        if (!this.data.has(name)) {
            throw new Error(name + " does not exists in the store");
        }
        var oldValue = this.data.get(name);
        this.data.set(name, value);
        // Run effects
        this.runEffects(name, value, oldValue);
        // Perist data via localStorage
        if (this.configs['persist'] === true && !this.isRunningOnNode()) {
            persist_1.saveData(this.data);
        }
    };
    /**
     * Delete some data in the store
     * @param {String} name - Name of data to be deleted
     */
    Store.prototype.delete = function (name) {
        if (!this.data.has(name)) {
            throw new Error(name + " does not exists in the store");
        }
        this.data.delete(name);
        // Perist data via localStorage
        if (this.configs['persist'] === true && !this.isRunningOnNode()) {
            persist_1.saveData(this.data);
        }
    };
    /**
     * Bind an effect to a data in the store
     * @param {String} name - Name of the data where the effect will be binded
     * @param {Function} callback - Effect to run when data updated
     */
    Store.prototype.listen = function (name, callback) {
        if (!this.data.has(name)) {
            throw new Error(name + " does not exists in the store");
        }
        if (!this.effects.has(name)) {
            this.effects.set(name, []);
        }
        var currentEffects = this.effects.get(name);
        this.effects.set(name, __spreadArrays(currentEffects, [callback]));
    };
    /**
     * Run effects of some data change in the store
     * @param {String} name - Name of the data
     * @param {Any} value - New value
     * @param {Any} oldValue - Old value of that data
     */
    Store.prototype.runEffects = function (name, value, oldValue) {
        if (this.effects.has(name)) {
            this.effects.get(name).forEach(function (callback) {
                callback(value, oldValue);
            });
        }
    };
    return Store;
}());
module.exports = Store;
