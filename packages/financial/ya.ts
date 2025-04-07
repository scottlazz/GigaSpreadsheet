import FinData from "./FinData";

declare var protobuf: any;
declare var require: any;


export default class YA {
    tickers: Set<any>;
    connection: WebSocket | null;
    data: FinData;
    root: any;
    Yaticker: any;
    isOpen: boolean;
    constructor() {
        this.tickers = new Set();
        this.connection = null;
        this.data = new FinData();
        this.isOpen = false;
        this.root = protobuf.Root.fromJSON(require("./YADATA.json"));
        this.Yaticker = this.root?.lookupType("yaticker");
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
    updateSubs() {
        if (this.connection) {
            if (this.hasSubs()) {
                this.connection!.send(this.getSubString());
            }
        } else {
            this.connection = new WebSocket(atob("d3NzOi8vc3RyZWFtZXIuZmluYW5jZS55YWhvby5jb20v"));
            this.connection.onopen = () => {
                this.isOpen = true;
                if (this.hasSubs()) {
                    this.connection!.send(this.getSubString());
                }
            }
            this.connection.onmessage = this.onmessage;
        }
        return this.connection;
    }
    onmessage = (event: any) => {
        try {
            const messageData = event.data;
            const data: any = this.Yaticker?.decode(
                new Uint8Array(
                    atob(messageData)
                        .split("")
                        .map((c) => c.charCodeAt(0)),
                ),
            );
            this.data.store('YA', data.id, data);
            console.log('tick data:', data);
        } catch (e) {
            console.log(e)
        }
    }
    addSubs(subs: string[]) {
        for(let symbol of subs) {
            this.tickers.add(symbol);
        }
        if (this.hasSubs()) {
            this.updateSubs();
        }
    }
}