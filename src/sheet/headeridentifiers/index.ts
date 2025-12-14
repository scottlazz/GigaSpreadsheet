import Sheet from "..";

export default class HeaderIdentifiers {
    sheet: Sheet;
    headerContainer: HTMLElement;
    renderHeaderPadder: HTMLDivElement;
    renderHeaderElems: HTMLDivElement;
    constructor(sheet: Sheet) {
        this.sheet = sheet;
        this.headerContainer = this.sheet._container.querySelector('.header-container')!
        this.headerContainer.innerHTML = `<div class="header-cell" style="width:${this.sheet.rowNumberWidth}px;"></div>`;
        this.headerContainer.onmousedown = (e: any) => {
            if (e.button !== 0) return;
            if (e.target.getAttribute('data-col') != null) {
                this.sheet.draggingHeader = { origLeft: e.target.style.left, el: e.target, col: parseInt(e.target.getAttribute('data-col')) };
            }
        }
        if (this.sheet.options.cellHeaders !== false) {
            this.headerContainer.style.lineHeight = `${this.sheet.headerRowHeight}px`;
        }

        this.renderHeaderPadder = document.createElement('div');
        this.renderHeaderElems = document.createElement('div');
        this.renderHeaderElems.style.position = 'relative';
        this.headerContainer.appendChild(this.renderHeaderPadder);
        this.headerContainer.appendChild(this.renderHeaderElems);
    }
    renderHeaders() {
        let totalWidth = this.sheet.rowNumberWidth;
        let sc = this.sheet.visibleStartCol;
        let ec = this.sheet.visibleEndCol;
        let diff = sc % this.sheet.blockCols;
        sc = sc - diff;
        ec = ec + (this.sheet.blockCols - (ec % this.sheet.blockCols) - 1);
        this.renderHeaderPadder.style.width = `${this.sheet.metrics.getWidthOffset(sc)}px`;
        if (this.sheet.options.cellHeaders === false) {
            // let totalWidth = this.sheet.rowNumberWidth;
            // for (let col: any = 0; col <= this.sheet.totalColBounds; col++) {
            //     const width = this.sheet.metrics.getColWidth(col);
            //     totalWidth += width;
            // };
            // this.headerContainer.style.width = `${totalWidth + 10}px`;
            this.headerContainer.style.height = '1px';
            this.headerContainer.style.position = 'absolute';
            this.headerContainer.style.background = 'transparent';
            this.renderHeaderPadder.style.width = `${this.sheet.metrics.getWidthOffset(ec)}px`;
            return;
        }


        this.renderHeaderElems.innerHTML = `<div class="header-cell" style="width:${this.sheet.rowNumberWidth}px"></div>`; // empty first cell for corner
        for (let col: any = sc; col <= ec; col++) {
            const width = this.sheet.metrics.getColWidth(col);
            totalWidth += width;

            let headerCell: any;
            // if (this.renderHeaderElems.children[(((col-sc)*2) + 1)]) {
            //     headerCell = this.renderHeaderElems.children[(((col-sc)*2) + 1)];       
            //     headerCell.classList.remove('col-selected');         
            // } else {
                headerCell = document.createElement('div');
                this.renderHeaderElems.appendChild(headerCell);
                headerCell.className = 'header-cell';
            // }
            headerCell.setAttribute('data-hccol', col);
            headerCell.textContent = this.sheet.getColumnName(col);
            headerCell.style.width = `${width}px`;

            let headerHandle: any;
            // if (this.renderHeaderElems.children[(((col-sc)*2) + 2)]) {
            //     headerHandle = this.renderHeaderElems.children[(((col-sc)*2) + 2)];                
            // } else {
                headerHandle = document.createElement('div');
                this.renderHeaderElems.appendChild(headerHandle);
                headerHandle.className = 'header-handle';
                headerHandle.style.height = `${this.sheet.headerRowHeight}px`;
            // }
            headerHandle.style.left = `${totalWidth - 8}px`;
            headerHandle.setAttribute('data-col', col);
        };
        // const extra = (this.maxCols && this.totalColBounds === this.maxCols-1) ? 0 : 10;
        const extra = this.sheet.rowNumberWidth;
        this.headerContainer.style.width = `${this.sheet.metrics.getWidthOffset(ec+1) + extra}px`;
    }
}