import { addBorderStr, hasBorderStr, rgbToHex } from "./utils";

export function parseXML(xml: string) {
    if (!xml) return;
    // console.log(xml)
    const d = document.createElement('div');
    d.innerHTML = xml;
    const table: any = d.querySelector('table');
    if (!table) {
        return;
    }
    const isGs = !!d.querySelector('google-sheets-html-origin');
    const styleEl: any = d.querySelector('style');
    if (isGs && styleEl) {
        styleEl.remove();
        // console.log(styleEl)
        // const cleanedStyle = styleEl.innerHTML.replace(/<!--[\s\S]*?-->/g, "");
        // styleEl.innerHTML = cleanedStyle;
    }

    table.removeAttribute('border');
    // console.log(table)

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
            const fontEl: any = col.querySelector('font');
            const fontElColor = fontEl?.getAttribute('color');
            const color = fontElColor || s.getPropertyValue('color');
            if (color && color !== 'rgb(0, 0, 0)') cell.color = rgbToHex(color);
            const bc = s.getPropertyValue('background-color');
            if (bc && bc !== 'rgba(0, 0, 0, 0)') cell.bc = s.getPropertyValue('background-color');
            if (s.getPropertyValue('text-align') && s.getPropertyValue('text-align') !== 'left') cell.ta = s.getPropertyValue('text-align');
            const fw = s.getPropertyValue('font-weight');
            if (fw && (fw === 'bold' || parseInt(fw) >= 500)) cell.bold = true;
            if (s.getPropertyValue('font-style') === 'italic') cell.italic = true;
            if (s.getPropertyValue('text-decoration') === 'underline') cell.ul = true;
            const fontSize = s.getPropertyValue('font-size');
            if (fontSize && (fontSize !== '12px')) {
                const match = fontSize.match(/^\d+/);
                if (match) cell.fontSize = parseInt(match[0]);
            }
            // console.log(s.getPropertyPriority('font-family'))
            if (s.getPropertyValue('font-family')) {
                cell.ff = s.getPropertyValue('font-family');
            }
            // const rowspan = col.getAttribute('rowspan'), colspan = col.getAttribute('colspan');
            const rowspan = parseInt(col.getAttribute('rowspan') || '1', 10);
            const colspan = parseInt(col.getAttribute('colspan') || '1', 10);
            if (rowspan > 1 || colspan > 1) {
                merges.push({startRow: r, startCol: c,
                    endRow: r + rowspan-1, endCol: c + colspan-1});
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
    table.appendChild(document.createElement('col'));
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    // table.children[1].rows = [];
    const grid = cells.reduce((accum: any, cell: any) => {
        if (!accum[cell.row]) accum[cell.row] = [];
        accum[cell.row].push(cell);
        return accum;
    }, {});
    tbody.append(document.createComment('StartFragment'));
    // console.log('grouped:', grid);
    for(let rowKey in grid) {
        const row = grid[rowKey];
        const tr = document.createElement('tr');
        tbody.appendChild(tr);
        for(let cell of row) {
            const td: any = document.createElement('td');
            const fontEl: any = document.createElement('font'); // libreoffice
            td.appendChild(fontEl);
            const merge = getMerge(cell.row,cell.col);
            if (merge) {
                td.setAttribute('colspan', (merge.endCol-merge.startCol)+1);
                td.setAttribute('rowspan', (merge.endRow-merge.startRow)+1);
            }
            tr.appendChild(td);
            // const color = cell.color || '#000000';
            if (cell.color) {
                td.style.color = rgbToHex(cell.color);
                td.setAttribute('color', rgbToHex(cell.color));
                fontEl.setAttribute('color', rgbToHex(cell.color));
            }
            if (cell.bold) td.style['font-weight'] = 'bold';
            if (cell.italic) td.style['font-style'] = 'italic';
            // pt = px * (72 / 96)
            td.style['font-size'] = cell.fontSize ? `${cell.fontSize}px` : '12px';
            // td.style['font-size'] = cell.fontSize ? `${cell.fontSize*(72 / 96)}pt` : `${12*(72 / 96)}pt`;
            if (cell.ff) {
                td.style['font-family'] = cell.ff;
                fontEl.setAttribute('Face', cell.ff);
            }
            if (cell.bc) {
                td.style['background-color'] = cell.bc;
                td.setAttribute('bgcolor', rgbToHex(cell.bc));
                td.style['background'] = cell.bc;
            } // #104861;
            td.style['text-align'] = cell.ta || 'left';
            td.setAttribute('align', cell.ta || 'left');
            fontEl.innerText = cell.text || '';
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
    tbody.append(document.createComment('EndFragment'));
    // console.log(root.outerHTML);
    return root.outerHTML;
}