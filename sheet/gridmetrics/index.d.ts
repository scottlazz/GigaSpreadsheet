import Sheet from "..";
import { CellCoordsRect } from "../interfaces";
export default class Metrics {
    sheet: Sheet;
    constructor(sheet: Sheet);
    getWidthBetweenColumns(col1: number, col2: number): number;
    getMergeWidth(merge: any): number;
    getMergeHeight(merge: any): number;
    getHeightBetweenRows(startRow: number, endRow: number): number;
    getColWidth(col: any): number;
    getCellWidth(a: any, b?: any): number;
    rowHeight(row: any): number;
    getCellHeight(row: number, col?: any): number;
    getHeight(row: number, col?: number | null): number;
    getWidthOffset(col: number, withStickyLeftBar?: boolean): number;
    getHeightOffset(row: number, withStickyHeader?: boolean): number;
    getWidthOverride(col: number): number;
    getHeightOverride(row: number): number;
    getWidthHeight(row: number, col: number): {
        width: any;
        height: any;
    };
    getCellCoordsContainer(row: number, col: number): CellCoordsRect;
    getCellCoordsCanvas(row: number, col: number): CellCoordsRect;
    getTopLeftBounds(): {
        row: number;
        col: number;
    };
    inVisibleBounds(row: number, col: number): boolean;
    calculateVisibleRange(): void;
    getBottomRightBounds(): {
        row: number;
        col: number;
    };
    bsearch(arr: any, target: number): number;
}
