export default class FinData {
    constructor() {
        if (FinData._instance) {
            return FinData._instance;
        }
        FinData._instance = this;
        this._data = {};
    }
    store(namespace, key, value) {
        if (!this._data[namespace])
            this._data[namespace] = {};
        this._data[namespace][key] = value;
    }
    get(namespace, key) {
        var _a;
        if (!this._data[namespace])
            return null;
        if (!((_a = this._data[namespace]) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(key)))
            return null;
        return this._data[namespace][key];
    }
}
