import Sheet from "..";
import { CellCoordsRect } from "../interfaces";

export default class Metrics {
    sheet: Sheet;
    constructor(sheet: Sheet) {
        this.sheet = sheet;
    }
    getWidthBetweenColumns(col1: number, col2: number) {
        let accumulatedWidth = 0;
        for (let _col = col1; _col < col2; _col++) {
            const colWidth = this.getColWidth(_col);
            accumulatedWidth += colWidth;
        }
        return accumulatedWidth;
    }
    getMergeWidth(merge: any) {
        return this.getWidthBetweenColumns(merge.startCol, merge.endCol+1);
    }
    getMergeHeight(merge: any) {
        return this.getHeightBetweenRows(merge.startRow, merge.endRow+1);
    }
    getHeightBetweenRows(startRow: number, endRow: number) {
        if (endRow < startRow) { let tmp = endRow; endRow = startRow; startRow = tmp; }
        return this.sheet.heightAccum[endRow] - this.sheet.heightAccum[startRow];
    }
    getColWidth(col: any) {
        if (col in this.sheet.widthOverrides) return this.sheet.widthOverrides[col];
        if (col in this.sheet.maxWidthInCol && this.sheet.maxWidthInCol[col].max > this.sheet.cellWidth) return this.sheet.maxWidthInCol[col].max;
        return this.sheet.cellWidth;
    }
    getCellWidth(a: any, b: any = null) {
        let col = a;
        if (typeof b === 'number') {
            col = b;
        }
        return this.getColWidth(col);
    }
    rowHeight(row: any) {
        return this.sheet.heightOverrides[row] ?? this.sheet.cellHeight;
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
    getHeightOffset(row: number, withStickyHeader = false) {
        return this.sheet.heightAccum[row] - (withStickyHeader ? 0 : this.sheet.headerRowHeight);
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
        let left, top, width, height, value;
        if (merge) {
            left = this.getWidthOffset(merge.startCol, true);
            top = this.getHeightOffset(merge.startRow, true);
            width = this.getMergeWidth(merge);
            height = this.getMergeHeight(merge);
            row = merge.startRow, col = merge.startCol;
        } else {
            left = this.getWidthOffset(col, true);
            top = this.getHeightOffset(row, true);
            width = this.getCellWidth(row, col);
            height = this.rowHeight(row);
        }
        return { left, top, width, height, row, col };
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
        // console.log(x,y)
        x = scrollLeft;
        y = scrollTop;
        // console.log(scrollLeft,scrollTop)
        if (x < 0 || y < 0) return { row: -1, col: -1 };

        // Find column
        let col = this.bsearch(this.sheet.widthAccum, x + this.sheet.rowNumberWidth) - 1;


        // Find row
        const row = this.bsearch(this.sheet.heightAccum, y + this.sheet.headerRowHeight) - 1;

        return {
            row: Math.min(row, this.sheet.totalRowBounds - 1),
            col: Math.min(col, this.sheet.totalColBounds - 1)
        };
    }

    inVisibleBounds(row: number, col: number) {
        const { row: visStartRow, col: visStartCol } = this.getTopLeftBounds();
        const { row: visEndRow, col: visEndCol } = this.getBottomRightBounds();
        return row >= visStartCol && row <= visEndRow &&
            col >= visStartCol && col <= visEndCol;
    }

    calculateVisibleRange() {
        const { row: visStartRow, col: visStartCol } = this.getTopLeftBounds();
        const { row: visEndRow, col: visEndCol } = this.getBottomRightBounds();
        this.sheet.visibleStartRow = visStartRow;
        this.sheet.visibleStartCol = visStartCol;
        this.sheet.visibleEndRow = visEndRow;
        this.sheet.visibleEndCol = visEndCol;
        // console.log('visiblerange:', [visStartRow,visStartCol],[visEndRow,visEndCol])
    }

    getBottomRightBounds() {
        const rect = this.sheet.container.getBoundingClientRect();
        const scrollLeft = this.sheet.container.scrollLeft;
        const scrollTop = this.sheet.container.scrollTop;
        // Adjust for header and row numbers
        const x = rect.right - rect.left + scrollLeft - (this.sheet.rowNumberWidth + 8);
        const y = rect.bottom - rect.top + scrollTop - this.sheet.headerRowHeight;

        if (x < 0 || y < 0) return { row: -1, col: -1 };

        // Find column
        let col = this.bsearch(this.sheet.widthAccum, x + this.sheet.rowNumberWidth) - 1;

        // Find row
        let row = this.bsearch(this.sheet.heightAccum, y + this.sheet.headerRowHeight) - 1;

        row = Math.min(row+1, this.sheet.totalRowBounds);
        col = Math.min(col+1, this.sheet.totalColBounds);

        // if (this.maxRows) row = Math.min(row, this.maxRows);
        // if (this.maxCols) col = Math.min(col, this.maxCols);
        return {
            row,
            col
        };
    }

    bsearch(arr: any, target: number) {
        function condition(i: number) {
            return target < arr[i];
        }
        let left = 0;
        let right = arr.length - 1;

        while (left < right) {
            let mid = Math.floor(left + (right - left) / 2);
            if (condition(mid)) {
                right = mid
            } else {
                left = mid + 1;
            }
        }
        return left
    }
}