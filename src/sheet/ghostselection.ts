import Sheet from ".";
import { Rect } from "./interfaces";

export default class Ghost {
    sheet: Sheet;
    ghost: any;
    rect: Rect;
    lastRect: Rect|null;
    start: { row: number; col: number; };
    constructor(sheet: Sheet, rect: Rect, start: {row: number, col: number}) {
        this.sheet = sheet;
        this.rect = rect;
        this.start = start;
        this.lastRect = null;
        this.ghost = document.createElement('div');
        this.ghost.style.position = 'absolute';
        this.ghost.style.border = '2px solid rgba(26, 115, 232, .9)';
        this.sheet.container.appendChild(this.ghost);
    }
    draw(origin: {row: number, col: number}) {
        let { startRow, startCol, endRow, endCol } = this.rect;
        let dr = origin.row-this.start.row;
        let dc = origin.col-this.start.col;
        startRow += dr; startCol += dc;
        endRow += dr; endCol += dc;
        let left = this.sheet.metrics.getWidthOffset(startCol,true);
        let width = this.sheet.metrics.getWidthBetweenColumns(startCol, endCol+1);
        const top = this.sheet.metrics.getHeightOffset(startRow,true); // Below header
        const height = this.sheet.metrics.getHeightBetweenRows(startRow, endRow+1);
        this.lastRect = {startRow,startCol,endRow,endCol};
        this.ghost.style.left = `${left}px`;
        this.ghost.style.top = `${top}px`;
        this.ghost.style.width = `${width-2}px`;
        this.ghost.style.height = `${height-2}px`;
    }
}