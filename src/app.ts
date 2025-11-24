// import Giga from "./giga";
import Sheet from "./sheet";

document.addEventListener("DOMContentLoaded", (event) => {
    const wrapper = document.getElementById('grid-wrapper')!;
    const cells = [];
    for(let i = 1; i < 10; i++) {
        for(let j = 1; j < 45; j++) {
            cells.push({
                row: i,
                col: j,
                backgroundColor: 'red',
            })
        }
    }
    new Sheet(wrapper,
        {formulaBar: false, toolbar: true,
            cellHeaders: false,
            // gridlinesOn: false,
            cellHeight: 14, cellWidth: 45,
            initialCells: cells
        }
    );
});