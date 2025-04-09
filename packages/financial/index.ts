import YA from './ya';

export default class FinancialSubscriber {
    ya: any;
    tickListeners: Function[];
    static _instance: any;
    constructor() {
        if (FinancialSubscriber._instance) {
            return FinancialSubscriber._instance
        }
        FinancialSubscriber._instance = this;
        this.ya = new YA();
        this.tickListeners = [];
        this.ya.addListener((data) => {
            for(let listener of this.tickListeners) {
                listener(data);
            }
        })
    }
    listenYA(tickers: []) {
        this.ya.addSubs(tickers);
    }
    onTick(fn) {
        this.tickListeners.push(fn);
    }
}