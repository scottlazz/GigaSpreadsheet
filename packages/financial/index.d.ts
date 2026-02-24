export default class FinancialSubscriber {
    ya: any;
    tickListeners: Function[];
    static _instance: any;
    constructor();
    listenYA(tickers: Array<string>): void;
    onTick(fn: Function): void;
}
