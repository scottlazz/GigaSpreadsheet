import FinData from "./FinData";
export default class YA {
    constructor() {
        var _a;
        this.onmessage = (event) => {
            var _a;
            try {
                const messageData = event.data;
                const data = (_a = this.Yaticker) === null || _a === void 0 ? void 0 : _a.decode(new Uint8Array(atob(messageData)
                    .split("")
                    .map((c) => c.charCodeAt(0))));
                if (data.id.startsWith('^')) {
                    data._id = data.id;
                    data.id = data.id.slice(1);
                }
                this.data.store('YA', data.id, data);
                console.log('tick data:', data);
                this.updateListeners(data);
            }
            catch (e) {
                console.log(e);
            }
        };
        this.tickers = new Set();
        this.connection = null;
        this.data = new FinData();
        this.isOpen = false;
        this.root = protobuf.Root.fromJSON(require("./YADATA.json"));
        this.Yaticker = (_a = this.root) === null || _a === void 0 ? void 0 : _a.lookupType("yaticker");
        this.cbs = [];
        // setInterval(() => {
        //     const dummydata = { id: 'GME', price: Math.random() * 100 };
        //     this.data.store('YA', dummydata.id, dummydata);
        //     this.updateListeners(dummydata)
        // }, 1000)
    }
    /**
     * @returns something like '{"subscribe":["API","^GSPC","^DJI","^IXIC","^RUT","CL=F","GC=F","NVDA","GME","RKT","GAP","BLD","IBP"]}'
     */
    getSubString() {
        return JSON.stringify({
            subscribe: [...this.tickers]
        });
    }
    hasSubs() {
        return this.tickers.size > 0;
    }
    addListener(cb) {
        this.cbs.push(cb);
    }
    updateSubs() {
        if (this.connection) {
            if (this.hasSubs()) {
                this.connection.send(this.getSubString());
            }
        }
        else {
            this.connection = new WebSocket(atob("d3NzOi8vc3RyZWFtZXIuZmluYW5jZS55YWhvby5jb20v"));
            this.connection.onopen = () => {
                this.isOpen = true;
                if (this.hasSubs()) {
                    this.connection.send(this.getSubString());
                }
            };
            this.connection.onmessage = this.onmessage;
        }
        return this.connection;
    }
    updateListeners(data) {
        for (let cb of this.cbs) {
            cb(data);
        }
    }
    async fetchTicker(symbol) {
    }
    addSubs(subs) {
        for (let symbol of subs) {
            if (!this.tickers.has(symbol)) {
                this.fetchTicker(symbol);
            }
            this.tickers.add(symbol);
        }
        if (this.hasSubs()) {
            this.updateSubs();
        }
    }
}
