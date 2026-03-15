import Sheet from "..";


export default class RowNumbers {
    sheet: Sheet;
    rowNumberContainer: HTMLElement;
    renderRowNumberElems: HTMLDivElement;
    renderRowNumberPadder: HTMLDivElement;
    psuedoStyle: HTMLStyleElement;
    rowHeadersCorner: HTMLDivElement;
    curRange: any;
    constructor(sheet: Sheet) {
        this.sheet = sheet;
        this.rowNumberContainer = this.sheet._container.querySelector('.row-number-container')!
        this.rowHeadersCorner = this.sheet._container.querySelector('.row-headers-corner')!
        if (this.sheet.options.cellHeaders !== false) {
            this.rowNumberContainer.style.width = `${this.sheet.rowNumberWidth}px`;
        }

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
        this.psuedoStyle = document.createElement("style");
        this.psuedoStyle.innerHTML =`
            .row-handle::after {
                height: ${1/devicePixelRatio}px !important;
            }`;
        this.rowNumberContainer.appendChild(this.psuedoStyle);
    }
    toggle() {
        if (this.sheet.options.cellHeaders !== false) {
            this.rowNumberContainer.style.width = `${this.sheet.rowNumberWidth}px`;
            this.rowNumberContainer.style.lineHeight = `${this.sheet.headerRowHeight}px`;
            this.rowNumberContainer.style.position = '';
            this.rowNumberContainer.style.background = '';
        } else {
            this.rowNumberContainer.style.width = '';
            this.rowNumberContainer.style.lineHeight = '';
        }
    }
    resize() {
        this.psuedoStyle.innerHTML =`
            .row-handle::after {
                height: ${1/devicePixelRatio}px !important;
            }`;
    }
    createRowNumber(label: string) {
        const el = document.createElement('div');
        el.className = 'row-number';
        // el.textContent = label;
        el.innerHTML = `<div>${label}</div>`
        return el;
    }
    renderRowNumbers(force = true) {
        const { visibleStartRow, visibleEndRow } = this.sheet.metrics.hasLeftFreeze() ?
            this.sheet.metrics.left.getVisibleRange() : this.sheet.metrics.main.getVisibleRange();
        let sr = visibleStartRow;
        sr = Math.max(sr, this.sheet.freeze.startRow);
        if (sr === this.curRange && !force) return;
        this.curRange = sr;
        let totalHeight = 0;
        let ve = visibleEndRow;
        // let diff = sr % this.sheet.blockRows;
        // sr = sr - diff;
        // console.log('sr??', sr, ve, this.sheet.metrics.getHeightOffsetRelativeToPanel(sr))
        ve = ve + (this.sheet.blockRows - (ve % this.sheet.blockRows) - 1);
        // console.log('sr?????', sr)
        this.renderRowNumberPadder.style.height = `${this.sheet.metrics.getHeightOffsetRelativeToPanel(sr)}px`;
        if (this.sheet.options.cellHeaders === false) {
            // let totalHeight = 0;
            // for (let row: any = 0; row <= this.sheet.totalRowBounds; row++) {
                //     totalHeight += this.sheet.metrics.rowHeight(row);
                // }
                // // this.totalHeight = totalHeight;
                // this.rowNumberContainer.style.height = `${totalHeight + 20}px`;
                // this.rowNumberContainer.style.width = '1px';
                // this.rowNumberContainer.style.position = 'absolute';
                this.rowNumberContainer.style.background = 'transparent';
                this.renderRowNumberPadder.style.height = `${this.sheet.metrics.getHeightOffsetRelativeToPanel(ve)}px`;
            // this.renderRowNumberPadder.style.height = `${this.sheet.metrics.getHeightOffset(sr)}px`;
            // this.rowNumberContainer.style.height = `${this.sheet.metrics.getHeightOffset(sr)}px`;
            return;
        }
        this.rowHeadersCorner.innerHTML = '';
        const srr = this.sheet.freeze.startRow;
        let th = 0;
        for(let row: any = srr; row < this.sheet.freeze.endRow; row++) {
            const rowNumberEl: any = this.createRowNumber(row + 1);
            // rowNumberEl.textContent = row + 1;
            th += this.sheet.metrics.rowHeight(row);
            rowNumberEl.style.height = `${this.sheet.metrics.rowHeight(row)}px`;
            rowNumberEl.style.lineHeight = `${this.sheet.metrics.rowHeight(row)}px`;
            rowNumberEl.setAttribute('data-rnrow', row);
            this.rowHeadersCorner.appendChild(rowNumberEl);

            const rowNumberHandle = document.createElement('div');
            rowNumberHandle.className = 'row-handle';
            rowNumberHandle.setAttribute('data-row', row);
            rowNumberHandle.style.top = `${th - 5}px`;
            this.rowHeadersCorner.appendChild(rowNumberHandle);
        }
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
        this.rowNumberContainer.style.height = `${this.sheet.metrics.getHeightOffsetRelativeToPanel(ve+1, true) + extra}px`; // extra pixels fixes slight alignment issue on scroll
    }
}