import Sheet from ".";
import { Rect } from "./interfaces";
import { getOverlappingRect } from './utils';
export default class GridSelection {
    panes: any[];
    sheet: Sheet;
    rect: Rect;
    constructor(sheet: Sheet) {
        this.sheet = sheet;
        this.panes = [];
        this.addMain();
        this.addLeft();
        this.addTop();
        this.addCorner();
    }
    setRect(rect: Rect) {
        this.rect = rect;
    }
    addMain() {
        const el = document.createElement('div'); // main
        this.sheet.mainContainer.appendChild(el);
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
    onMouseDown = (e) => {
        e.stopPropagation();
        const coords = this.sheet.getCellFromEvent(e);
        if (coords.row < this.rect.startRow) coords.row = this.rect.startRow;
        if (coords.row > this.rect.endRow) coords.row = this.rect.endRow;
        if (coords.col < this.rect.startCol) coords.col = this.rect.startCol;
        if (coords.col > this.rect.endCol) coords.col = this.rect.endCol;
        this.sheet.createGhost(this.rect, coords);
    }
    updateDrag() {
        if (!this.panes[0].children[0]) return;
        this.addDrag(
            this.panes[0].children[0]
        );
    }
    addDrag(el) {
        const bot = document.createElement('div'); bot.onmousedown = this.onMouseDown;
        bot.className = 'dragg-border dragg-bottom';
        el.appendChild(bot);
        const left = document.createElement('div'); left.onmousedown = this.onMouseDown;
        left.className = 'dragg-border dragg-left';
        el.appendChild(left);
        const top = document.createElement('div'); top.onmousedown = this.onMouseDown;
        top.className = 'dragg-border dragg-top';
        el.appendChild(top);
        const right = document.createElement('div'); right.onmousedown = this.onMouseDown;
        right.className = 'dragg-border dragg-right';
        el.appendChild(right);
        const square = document.createElement('div'); square.onmousedown = this.onMouseDown;
        square.className = 'dragg-border dragg-square';
        el.appendChild(square);
    }
    createSelectedCell(rect, panelName='main') {
        let { startRow, startCol, endRow, endCol } = rect;
        const top = this.sheet.metrics.getHeightOffsetRelativeToPanelName(startRow, panelName); // Below header
        const height = this.sheet.metrics.getHeightBetweenRows(startRow, endRow+1);
        let left = this.sheet.metrics.getWidthOffsetRelativeToPanelName(startCol, panelName);
        let width = this.sheet.metrics.getWidthBetweenColumns(startCol, endCol+1);
        // Create selection element
        const selectedCell = document.createElement('div');
        selectedCell.className = 'selected-cell';
        selectedCell.style.left = `${left}px`;
        selectedCell.style.top = `${top}px`;
        selectedCell.style.width = `${width+1}px`;
        selectedCell.style.height = `${height+1}px`;
        return selectedCell;
    }
    appendChild(rect) {
        const fr = this.sheet.freeze.endRow, fc = this.sheet.freeze.endCol;
        const uft = rect.startRow >= fr || rect.endRow >= fr;
        const pfl = rect.startCol >= fc || rect.endCol >= fc;
        let { startRow, startCol, endRow, endCol } = rect;
        if (this.panes[0] && (
            uft && pfl
        )) {
            const selectedCell = this.createSelectedCell(rect, 'main');
            this.panes[0].appendChild(selectedCell);
        }
        if (this.panes[1] && rect.startCol < this.sheet.freeze.endCol && rect.endRow >= this.sheet.freeze.endRow) {
            const selectedCell = this.createSelectedCell(rect, 'leftpane');
            this.panes[1].appendChild(selectedCell);
        }
        if (this.panes[2] && rect.startRow < this.sheet.freeze.endRow && rect.endCol >= this.sheet.freeze.endCol) {
            const selectedCell = this.createSelectedCell(rect, 'toppane');
            this.panes[2].appendChild(selectedCell);
        };
        if (this.panes[3] && rect.startRow < this.sheet.freeze.endRow && rect.startCol < this.sheet.freeze.endCol) {
            const selectedCell = this.createSelectedCell(rect, 'cornerpane');
            this.panes[3].appendChild(selectedCell);
        };
    }
}