import YA from './ya';

export default class FinancialSubscriber {
    ya: any;
    static _instance: any;
    constructor() {
        if (FinancialSubscriber._instance) {
            return FinancialSubscriber._instance
        }
        FinancialSubscriber._instance = this;
        this.ya = null;
    }
    listenYA(tickers: []) {
        if (!this.ya) {
            this.ya = new YA();
        }
        this.ya.addSubs(tickers);
    }
}