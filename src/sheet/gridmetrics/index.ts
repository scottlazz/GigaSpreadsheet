import Sheet from "..";
import { bsearch } from '../utils';
import { CellCoordsRect } from "../interfaces";

export default class Metrics {
    sheet: Sheet;
    main: MainContainerMetrics;
    left: LeftContainerMetrics;
    top: TopContainerMetrics;
    corner: CornerContainerMetrics;
    constructor(sheet: Sheet) {
        this.sheet = sheet;
        this.main = new MainContainerMetrics(sheet);
        this.left = new LeftContainerMetrics(sheet);
        this.top = new TopContainerMetrics(sheet);
        this.corner = new CornerContainerMetrics(sheet);
    }
    hasTopFreeze() {
        return !!this.sheet.freeze.endRow;
    }
    hasLeftFreeze() {
        return !!this.sheet.freeze.endCol;
    }
    hasCornerFreeze() {
        return this.hasTopFreeze() && this.hasLeftFreeze();
    }
    getWidthBetweenColumnsAccum(col1: number, col2: number) {
        let accumulatedWidth = 0;
        for (let _col = col1; _col < col2; _col++) {
            const colWidth = this.getColWidth(_col);
            accumulatedWidth += colWidth;
        }
        return accumulatedWidth;
    }
    getWidthBetweenColumns(col1: number, col2: number) {
        if (col2 < col1) { let tmp = col2; col2 = col1; col1 = tmp; }
        if (this.sheet.widthAccum[col2] == null || this.sheet.widthAccum[col1] == null) {
            return this.getWidthBetweenColumnsAccum(col1, col2);
        }
        return (this.sheet.widthAccum[col2]) - (this.sheet.widthAccum[col1]);
    }
    getMergeWidth(merge: any) {
        return this.getWidthBetweenColumns(merge.startCol, merge.endCol+1);
    }
    getMergeHeight(merge: any) {
        return this.getHeightBetweenRows(merge.startRow, merge.endRow+1);
    }
    getHeightBetweenRowsAccum(startRow: number, endRow: number) {
        let accumulatedHeight = 0;
        for (let _row = startRow; _row < endRow; _row++) {
            const rowHeight = this.rowHeight(_row);
            accumulatedHeight += rowHeight;
        }
        return accumulatedHeight;
    }
    getHeightBetweenRows(startRow: number, endRow: number) {
        if (endRow < startRow) { let tmp = endRow; endRow = startRow; startRow = tmp; }
        if (this.sheet.heightAccum[endRow] == null || this.sheet.heightAccum[startRow] == null) {
            return this.getHeightBetweenRowsAccum(startRow, endRow);
        }
        return (this.sheet.heightAccum[endRow]) - (this.sheet.heightAccum[startRow]);
    }
    getColWidth(col: any) {
        if (col in this.sheet.widthOverrides) return this.sheet.widthOverrides[col]*this.sheet.zoomLevel;
        if (col in this.sheet.maxWidthInCol && this.sheet.maxWidthInCol[col].max > this.sheet.cellWidth) return this.sheet.maxWidthInCol[col].max*this.sheet.zoomLevel;
        return this.sheet.cellWidth*this.sheet.zoomLevel;
    }
    getCellWidth(a: any, b: any = null) {
        let col = a;
        if (typeof b === 'number') {
            col = b;
        }
        return this.getColWidth(col);
    }
    rowHeight(row: any) {
        if (row in this.sheet.heightOverrides) return this.sheet.heightOverrides[row]*this.sheet.zoomLevel;
        if (row in this.sheet.maxHeightInRow && this.sheet.maxHeightInRow[row].max > this.sheet.cellHeight) return this.sheet.maxHeightInRow[row].max*this.sheet.zoomLevel;
        return this.sheet.cellHeight*this.sheet.zoomLevel;
    }
    getCellHeight(row: number, col = null) {
        return this.rowHeight(row);
    }
    getHeight(row: number, col: number | null = null) {
        return this.rowHeight(row);
    }
    getWidthOffset(col: number, withStickyLeftBar = false) {
        return this.sheet.widthAccum[col] - (withStickyLeftBar ? 0 : this.sheet.rowNumberWidth);
    }
    getWidthOffsetRelativeToPanel(col: number, withStickyLeftBar = false) {
        if (col >= this.sheet.freeze.endCol) {
            return this.sheet.widthAccum[col] - this.sheet.widthAccum[this.sheet.freeze.endCol]
        } else {
            return this.sheet.widthAccum[col] - this.sheet.widthAccum[this.sheet.freeze.startCol]
            
            // return this.sheet.widthAccum[col] - (withStickyLeftBar ? 0 : this.sheet.rowNumberWidth);
        }
    }
    getWidthOffsetRelativeToPanelName(col: number, panelName: string, withStickyLeftBar = false) {
        if (panelName === 'main' || panelName === 'toppane') {
            return this.sheet.widthAccum[col] - this.sheet.widthAccum[this.sheet.freeze.endCol];
        } else if (panelName === 'leftpane' || panelName === 'cornerpane') {
            return this.sheet.widthAccum[col] - this.sheet.widthAccum[this.sheet.freeze.startCol];
        } else { // corner
            // return this.sheet.widthAccum[col] - (withStickyLeftBar ? 0 : this.sheet.rowNumberWidth);
        }
    }
    getHeightOffsetRelativeToPanel(row: number, withStickyHeader = false) {
        if (row >= this.sheet.freeze.endRow) {
            return this.sheet.heightAccum[row] - this.sheet.heightAccum[this.sheet.freeze.endRow];
        } else {
            return this.sheet.heightAccum[row] - this.sheet.heightAccum[this.sheet.freeze.startRow];
        }
    }
    getHeightOffsetRelativeToPanelName(row: number, panelName: string, withStickyHeader = false) {
        if (panelName === 'main' || panelName === 'leftpane') {
            return this.sheet.heightAccum[row] - this.sheet.heightAccum[this.sheet.freeze.endRow];
        } else if (panelName === 'toppane' || panelName === 'cornerpane') {
            return this.sheet.heightAccum[row] - this.sheet.heightAccum[this.sheet.freeze.startRow];
        } else {
            return this.sheet.heightAccum[row] - (withStickyHeader ? 0 : this.sheet.headerRowHeight);
        }
    }
    getHeightOffset(row: number, withStickyHeader = false) {
        return this.sheet.heightAccum[row] - (withStickyHeader ? 0 : this.sheet.headerRowHeight);
    }
    getWidthOverride(col: number) {
        if (col in this.sheet.widthOverrides) return this.sheet.widthOverrides[col]*this.sheet.zoomLevel;
    }
    getHeightOverride(row: number) {
        if (row in this.sheet.heightOverrides) return this.sheet.heightOverrides[row]*this.sheet.zoomLevel;
    }
    getWidthHeight(row: number, col: number) {
        const merged = this.sheet.getMerge(row, col);
        let width, height;
        if (merged) {
            width = this.getWidthBetweenColumns(merged.startCol, merged.endCol+1), height = this.getHeightBetweenRows(merged.startRow, merged.endRow+1)
        } else {
            width = this.getCellWidth(row, col), height = this.getHeight(row, col);
        }
        return { width, height }
    }
    getCellCoordsContainer(row: number, col: number): CellCoordsRect {
        const merge = this.sheet.getMerge(row, col);
        let left, top, width, height, endRow, endCol, container, layer;
        if (merge) {
            left = this.getWidthOffsetRelativeToPanel(merge.startCol);
            top = this.getHeightOffsetRelativeToPanel(merge.startRow);
            width = this.getMergeWidth(merge);
            height = this.getMergeHeight(merge);
            row = merge.startRow, col = merge.startCol;
            endRow = merge.endRow, endCol = merge.endCol;
        } else {
            left = this.getWidthOffsetRelativeToPanel(col);
            top = this.getHeightOffsetRelativeToPanel(row);
            width = this.getCellWidth(row, col);
            height = this.rowHeight(row);
            endRow = row, endCol = col;
        }
        layer = this.sheet.getLayer(row,col);
        container = this.sheet.panes[layer];
        return { left, top, width, height, row, col, endRow, endCol, container, layer };
    }
    calculateRotatedDimensions(width, height, degrees) {
        const radians = degrees * Math.PI / 180;
        let angle = Math.abs(radians);
        if (angle >= Math.PI / 2) {
            angle = Math.PI - angle;
        }
        const newWidth = (width * Math.abs(Math.cos(angle))) + (height * Math.abs(Math.sin(angle)));
        const newHeight = (width * Math.abs(Math.sin(angle))) + (height * Math.abs(Math.cos(angle)));
        return {
            width: newWidth,
            height: newHeight
        };
    }
    getWidthBetweenColumnsWrapAccum(col1: number, col2: number) {
        let accumulatedWidth = 0;
        for (let _col = col1; _col <= col2; _col++) {
            const colWidth = this.textWrapWidth(_col);
            accumulatedWidth += colWidth;
        }
        return accumulatedWidth;
    }
    calcTextWrapWidth(cell) {
        const col = cell.col;
        const merge = this.sheet.getMerge(cell.row, cell.col);
        if (merge) {
            return this.getWidthBetweenColumnsWrapAccum(merge.startCol, merge.endCol)*this.sheet.zoomLevel;
        }
        if (col in this.sheet.widthOverrides) return this.sheet.widthOverrides[col]*this.sheet.zoomLevel;
        // return bounds.width;
        return this.sheet.cellWidth*this.sheet.zoomLevel;
    }
    textWrapWidth(col) {
        if (col in this.sheet.widthOverrides) return this.sheet.widthOverrides[col]*this.sheet.zoomLevel;
        return this.sheet.cellWidth*this.sheet.zoomLevel;
    }
    measureCell(ctx: any, cell: any) {
        if (cell.wrapText) {
            const width = this.calcTextWrapWidth(cell);
            const wm = this.measureWrapText(ctx, cell.text || '',
                width*this.sheet.effectiveDevicePixelRatio()
            )
            const scaledHeight = (wm.height+10);
            if (cell.textRot) {
                const newDims = this.calculateRotatedDimensions(width, scaledHeight, cell.textRot);
                cell._dims = {width: newDims.width, height: scaledHeight, lines: wm.lines, lineHeight: wm.lineHeight};
                return { mwidth: newDims.width, mheight: newDims.height};
            }
            cell._dims = {height: scaledHeight, lines: wm.lines, lineHeight: wm.lineHeight}
            return {mwidth: width, mheight: scaledHeight, height: wm.height};
        } else {
            const m = ctx.measureText(cell.text);
            const height = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
            const mwidth = (m.width/(this.sheet.effectiveDevicePixelRatio()*this.sheet.zoomLevel))+5;
            const mheight = ((height*1.1)/(this.sheet.effectiveDevicePixelRatio()*this.sheet.zoomLevel))+5;
            if (cell.textRot) {
                const newDims = this.calculateRotatedDimensions(mwidth, mheight, cell.textRot);
                cell._dims = {width: newDims.width, height: newDims.height};
                return {height, mwidth: newDims.width, mheight: newDims.height, m};
            } else {
                cell._dims = {width: mwidth, height: mheight};
                return {height, mwidth, mheight, m};
            }
        }
    }
    measureWrapText(ctx: any, text, maxWidth: number) {
        var words = text.split(' ');
        var line = '';
        const lines = [];
        let y = 0;
        let lineHeight;
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            if (!lineHeight) {
                lineHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                lineHeight = ((lineHeight/this.sheet.effectiveDevicePixelRatio())/this.sheet.zoomLevel)+5
            }
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        if (line) {
            lines.push(line);
            y += lineHeight;
        }
        return { height: y, lines, lineHeight: lineHeight };
    }
    getCellCoordsCanvas(row: number, col: number): CellCoordsRect {
        const block = this.sheet.getSubBlock(row, col);
        // if (!block) return null;
        const merge = this.sheet.getMerge(row, col);
        let left, top, width, height;
        if (merge) {
            const cell = this.sheet.getCellOrMerge(row,col);
        // check not in bounds
            const srcblock = this.sheet.getSubBlock(row,col);
            const mergeStartBlock = this.sheet.getSubBlock(cell.row,cell.col);
            if (srcblock !== mergeStartBlock) {
                row = merge.startRow, col = merge.startCol;
                width = this.getMergeWidth(merge);
                height = this.getMergeHeight(merge);
                const _width = this.getWidthBetweenColumns(srcblock.startCol,merge.endCol+1);
                const _height = this.getHeightBetweenRows(srcblock.startRow,merge.endRow+1);
                left = _width - this.getMergeWidth(merge);
                top = _height - this.getMergeHeight(merge);
            } else {
                left = this.getWidthBetweenColumns(block.startCol, merge.startCol);
                top = this.getHeightBetweenRows(block.startRow, merge.startRow);
                width = this.getMergeWidth(merge);
                height = this.getMergeHeight(merge);
                row = merge.startRow, col = merge.startCol;
            }
        } else {
            left = this.getWidthBetweenColumns(block.startCol, col);
            top = this.getHeightBetweenRows(block.startRow, row);
            width = this.getCellWidth(row, col);
            height = this.rowHeight(row);
        }
        return { left, top, width, height, row, col };
    }

    getTopLeftBounds() {
        const rect = this.sheet.container.getBoundingClientRect();
        const scrollLeft = this.sheet.container.scrollLeft;
        const scrollTop = this.sheet.container.scrollTop;
        // Adjust for header and row numbers
        let x = Math.max(0, (this.sheet.rowNumberWidth + 8) - scrollLeft) - rect.left + scrollLeft - this.sheet.rowNumberWidth; // 50 for row numbers
        let y = (this.sheet.headerRowHeight + 8) - rect.top + scrollTop - this.sheet.headerRowHeight;
        x = scrollLeft;
        y = scrollTop;
        if (x < 0 || y < 0) return { row: -1, col: -1 };

        y = y + this.getHeightOffset(this.sheet.freeze.startRow);
        x = x + this.getWidthOffset(this.sheet.freeze.startCol);

        // Find column
        let col = bsearch(this.sheet.widthAccum, x + this.sheet.rowNumberWidth) - 1;


        // Find row
        const row = bsearch(this.sheet.heightAccum, y + this.sheet.headerRowHeight) - 1;

        return {
            row: Math.min(row, this.sheet.totalRowBounds - 1),
            col: Math.min(col, this.sheet.totalColBounds - 1)
        };
    }

    inVisibleBounds(row: number, col: number) {
        const { row: visStartRow, col: visStartCol } = this.getTopLeftBounds();
        const { row: visEndRow, col: visEndCol } = this.getBottomRightBounds();
        return row >= visStartRow && row <= visEndRow &&
            col >= visStartCol && col <= visEndCol;
    }

    calculateVisibleRange() {
        this.main.calculateVisibleRange();
        if (this.hasLeftFreeze()) this.left.calculateVisibleRange();
        if (this.hasTopFreeze()) this.top.calculateVisibleRange();
        if (this.hasCornerFreeze()) this.corner.calculateVisibleRange();
        // const { row: visStartRow, col: visStartCol } = this.getTopLeftBounds();
        // const { row: visEndRow, col: visEndCol } = this.getBottomRightBounds();
        // this.sheet.visibleStartRow = visStartRow;
        // this.sheet.visibleStartCol = visStartCol;
        // this.sheet.visibleEndRow = visEndRow;
        // this.sheet.visibleEndCol = visEndCol;
    }
    getVisibleRangeMain() {
        let { visibleStartRow, visibleStartCol, visibleEndRow, visibleEndCol} = this.sheet;
        // visibleStartRow = visibleStartRow+this.sheet.freeze.endRow;
        // visibleStartCol = visibleStartCol+this.sheet.freeze.endCol;
        // this.getHeightBetweenRows(this.sheet.freeze.startRow, this.sheet.freeze.endRow)
        
        return { visibleStartRow, visibleStartCol, visibleEndRow, visibleEndCol};
    }
    getVisibleRangeTop() {
        let { visibleStartRow, visibleStartCol, visibleEndRow, visibleEndCol} = this.sheet;
        // visibleStartCol = visibleStartCol+this.sheet.freeze.endCol;
        return { visibleStartRow, visibleStartCol, visibleEndRow, visibleEndCol};
    }
    getVisibleRangeLeft() {
        let { visibleStartRow, visibleStartCol, visibleEndRow, visibleEndCol} = this.sheet;
        // visibleStartRow = visibleStartRow+this.sheet.freeze.endRow;
        return { visibleStartRow, visibleStartCol, visibleEndRow, visibleEndCol};
    }

    getBottomRightBounds() {
        const rect = this.sheet.container.getBoundingClientRect();
        const scrollLeft = this.sheet.container.scrollLeft;
        const scrollTop = this.sheet.container.scrollTop;
        // Adjust for header and row numbers
        let x = rect.right - rect.left + scrollLeft - (this.sheet.rowNumberWidth + 8);
        let y = rect.bottom - rect.top + scrollTop - this.sheet.headerRowHeight;

        if (x < 0 || y < 0) return { row: -1, col: -1 };

        y = y + this.getHeightOffset(this.sheet.freeze.startRow);
        x = x + this.getWidthOffset(this.sheet.freeze.startCol);

        // Find column
        let col = bsearch(this.sheet.widthAccum, x + this.sheet.rowNumberWidth) - 1;

        // Find row
        let row = bsearch(this.sheet.heightAccum, y + this.sheet.headerRowHeight) - 1;

        row = Math.min(row+1, this.sheet.totalRowBounds);
        col = Math.min(col+1, this.sheet.totalColBounds);

        return {
            row,
            col
        };
    }
}

export class ContainerMetrics {
    visibleStartRow: number;
    visibleStartCol: number;
    visibleEndRow: number;
    visibleEndCol: number;
    sheet: Sheet;
    constructor(sheet: Sheet) {
        this.sheet = sheet;
    }
    calculateVisibleRange() {
        const { row: visStartRow, col: visStartCol } = this.getTopLeftBounds('main');
        const { row: visEndRow, col: visEndCol } = this.getBottomRightBounds('main');
        this.visibleStartRow = visStartRow;
        this.visibleStartCol = visStartCol;
        this.visibleEndRow = visEndRow;
        this.visibleEndCol = visEndCol;
    }
    getVisibleRange() {
        let { visibleStartRow, visibleStartCol, visibleEndRow, visibleEndCol} = this;
        return { visibleStartRow, visibleStartCol, visibleEndRow, visibleEndCol};
    }
    getTopLeftBounds(pane) {
        const rect = this.sheet.container.getBoundingClientRect();
        const scrollLeft = this.sheet.container.scrollLeft;
        const scrollTop = this.sheet.container.scrollTop;
        // Adjust for header and row numbers
        let x = Math.max(0, (this.sheet.rowNumberWidth + 8) - scrollLeft) - rect.left + scrollLeft - this.sheet.rowNumberWidth; // 50 for row numbers
        let y = (this.sheet.headerRowHeight + 8) - rect.top + scrollTop - this.sheet.headerRowHeight;
        x = scrollLeft;
        y = scrollTop;
        if (x < 0 || y < 0) return { row: -1, col: -1 };

        if (pane === 'main') {
            y = y + this.sheet.metrics.getHeightOffset(this.sheet.freeze.endRow);
            x = x + this.sheet.metrics.getWidthOffset(this.sheet.freeze.endCol);
        } else if (pane === 'leftpane') {
            y = y + this.sheet.metrics.getHeightOffset(this.sheet.freeze.endRow);
            x = this.sheet.metrics.getWidthOffset(this.sheet.freeze.startCol);
        } else if (pane === 'toppane') {
            y = this.sheet.metrics.getHeightOffset(this.sheet.freeze.startRow);
            x = x + this.sheet.metrics.getWidthOffset(this.sheet.freeze.endCol);
        } else if (pane === 'cornerpane') {
            y = this.sheet.metrics.getHeightOffset(this.sheet.freeze.startRow);
            x = this.sheet.metrics.getWidthOffset(this.sheet.freeze.startCol);
        }

        // Find column
        let col = bsearch(this.sheet.widthAccum, x + this.sheet.rowNumberWidth) - 1;


        // Find row
        const row = bsearch(this.sheet.heightAccum, y + this.sheet.headerRowHeight) - 1;

        return {
            row: Math.min(row, this.sheet.totalRowBounds - 1),
            col: Math.min(col, this.sheet.totalColBounds - 1)
        };
    }
    getBottomRightBounds(pane) {
        const rect = this.sheet.container.getBoundingClientRect();
        const scrollLeft = this.sheet.container.scrollLeft;
        const scrollTop = this.sheet.container.scrollTop;
        // Adjust for header and row numbers
        let x = rect.right - rect.left + scrollLeft - (this.sheet.rowNumberWidth + 8);
        let y = rect.bottom - rect.top + scrollTop - this.sheet.headerRowHeight;

        if (x < 0 || y < 0) return { row: -1, col: -1 };

        if (pane === 'main') {
            y = y + this.sheet.metrics.getHeightOffset(this.sheet.freeze.startRow);
            x = x + this.sheet.metrics.getWidthOffset(this.sheet.freeze.endCol);
        } else if (pane === 'leftpane') {
            y = y + this.sheet.metrics.getHeightOffset(this.sheet.freeze.endRow);
            x = x + this.sheet.metrics.getWidthOffset(this.sheet.freeze.startCol);
            x = Math.min(x, this.sheet.metrics.getWidthOffset(this.sheet.freeze.endCol));
        } else if (pane === 'toppane') {
            y = y + this.sheet.metrics.getHeightOffset(this.sheet.freeze.startRow);
            x = x + this.sheet.metrics.getWidthOffset(this.sheet.freeze.endCol);
            y = Math.min(y, this.sheet.metrics.getHeightOffset(this.sheet.freeze.endRow));
        } else if (pane === 'cornerpane') {
            y = y + this.sheet.metrics.getHeightOffset(this.sheet.freeze.startRow);
            x = x + this.sheet.metrics.getWidthOffset(this.sheet.freeze.startCol);
            x = Math.min(x, this.sheet.metrics.getWidthOffset(this.sheet.freeze.endCol));
            y = Math.min(y, this.sheet.metrics.getHeightOffset(this.sheet.freeze.endRow));            
        }

        // Find column
        let col = bsearch(this.sheet.widthAccum, x + this.sheet.rowNumberWidth) - 1;

        // Find row
        let row = bsearch(this.sheet.heightAccum, y + this.sheet.headerRowHeight) - 1;

        row = Math.min(row+1, this.sheet.totalRowBounds);
        col = Math.min(col+1, this.sheet.totalColBounds);

        return {
            row,
            col
        };
    }
}
export class MainContainerMetrics extends ContainerMetrics {
    getTopLeftBounds() {
        return super.getTopLeftBounds('main');
    }
    getBottomRightBounds() {
        return super.getBottomRightBounds('main');
    }
}
export class LeftContainerMetrics extends ContainerMetrics {
    getTopLeftBounds() {
        if (!this.sheet.metrics.hasLeftFreeze()) return null;
        return super.getTopLeftBounds('leftpane');
    }
    getBottomRightBounds() {
        if (!this.sheet.metrics.hasLeftFreeze()) return null;
        return super.getBottomRightBounds('leftpane');
    }
}
export class TopContainerMetrics extends ContainerMetrics {
    getTopLeftBounds() {
        if (!this.sheet.metrics.hasTopFreeze()) return null;
        return super.getTopLeftBounds('toppane');
    }
    getBottomRightBounds() {
        if (!this.sheet.metrics.hasTopFreeze()) return null;
        return super.getBottomRightBounds('toppane');
    }
}
export class CornerContainerMetrics extends ContainerMetrics {
    getTopLeftBounds() {
        if (!this.sheet.metrics.hasCornerFreeze()) return null;
        return super.getTopLeftBounds('cornerpane');
    }
    getBottomRightBounds() {
        if (!this.sheet.metrics.hasCornerFreeze()) return null;
        return super.getBottomRightBounds('cornerpane');
    }
}