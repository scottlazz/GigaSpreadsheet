// import Giga from "./giga";
import Sheet from "./sheet";
// import { Sheet } from './index';
import { fininit } from "./sampledata";
import './style.css';

const sample = {
    initialCells: [{
        row: 2, col: 2,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    }]
}
document.addEventListener("DOMContentLoaded", (event) => {
    const wrapper = document.getElementById('grid-wrapper')!;
    const cells: any = [];
    const sheet = new Sheet(wrapper,
        Object.assign(
            // {},
            sample,
            {
                // gridlinesOn: false,
                widthOverrides: {
                    2: 400
                },
                autosizeHeight: true,
                autosizeWidth: true,
                toolbar: true,
                formulaBar: true,
                cellHeaders: true,
                isEditable: false,
                // drawGridlinesOverBackground: true,
                zoomLevel: 1,
                gridlinesColor: '#dddddd',
                // gridlinesColor: 'rgba(255, 0, 0, 0.1)',
                // gridlinesColor: 'red',
                freeze: {row: 0, col: 0},
                defaultFontSize: 15,
                defaultValign: 'middle'
                // theme: {'background-color': 'red'}
                // blockRows: 5,
                // blockCols: 4,
            }
        , {
            // cellHeaders: true,
            // autosize: true,
            // renderCustomCell: (cell: any, { left, top, width, height }: any) => {
            //     console.log('rendering custom cell', cell, left, top, width, height);
            //     const button = document.createElement('button');
            //     button.textContent = 'Custom';
            //     button.style.position = 'absolute';
            //     sheet.setElRegistry(cell.row, cell.col, button, 'custom');
            //     sheet.positionElement(button, left, top, width, height);
            // }
        })
    );
});
