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
    sheet = new Sheet(wrapper,
        Object.assign(
            {},
            demo,
            {
                // gridlinesOn: false,
                autosizeHeight: true,
                autosizeWidth: true,
                toolbar: true,
                formulaBar: true,
                cellHeaders: true,
                isEditable: true,
                // drawGridlinesOverBackground: true,
                zoomLevel: 1,
                gridlinesColor: '#dddddd',
                // gridlinesColor: 'rgba(255, 0, 0, 0.1)',
                // gridlinesColor: 'red',
                // freeze: {row: 0, col: 0},
                defaultFontSize: 15,
                defaultValign: 'middle',
                defaultHorizAlign: 'center',
                // theme: {'background-color': 'red'}
                // blockRows: 5,
                // blockCols: 4,
                renderCustomCell: (cell: any, { left, top, width, height, layer, container }: any) => {
                    const button = document.createElement('button');
                    button.onclick = update;
                    button.style.zIndex = "90";
                    button.textContent = cell.text;
                    button.style.position = 'absolute';
                    sheet.setElRegistry(cell.row, cell.col, button, 'custom');
                    sheet.positionElement(button, left, top, width, height, layer);
                }
            })
    );
});
