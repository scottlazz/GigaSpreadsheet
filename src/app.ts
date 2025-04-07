import GigaSpreadsheet from "./gigaspreadsheet";

document.addEventListener("DOMContentLoaded", (event) => {
    const grid = new GigaSpreadsheet('grid-wrapper', {
        gridlinesOn: true,
        subscribeFinance: true,
        // mergedCells: [{ startRow: 1, startCol: 1, endRow: 10, endCol: 8 }],
        // initialCells: [{
        //     row: 1, col: 1, text: 'x'
        // }]
    });
});