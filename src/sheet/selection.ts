import Sheet from ".";

export default class Selection {
    panes: any[];
    sheet: Sheet;
    constructor(sheet: Sheet) {
        this.sheet = sheet;
        this.panes = [];
        this.addMain();
        this.addLeft();
        this.addTop();
        this.addCorner();
    }
    addMain() {
        const el = document.createElement('div'); // main
        this.sheet.selectionLayer.appendChild(el);
        this.panes[0] = el;
    }
    addLeft() {
        const el = document.createElement('div'); // left
        this.sheet.leftFreezeContainer.appendChild(el);
        this.panes[1] = el;
    }
    addTop() {
        const el = document.createElement('div'); // left
        this.sheet.topFreezeContainer.appendChild(el);
        this.panes[2] = el;
    }
    addCorner() {
        const el = document.createElement('div'); // left
        this.sheet.cornerFreezeContainer.appendChild(el);
        this.panes[3] = el;
    }
    remove() {
        for(let el of this.panes) {
            el?.remove();
        }
    }
    clear() {
        for(let el of this.panes) {
            el.innerHTML = '';
        }
    }
    hide() {
        for(let el of this.panes) {
            el.style.display = 'none';
        }
    }
    show() {
        for(let el of this.panes) {
            el.style.display = 'block';
        }
    }
    appendChild(child, rect) {
        if (this.panes[0]) {
            const clone = child.cloneNode();
            let top = this.sheet.metrics.getHeightOffset(rect.startRow);
            if (this.sheet.freeze.row && this.sheet.options.cellHeaders === false) {
                top = top - this.sheet.metrics.getHeightOffset(this.sheet.freeze.row)-5;
            }
            clone.style.top = `${top}px`;
            this.panes[0].appendChild(clone);
        }
        if (this.panes[1]) {
            const clone = child.cloneNode();
            if (this.sheet.options.cellHeaders === false) {
                const top = this.sheet.metrics.getHeightOffset(rect.startRow);
                clone.style.top = `${top}px`;
            }
            this.panes[1].appendChild(clone);
        }
        if (this.panes[2]) {
            const clone = child.cloneNode();
            let left = this.sheet.metrics.getWidthOffset(rect.startCol)+this.sheet.rowNumberWidth;
            clone.style.left = `${left}px`;
            this.panes[2].appendChild(clone);
        };
        if (this.panes[3]) {
            const clone = child.cloneNode();
            this.panes[3].appendChild(clone);
        };
    }
}