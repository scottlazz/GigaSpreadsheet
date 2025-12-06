export default class FinData {
    static _instance: any;
    _data: any;
    constructor();
    store(namespace: string, key: string, value: any): void;
    get(namespace: string, key: string): any;
}
