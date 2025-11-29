import { addBorderStr, hasBorderStr } from "./utils";

export function parseXML(xml: string) {
    if (!xml) return;
    // console.log(xml)
    const d = document.createElement('div');
    d.innerHTML = xml;
    const table: any = d.querySelector('table');
    if (!table) {
        return;
    }

    // table.style.position = 'absolute';
    // table.style.background = 'white';
    // table.style.top = 0;
    // const styleEl: any = d.querySelector('style');
    // const classes = extractClassesFromStyle(styleEl);
    // console.log('got classes:', classes)
    // document.body.appendChild(table);
    document.body.appendChild(d); // append to DOM to compute <style>
    const configs = [];
    const merges = [];
    let r = 0;
    const tbody: any = d.querySelector('tbody');
    const occupied: { [row: number]: boolean[] } = {};
       const isOccupied = (row: number, col: number) => !!(occupied[row] && occupied[row][col]);
    const markOccupied = (rowStart: number, colStart: number, rowspan: number, colspan: number) => {
        for (let rr = rowStart; rr < rowStart + rowspan; rr++) {
            if (!occupied[rr]) occupied[rr] = [];
            for (let cc = colStart; cc < colStart + colspan; cc++) occupied[rr][cc] = true;
        }
    };
    for (let row of (tbody!.rows)) {
        let c = 0;
        for(let col of row.children) {
            // const s = col.style;
            // console.log('computed styles', window.getComputedStyle(col));
            while (isOccupied(r, c)) c++;
            const s = window.getComputedStyle(col);
            // console.log(Array.from(col.style));
            // for(let a of col.style) {console.log(a, s.getPropertyValue(a));}
            let top = s.getPropertyValue('border-top-width'), right = s.getPropertyValue('border-right-width'),
                bottom = s.getPropertyValue('border-bottom-width'), left = s.getPropertyValue('border-left-width');
            // console.log(col.style, top,bottom,left,right)
            let b = 0;
            if (top && top !== '0px') b = addBorderStr(b, 'top'); if (right && right !== '0px') b = addBorderStr(b, 'right');
            if (bottom && bottom !== '0px') b = addBorderStr(b, 'bottom'); if (left && left !== '0px') b = addBorderStr(b, 'left');
            const cell: any = {text: col.innerText, row: r, col: c};
            if (s.getPropertyValue('color')) cell.color = s.getPropertyValue('color');
            if (s.getPropertyValue('background-color')) cell.bc = s.getPropertyValue('background-color');
            if (s.getPropertyValue('text-align') && s.getPropertyValue('text-align') !== 'left') cell.ta = s.getPropertyValue('text-align');
            if (s.getPropertyValue('font-weight') === 'bold') cell.bold = true;
            // const rowspan = col.getAttribute('rowspan'), colspan = col.getAttribute('colspan');
            const rowspan = parseInt(col.getAttribute('rowspan') || '1', 10);
            const colspan = parseInt(col.getAttribute('colspan') || '1', 10);
            if (rowspan > 1 || colspan > 1) {
                merges.push({startRow: r, startCol: c,
                    endRow: r + parseInt(rowspan)-1, endCol: c + parseInt(colspan)-1});
                    // c+= parseInt(colspan)-1;
                    markOccupied(r, c, rowspan, colspan);
            } else {
                markOccupied(r, c, 1, 1);
            }
            if (b) cell.border = b;
            configs.push(cell);
            // console.log(col.innerText)
            c += colspan;
        }
        r++;
    }
    d.remove();
    const xmlCopyData = JSON.stringify({
        srcCell: {row: 0, col: 0},
        configs,
        merges
    });
    return xmlCopyData;
}

export function toXML(cells: any[], getMerge: Function) {
    const root = document.createElement('gigasheet-origin');
//     root.innerHTML = `
//         <style>
//         table
// 	    {
//             mso-displayed-decimal-separator:"\.";
//             mso-displayed-thousand-separator:"\,";
//         }
//         tr
//             {mso-height-source:auto;}
//         col
//             {mso-width-source:auto;}
//         td
//             {padding-top:1px;
//             padding-right:1px;
//             padding-left:1px;
//             mso-ignore:padding;
//             color:black;
//             font-size:11.0pt;
//             font-weight:400;
//             font-style:normal;
//             text-decoration:none;
//             font-family:"Aptos Narrow", sans-serif;
//             mso-font-charset:0;
//             text-align:general;
//             vertical-align:bottom;
//             border:none;
//             white-space:nowrap;
//             mso-rotate:0;}
// </style>
//     `
    const table = document.createElement('table');
    // table.appendChild(document.createElement('div'))
    root.appendChild(table);
    table.appendChild(document.createElement('div'));
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    // table.children[1].rows = [];
    const grid = cells.reduce((accum: any, cell: any) => {
        if (!accum[cell.row]) accum[cell.row] = [];
        accum[cell.row].push(cell);
        return accum;
    }, {});
    // console.log('grouped:', grid);
    for(let rowKey in grid) {
        const row = grid[rowKey];
        const tr = document.createElement('tr');
        tbody.appendChild(tr);
        for(let cell of row) {
            const td: any = document.createElement('td');
            const merge = getMerge(cell.row,cell.col);
            if (merge) {
                td.setAttribute('colspan', (merge.endCol-merge.startCol)+1);
                td.setAttribute('rowspan', (merge.endRow-merge.startRow)+1);
            }
            tr.appendChild(td);
            if (cell.color) td.style.color = cell.color;
            if (cell.bc) td.style['background-color'] = cell.bc;
            td.style['text-align'] = cell.ta || 'left';
            td.innerText = cell.text || '';
            if (hasBorderStr(cell.border, 'top')) {
                td.style['border-top-width'] = '1px';
                td.style['border-top-style'] = 'solid';
                td.style['border-top-color'] = 'rgb(0, 0, 0)';
            };
            if (hasBorderStr(cell.border, 'right')) {
                td.style['border-right-width'] = '1px';
                td.style['border-right-style'] = 'solid';
                td.style['border-right-color'] = 'rgb(0, 0, 0)';
            }
            if (hasBorderStr(cell.border, 'bottom')) {
                td.style['border-bottom-width'] = '1px';
                td.style['border-bottom-style'] = 'solid';
                td.style['border-bottom-color'] = 'rgb(0, 0, 0)';
            }
            if (hasBorderStr(cell.border, 'left')) {
                td.style['border-left-width'] = '1px';
                td.style['border-left-style'] = 'solid';
                td.style['border-left-color'] = 'rgb(0, 0, 0)';
            }
        }
    }
    // console.log(root.outerHTML)
    return root.outerHTML;
    // <tr>
    //     <td></td>
    // </tr>
}