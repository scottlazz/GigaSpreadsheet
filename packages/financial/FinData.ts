export default class FinData {
    static _instance: any;
    _data: Object;
    constructor() {
        if (FinData._instance) {
            return FinData._instance
        }
        FinData._instance = this;
        this._data = {};
    }
    store(namespace: string, key: string, value: any) {
        if (!this._data[namespace]) this._data[namespace] = {};
        this._data[namespace][key] = value;
    }
    get(namespace: string, key: string) {
        if (!this._data[namespace]) return null;
        if (!Object.hasOwn(this._data[namespace], key)) return null;
        return this._data[namespace][key];
    }
}