// import Giga from "./giga";
import Sheet from "./sheet";
// import { Sheet } from './index';
import { fininit } from "./_sampledata";
import './style.css';

document.addEventListener("DOMContentLoaded", (event) => {
    const wrapper = document.getElementById('grid-wrapper')!;
    const cells: any = [];
    // for(let i = 1; i < 10; i++) {
    //     for(let j = 1; j < 45; j++) {
    //         cells.push({
    //             row: i,
    //             col: j,
    //             backgroundColor: 'red',
    //         })
    //     }
    // }
    // new Sheet(wrapper,
    //     Object.assign(fininit, {
    //         cellHeaders: true,
    //         autosize: true,
    //         renderCustomCell: (cell: any, { left, top, width, height }: any) => {
    //             console.log('rendering custom cell', cell, left, top, width, height);
    //         }
    //     })
    // );
    const sheet = new Sheet(wrapper,
        Object.assign({initialCells: [
            {
                "row": 4,
                "col": 2,
                "text": "sofr defghijefas sefia seflikei defghijefas!!!",
                "_id": 9,
                "ta": "center",
                "bc": "#ffc000",
                "renderType": "custom"
                }
            ]}, {
            cellHeaders: true,
            autosize: true,
            renderCustomCell: (cell: any, { left, top, width, height }: any) => {
                console.log('rendering custom cell', cell, left, top, width, height);
                const button = document.createElement('button');
                button.textContent = 'Custom Button';
                button.style.position = 'absolute';
                button.className = 'custom-cell-button';
                sheet.positionElement(button, left, top, width, height);
            }
        })
    );
});