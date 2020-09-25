"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveData = exports.getData = void 0;
var storageKey = 'simple-store-data';
/**
 * Get store data from localStorage
 */
function getData() {
    if (localStorage.getItem(storageKey)) {
        var data_1 = JSON.parse(localStorage.getItem(storageKey));
        var map_1 = new Map();
        Object.keys(data_1).forEach(function (key) { map_1.set(key, data_1[key]); });
        return map_1;
    }
    return new Map();
}
exports.getData = getData;
/**
 * Save store data in localStorage
 * @param data
 */
function saveData(data) {
    var object = {};
    data.forEach(function (value, key) { object[key] = value; });
    var dataJSON = JSON.stringify(object);
    localStorage.setItem(storageKey, dataJSON);
}
exports.saveData = saveData;
