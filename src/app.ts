import Sheet from "./sheet";
import demo from "./demo";
import './style.css';

document.addEventListener("DOMContentLoaded", (event) => {
    const wrapper = document.getElementById('grid-wrapper')!;
    const cells: any = [];
    const registry = {};
    let sheet;
    let on = false;
    function update() {
        if (on) {
            on = false;
            clearInterval(sheet.randInterval);
        } else {
            on = true;
            sheet.intervalSetRandomData({startRow: 6, endRow: 19, startCol: 11, endCol: 24}, 300);
        }
    }
    for(let i = 0; i < 200; i++) {
        for(let j = 0; j < 200; j++) {
            cells.push({row: i, col: j, text: `[${i},${j}]`})
        }
    }
    sheet = new Sheet(wrapper,
        Object.assign(
            {},
            // cells,
            demo,
            {
                // initialCells: cells,
                // gridlinesOn: false,
                autosizeHeight: true,
                autosizeWidth: true,
                toolbar: true,
                formulaBar: true,
                cellHeaders: true,
                isEditable: true,
                // programmaticCell: (row,col) => {
                //     return {row,col,text: `${row} ${col}`}
                // },
                // drawGridlinesOverBackground: true,
                zoomLevel: 1,
                gridlinesColor: '#dddddd',
                // gridlinesColor: 'rgba(255, 0, 0, 0.1)',
                // gridlinesColor: 'red',
                freeze: {row: 5, col: 2},
                defaultFontSize: 15,
                defaultValign: 'middle',
                defaultHorizAlign: 'center',
                // theme: {'background-color': 'red'}
                // blockRows: 5,
                // blockCols: 4,
                renderCustomCell: (cell: any, { left, top, width, height, layer, container }: any) => {
                    const button = document.createElement('button');
                    // button.style.opacity = '.8'
                    button.onclick = update;
                    button.style.overflow = 'hidden';
                    button.style.zIndex = "4";
                    button.textContent = cell.text;
                    button.style.position = 'absolute';
                    sheet.setElRegistry(cell.row, cell.col, button, 'custom');
                    sheet.positionElement(button, left, top, width, height, layer);
                }
            })
    );
});
