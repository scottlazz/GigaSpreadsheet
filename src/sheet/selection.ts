export default class Selection {
    panes: any[];
    sheet: any;
    constructor(sheet: any) {
        this.sheet = sheet;
        this.panes = [];
        this.addMain();
        this.addLeft();
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
    appendChild(child) {
        if (this.panes[0]) this.panes[0].appendChild(child);
        if (this.panes[1]) this.panes[1].appendChild(child.cloneNode());
    }
}