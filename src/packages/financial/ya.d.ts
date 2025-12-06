import FinData from "./FinData";
export default class YA {
    tickers: Set<any>;
    connection: WebSocket | null;
    data: FinData;
    root: any;
    Yaticker: any;
    isOpen: boolean;
    cbs: Function[];
    constructor();
    /**
     * @returns something like '{"subscribe":["API","^GSPC","^DJI","^IXIC","^RUT","CL=F","GC=F","NVDA","GME","RKT","GAP","BLD","IBP"]}'
     */
    getSubString(): string;
    hasSubs(): boolean;
    addListener(cb: any): void;
    updateSubs(): WebSocket;
    updateListeners(data: any): void;
    onmessage: (event: any) => void;
    fetchTicker(symbol: any): Promise<void>;
    addSubs(subs: string[]): void;
}
