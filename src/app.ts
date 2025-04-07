import GigaSpreadsheet from "./gigaspreadsheet";
declare var protobuf: any;
document.addEventListener("DOMContentLoaded", (event) => {
    const grid = new GigaSpreadsheet('grid-wrapper', {
        gridlinesOn: true,
        // mergedCells: [{ startRow: 1, startCol: 1, endRow: 10, endCol: 8 }],
        // initialCells: [{
        //     row: 1, col: 1, text: 'x'
        // }]
    });
    // const w = new WebSocket('wss://streamer.finance.yahoo.com/?version=2');
    // setTimeout(() => {
    //     w.send('{"subscribe":["API","^GSPC","^DJI","^IXIC","^RUT","CL=F","GC=F","NVDA","GME","RKT","GAP","BLD","IBP"]}');
    //     var root = protobuf.Root.fromJSON(require("./YPricingData.json"));
    //     const Yaticker = root?.lookupType("yaticker");
    //     console.log(Yaticker, 'Yaticker');
    //     w.onmessage = (event: any) => {
    //         console.log('event received', event)
    //         try {
    //             const messageData = event.data;
    //             const next: any = Yaticker?.decode(
    //                 new Uint8Array(
    //                     atob(messageData)
    //                         .split("")
    //                         .map((c) => c.charCodeAt(0)),
    //                 ),
    //             );
    //             console.log('next?', next)
    //         } catch (e) {
    //             console.log(e)
    //         }
    //     }
    // })
});