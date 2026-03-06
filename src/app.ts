// import Giga from "./giga";
import Sheet from "./sheet";
// import { Sheet } from './index';
import { fininit } from "./_sampledata";
import './style.css';

document.addEventListener("DOMContentLoaded", (event) => {
    const wrapper = document.getElementById('grid-wrapper')!;
    const cells: any = [];
    const sheet = new Sheet(wrapper,
        Object.assign(
            {},
            fininit,
            {
                // gridlinesOn: false,
                autosize: true,
                toolbar: false,
                formulaBar: false,
                cellHeaders: false,
                gridlinesColor: '#dddddd',
                // gridlinesColor: 'rgba(255, 0, 0, 0.1)',
                // gridlinesColor: 'red',
                freeze: {row: 0, col: 0},
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
