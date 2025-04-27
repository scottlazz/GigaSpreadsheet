import YA from './ya';

export default class FinancialSubscriber {
    ya: any;
    tickListeners!: Function[];
    static _instance: any;
    constructor() {
        if (FinancialSubscriber._instance) {
            return FinancialSubscriber._instance
        }
        FinancialSubscriber._instance = this;
        this.ya = new YA();
        this.tickListeners = [];
        this.ya.addListener((data: any) => {
            for(let listener of this.tickListeners) {
                listener(data);
            }
        })
    }
    listenYA(tickers: Array<string>) {
        this.ya.addSubs(tickers);
    }
    onTick(fn: Function) {
        this.tickListeners.push(fn);
    }
}