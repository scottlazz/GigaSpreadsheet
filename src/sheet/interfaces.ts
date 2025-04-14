export interface Rect {
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
}

export interface GigaSheetTypeOptions {
    cellWidth?: number,
    cellHeight?: number,
    blockRows?: number,
    blockCols?: number,
    paddingBlocks?: number,
    heightOverrides?: any,
    widthOverrides?: any,
    gridlinesOn?: boolean,
    mergedCells?: any,
    padding?: number,
    initialCells?: any,
    subscribeFinance?: boolean,
}

export interface CellCoordsRect {
    left: number,
    top: number,
    width: number,
    height: number,
    row: number,
    col: number
}