import Sheet from "..";


export default class RowNumbers {
    sheet: Sheet;
    rowNumberContainer: HTMLElement;
    renderRowNumberElems: HTMLDivElement;
    renderRowNumberPadder: HTMLDivElement;
    constructor(sheet: Sheet) {
        this.sheet = sheet;
        this.rowNumberContainer = this.sheet._container.querySelector('.row-number-container')!
        if (this.sheet.options.cellHeaders !== false) {
            this.rowNumberContainer.style.width = `${this.sheet.rowNumberWidth}px`;
            this.rowNumberContainer.style.lineHeight = `${this.sheet.headerRowHeight}px`;
        }
        // this.rowNumberContainer = sheet.rowNumberContainer;

        this.rowNumberContainer.onmousedown = (e: any) => {
            if (e.button !== 0) return;
            if (e.target.getAttribute('data-row') != null) {
                this.sheet.draggingRow = { origTop: e.target.style.top, el: e.target, row: parseInt(e.target.getAttribute('data-row')) };
            }
        }
        this.renderRowNumberPadder = document.createElement('div');
        this.renderRowNumberElems = document.createElement('div');
        this.renderRowNumberElems.style.position = 'relative';
        this.rowNumberContainer.appendChild(this.renderRowNumberPadder);
        this.rowNumberContainer.appendChild(this.renderRowNumberElems);
    }
    createRowNumber(label: string) {
        const el = document.createElement('div');
        el.className = 'row-number';
        // el.textContent = label;
        el.innerHTML = `<div>${label}</div>`
        return el;
    }
    renderRowNumbers() {
        if (this.sheet.options.cellHeaders === false) {
            let totalHeight = 0;
            for (let row: any = 0; row <= this.sheet.totalRowBounds; row++) {
                totalHeight += this.sheet.metrics.rowHeight(row);
            }
            // this.totalHeight = totalHeight;
            this.rowNumberContainer.style.height = `${totalHeight + 20}px`;
            this.rowNumberContainer.style.width = '1px';
            this.rowNumberContainer.style.position = 'absolute';
            this.rowNumberContainer.style.background = 'transparent';
            return;
        }
        let totalHeight = 0;
        let sr = this.sheet.visibleStartRow;
        let ve = this.sheet.visibleEndRow;
        let diff = sr % this.sheet.blockRows;
        sr = sr - diff;
        ve = ve + (this.sheet.blockRows - (ve % this.sheet.blockRows) - 1);
        this.renderRowNumberPadder.style.height = `${this.sheet.metrics.getHeightOffset(sr)}px`;
        this.renderRowNumberElems.innerHTML = '';
        for (let row: any = sr; row <= ve; row++) {
            // if (row >= this.totalRows) break;

            const rowNumberEl: any = this.createRowNumber(row + 1);
            // rowNumberEl.textContent = row + 1;
            totalHeight += this.sheet.metrics.rowHeight(row);
            rowNumberEl.style.height = `${this.sheet.metrics.rowHeight(row)}px`;
            rowNumberEl.style.lineHeight = `${this.sheet.metrics.rowHeight(row)}px`;
            rowNumberEl.setAttribute('data-rnrow', row);
            this.renderRowNumberElems.appendChild(rowNumberEl);

            const rowNumberHandle = document.createElement('div');
            rowNumberHandle.className = 'row-handle';
            rowNumberHandle.setAttribute('data-row', row);
            rowNumberHandle.style.top = `${totalHeight - 5}px`;
            this.renderRowNumberElems.appendChild(rowNumberHandle);
        }
        // this.totalHeight = totalHeight;
        // const extra = (this.maxRows && this.totalRowBounds === this.maxRows-1) ? 0 : 20;
        const extra = 20;
        this.rowNumberContainer.style.height = `${this.sheet.metrics.getHeightOffset(ve+1, true) + extra}px`; // extra pixels fixes slight alignment issue on scroll
    }
}