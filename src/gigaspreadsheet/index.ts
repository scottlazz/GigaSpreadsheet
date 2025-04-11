// @ts-ignore
import SparseGrid from 'packages/sparsegrid';
// @ts-ignore
import ExpressionParser from 'packages/expressionparser';
// @ts-ignore
import { launchFormatMenu } from './windows/format';
// @ts-ignore
import { createLineChart } from './graphs/linechart.js';
// @ts-ignore
import FinancialSubscriber from 'packages/financial/index';
// @ts-ignore
import { dependencyTree, tickerReg, shiftDependenciesDown, shiftDependenciesRight, shiftDependenciesUp, shiftDependenciesLeft, removeDependents } from "packages/dependencytracker";

import { hasBorderStr } from "./utils";
import { shiftTextRefs } from "./shiftops";

// "noImplicitAny": false

interface GigaSheetTypeOptions {
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
export default class GigaSpreadsheet {
    wrapper: HTMLElement;
    container: HTMLElement;
    contextMenu: HTMLElement;
    headerContainer: HTMLElement;
    rowNumberContainer: HTMLElement;
    cornerCell: HTMLElement;
    selectionLayer: HTMLElement;
    editInput: HTMLInputElement;
    lastDevicePixelRatio: number;
    lastBlockCanvases: number;
    visibleStartRow: number;
    visibleEndRow: number;
    visibleStartCol: number;
    visibleEndCol: number;
    rowNumberWidth: number;
    headerRowHeight: number;
    cellHeight: number;
    cellWidth: number;
    blockRows: number;
    blockCols: number;
    paddingBlocks: number;
    heightOverrides: any;
    widthOverrides: any;
    gridlinesOn: boolean;
    padding: number; // number of adjacent blocks to render
    readonly MAX_HISTORY_SIZE: number;

    activeBlocks: Map<any, any>;
    mergedCells: any;
    undoStack: any;
    redoStack: any;
    elRegistry: any;
    heightAccum: any;
    widthAccum: any;
    data: any;
    parser: any;
    isResizing: boolean;
    activeSelection: any;
    resizeStart: any;
    resizeInitialSize: any;
    busy: boolean;
    rqtimeout: any;

    // Selection state
    selectedCell: HTMLElement | null;
    isSelecting: boolean;
    selectionStart: {row: number, col: number} | null;
    selectionEnd: { row: number, col: number } | null;
    selectionHandle: HTMLElement | null;
    selectedCols: Set<string|number>;
    selectedRows: Set<string|number>;

    draggingHeader: any;
    draggingRow: any;
    editingCell: any;
    selectionBoundRect: any;

    constructor(wrapperId: string, options: GigaSheetTypeOptions | any) {
        this.wrapper = document.getElementById(wrapperId) || document.createElement('div');
        const _container = document.createElement('div');
        _container.style.width = '100%';
        _container.style.height = '100%';
        _container.innerHTML = `
        <div id="grid-container" class="grid-container">
            <div id="corner-cell" class="blank-corner"></div>
            <div id="header-container" class="header-container"></div>
            <div id="row-number-container" class="row-number-container"></div>
            <div id="selection-layer" class="selection-layer"></div>
        </div>
        <div id="context-menu" class="context-menu">
            <ul>
                <!-- <li id="context-cut">Cut</li> -->
                <li id="context-copy">Copy</li>
                <li id="context-paste">Paste</li>
                <li id="context-clear">Clear</li>
                <li class="separator"></li>
                <li id="context-undo">Undo</li>
                <li id="context-redo">Redo</li>
                <li class="separator"></li>
                <li id="merge-cells">Merge</li>
                <li id="unmerge-cells">Unmerge</li>
                <li id="insert-row">Insert Row</li>
                <li id="insert-col">Insert Col</li>
                <li id="delete-row">Delete Row</li>
                <li id="delete-col">Delete Col</li>
                <li class="separator"></li>
                <li id="toggle-gridlines">Toggle Gridlines</li>
            </ul>
        </div>
        `;
        this.container = _container.querySelector('.grid-container')!;
        this.wrapper.appendChild(_container);
        this.contextMenu = document.getElementById('context-menu')!;
        this.container.style.minHeight = '100%';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.position = 'relative';
        this.container.style.overflow = 'auto';
        this.container.scrollLeft = 0;
        this.container.scrollTop = 0;
        this.headerContainer = document.getElementById('header-container')!;
        this.rowNumberContainer = document.getElementById('row-number-container')!;
        this.cornerCell = document.getElementById('corner-cell')!;
        this.selectionLayer = document.getElementById('selection-layer')!;
        this.lastDevicePixelRatio = window.devicePixelRatio;
        this.lastBlockCanvases = this.blockCanvases();

        // Configuration
        this.cellWidth = options.cellWidth ?? 65;
        this.cellHeight = options.cellHeight ?? 21;
        this.blockRows = options.blockRows ?? 32;  // Max rows per canvas block
        this.blockCols = options.blockCols ?? 32;  // Max cols per canvas block
        this.paddingBlocks = options.paddingBlocks ?? 1; // Extra blocks to render around visible area
        this.padding = options.padding || 1; // number of adjacent blocks to render
        this.MAX_HISTORY_SIZE = 100;
        this.rowNumberWidth = 42;
        this.headerRowHeight = this.cellHeight || 30;
        this.headerContainer.style.height = `${this.headerRowHeight}px`;
        this.headerContainer.style.lineHeight = `${this.headerRowHeight}px`;
        this.selectionLayer.style.top = `${this.headerRowHeight}px`;
        this.selectionLayer.style.left = `${this.rowNumberWidth}px`;
        this.rowNumberContainer.style.width = `${this.rowNumberWidth}px`;
        this.rowNumberContainer.style.lineHeight = `${this.headerRowHeight}px`;
        this.cornerCell.style.width = `${this.rowNumberWidth}px`;
        this.cornerCell.style.height = `${this.headerRowHeight}px`;
        if (options.subscribeFinance) {
            this.subscribeFinance();
        }

        // State
        this.mergedCells = options.mergedCells || [];
        this.heightOverrides = this.buildOverrides(options.heightOverrides);
        this.widthOverrides = this.buildOverrides(options.widthOverrides);
        this.gridlinesOn = options.gridlinesOn ?? true;
        this.activeBlocks = new Map(); // Track active canvas blocks
        this.undoStack = [];
        this.redoStack = [];
        this.elRegistry = {};
        this.heightAccum = [];
        this.widthAccum = [];
        this.isResizing = false;
        this.resizeStart = null;
        this.resizeInitialSize = null;
        this.busy = false;

        // Selection state
        this.selectedCell = null;
        this.isSelecting = false;
        this.selectionStart = null;
        this.selectionEnd = null;
        this.selectionHandle = null;
        this.draggingHeader = null;
        this.selectedCols = new Set();
        this.selectedRows = new Set();

        // Metrics
        this.visibleStartRow = 0;
        this.visibleEndRow = 0;
        this.visibleStartCol = 0;
        this.visibleEndCol = 0;

        // Initialize
        this.initEventListeners();
        this.createSelectionHandle();
        this.addNewSelection();

        // Add edit input element
        this.editInput = document.createElement('input');
        this.editInput.className = 'cell-edit-input';
        this.editInput.style.position = 'absolute';
        this.editInput.style.display = 'none';
        this.container.appendChild(this.editInput);
        this.initRender();
        this.data = null;
        this.parser = null;
        if (!this.restoreSave()) {
            this.setData(new SparseGrid(), options.initialCells);
        }
    }

    initRender() {
        this.updateGridDimensions();
        this.renderHeaders();
        this.renderRowNumbers();
        this.updateVisibleGrid();
    }

    buildOverrides(overrides: any) {
        if (!overrides) return [];
        const _overrides: any = [];
        for (let key in overrides) {
            _overrides[key] = overrides[key];
        }
        return _overrides;
    }

    subscribeFinance() {
        const f = new FinancialSubscriber();
        f.listenYA(["API", "^GSPC", "^DJI", "^IXIC", "^RUT", "CL=F", "GC=F", "NVDA", "GME", "RKT", "GAP", "BLD", "IBP"]);
        f.onTick((data: any) => {
            const cells = tickerReg[data.id] || {};
            for (let key in cells) {
                const [row,col] = key.split(',');
                this.renderCell(row,col);
            }
            console.log('gigasheet::ontick', data)
        });
    }

    initEventListeners() {
        this.container.addEventListener('scroll', () => {
            requestAnimationFrame(() => this.handleScroll());
        });

        const resizeObserver = new ResizeObserver(() => {
            this.updateGridDimensions();
            this.updateVisibleGrid();
            this.updateSelection();
            this.updateRenderingQuality();
            this.contextMenu.style.width = `${130 * this.scaler()}px`;
            this.contextMenu.style.fontSize = `${14 * this.scaler()}px`;
        });
        resizeObserver.observe(this.container);

        // Selection event listeners
        this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        // Edit event listeners
        this.container.addEventListener('dblclick', this.handleCellDblClick.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Copy selected cells to clipboard
        document.addEventListener('copy', (e) => {
            if (this.editingCell) return;
            if (!this.selectionBoundRect) return;
            const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;

            let clipboardData = '';
            for (let row = startRow; row <= endRow; row++) {
                for (let col = startCol; col <= endCol; col++) {
                    const value = this.getCellText(row, col);
                    clipboardData += value;
                    if (col < endCol) clipboardData += '\t';
                }
                if (row < endRow) clipboardData += '\n';
            }

            e.clipboardData!.setData('text/plain', clipboardData);
            e.preventDefault();
        });

        // Show context menu on right-click
        this.container.addEventListener('contextmenu', (e) => {
            if ((e.target as HTMLElement).closest('.row-number-container')) return;
            if ((e.target as HTMLElement).closest('.header-container')) return;
            e.preventDefault(); // Prevent the default browser context menu
            const x = e.clientX;
            const y = e.clientY;
            const { row, col } = this.getCellFromEvent(e);
            this.showContextMenu(x, y, row, col);
        });
        document.getElementById('merge-cells')!.addEventListener('click', () => {
            // Trigger redo action
            this.mergeSelectedCells();
            this.hideContextMenu();
        });
        document.getElementById('unmerge-cells')!.addEventListener('click', () => {
            // Trigger redo action
            this.unmergeSelectedCells();
            this.hideContextMenu();
        });
        document.getElementById('insert-row')!.addEventListener('click', () => {
            // Trigger redo action
            this.insertRow();
            this.hideContextMenu();
        });
        document.getElementById('insert-col')!.addEventListener('click', () => {
            // Trigger redo action
            this.insertCol();
            this.hideContextMenu();
        });
        document.getElementById('delete-row')!.addEventListener('click', () => {
            // Trigger redo action
            this.deleteRow();
            this.hideContextMenu();
        });
        document.getElementById('delete-col')!.addEventListener('click', () => {
            // Trigger redo action
            this.deleteCol();
            this.hideContextMenu();
        });
        document.getElementById('toggle-gridlines')!.addEventListener('click', () => {
            this.toggleGridlines();
            this.hideContextMenu();
        });
        document.getElementById('context-copy')!.addEventListener('click', () => {
            // Trigger copy action
            document.execCommand('copy');
            this.hideContextMenu();
        });
        document.getElementById('context-paste')!.addEventListener('click', async () => {
            try {
                // Read text from the clipboard
                const clipboardText = await navigator.clipboard.readText();
                this.handlePaste(clipboardText);
            } catch (error) {
                console.error('Failed to read from clipboard:', error);
                // alert('Failed to paste data. Please ensure clipboard access is allowed.');
            }
            this.hideContextMenu();
        });
        document.getElementById('context-clear')!.addEventListener('click', () => {
            // Trigger clear action
            this.clearSelectedCells();
            this.hideContextMenu();
        });
        document.getElementById('context-undo')!.addEventListener('click', () => {
            // Trigger undo action
            this.undo();
            this.hideContextMenu();
        });

        document.getElementById('context-redo')!.addEventListener('click', () => {
            // Trigger redo action
            this.redo();
            this.hideContextMenu();
        });
        document.addEventListener('paste', (e) => {
            if (this.editingCell) return;
            this.handlePaste(e.clipboardData!.getData('text/plain'));
            e.preventDefault();
        });
    }

    showContextMenu(x: number, y: number, row: number, col: number) {
        this.contextMenu.style.display = 'block';
        this.contextMenu.style.left = `${x}px`;
        this.contextMenu.style.top = `${y}px`;
        const rect = this.selectionBoundRect;
        if (!this.rowColInBounds(row, col, this.selectionBoundRect)) {
            this.selectCell({ row, col });
        }
    }

    deleteRow(row: any = null, record = true) {
        row = row != null ? row : this.selectionStart?.row;
        if (row == null) return;
        const cellsNeedingShift = shiftDependenciesUp(row);
        for (let [row, col] of cellsNeedingShift) {
            const newText = shiftTextRefs(this.getCellText(row, col), 'up');
            this.setText(parseInt(row), parseInt(col), newText)
        }
        const rowData = this.data.deleteRow(row);
        this.mergedCells.forEach((merge: any) => {
            if (merge.startRow >= row) {
                merge.startRow--;
                merge.endRow--;
            }
        });
        const heightOverride = this.heightOverrides[row];
        delete this.heightOverrides[row];
        this.shiftHeightOverrides(row, -1);
        this.updateHeightAccum();
        this.renderRowNumbers();
        record && this.recordChanges([{ changeKind: 'deleteEntireRow', row, rowData, heightOverride }]);
        this.forceRerender();
        this.selectionBoundRect = this.getBoundingRectCells(this.selectionBoundRect.startRow, this.selectionBoundRect.startCol, this.selectionBoundRect.endRow, this.selectionBoundRect.endCol);
        this.updateSelection();
    }

    deleteCol(col: any = null, record = true) {
        col = col != null ? col : this.selectionStart?.col;
        if (col == null) return;
        const cellsNeedingShift = shiftDependenciesLeft(col);
        for (let [row, col] of cellsNeedingShift) {
            const newText = shiftTextRefs(this.getCellText(row, col), 'left');
            this.setText(parseInt(row), parseInt(col), newText)
        }
        const colData = this.data.deleteCol(col);
        this.mergedCells.forEach((merge: any) => {
            if (merge.startCol >= col) {
                merge.startCol--;
                merge.endCol--;
            }
        });
        const widthOverride = this.widthOverrides[col];
        delete this.widthOverrides[col];
        this.shiftWidthOverrides(col, -1);
        this.updateWidthAccum();
        this.renderHeaders();
        
        record && this.recordChanges([{ changeKind: 'deleteEntireCol', col, colData, widthOverride }]);
        this.forceRerender();
        this.selectionBoundRect = this.getBoundingRectCells(this.selectionBoundRect.startRow, this.selectionBoundRect.startCol, this.selectionBoundRect.endRow, this.selectionBoundRect.endCol);
        this.updateSelection();
    }

    refToRowCol(cellRef: string) {
        // Extract the column letters and row number from the reference
        const matches = cellRef.toUpperCase().match(/^([A-Z]+)(\d+)$/);

        if (!matches) {
            throw new Error('Invalid Excel cell reference format');
        }

        const colLetters = matches[1];
        const rowNumber = parseInt(matches[2], 10);

        // Convert column letters to 0-based index (A=0, B=1, ..., Z=25, AA=26, etc.)
        let col = 0;
        for (let i = 0; i < colLetters.length; i++) {
            const charCode = colLetters.charCodeAt(i) - 65; // 'A' is 65 in ASCII
            col = col * 26 + charCode + 1;
        }
        col--; // Make it 0-based

        // Convert row number to 0-based index
        const row = rowNumber - 1;

        return { row, col };
    }

    shiftHeightOverrides(pivot: any, amount = 1) {
        if (amount === -1) {
            this.heightOverrides.splice(pivot, 1);
        } else if (amount === 1) {
            this.heightOverrides.splice(pivot, 0, undefined);
            delete this.heightOverrides[pivot];
        }
    }

    shiftWidthOverrides(pivot: any, amount = 1) {
        if (amount === -1) {
            this.widthOverrides.splice(pivot, 1);
        } else if (amount === 1) {
            this.widthOverrides.splice(pivot, 0, undefined);
            delete this.widthOverrides[pivot];
        }
    }

    insertRow(row: any = null, data = null, record = true, heightOverride = null) {
        row = row != null ? row : this.selectionStart?.row;
        if (row == null) return;
        const cellsNeedingShift = shiftDependenciesDown(row);
        for (let [row, col] of cellsNeedingShift) {
            const newText = shiftTextRefs(this.getCellText(row, col), 'down');
            this.setText(parseInt(row), parseInt(col), newText)
        }
        this.data.addRow(row, data);
        this.mergedCells.forEach((merge: any) => {
            if (merge.startRow >= row) {
                merge.startRow++;
                merge.endRow++;
            }
        });
        this.shiftHeightOverrides(row, 1);
        if (heightOverride != null) this.heightOverrides[row] = heightOverride;
        this.updateHeightAccum();
        this.renderRowNumbers();
        record && this.recordChanges([{ changeKind: 'insertEntireRow', row }]);
        this.forceRerender();
        this.selectionBoundRect = this.getBoundingRectCells(this.selectionBoundRect.startRow, this.selectionBoundRect.startCol, this.selectionBoundRect.endRow, this.selectionBoundRect.endCol);
        this.updateSelection();
    }

    insertCol(col: any = null, data = null, record = true, widthOverride = null) {
        col = col != null ? col : this.selectionStart?.col;
        if (col == null) return;
        const cellsNeedingShift = shiftDependenciesRight(col);
        for (let [row, col] of cellsNeedingShift) {
            const newText = shiftTextRefs(this.getCellText(row, col), 'right');
            console.log('old:', this.getCellText(row, col), 'newText:', newText)
            this.setText(parseInt(row), parseInt(col), newText)
        }
        this.data.addCol(col, data);
        this.mergedCells.forEach((merge: any) => {
            if (merge.startCol >= col) {
                merge.startCol++;
                merge.endCol++;
            }
        });
        this.shiftWidthOverrides(col, 1);
        if (widthOverride != null) this.widthOverrides[col] = widthOverride;
        this.updateWidthAccum();
        this.renderHeaders();
        
        record && this.recordChanges([{ changeKind: 'insertEntireCol', col }]);
        this.forceRerender();
        this.selectionBoundRect = this.getBoundingRectCells(this.selectionBoundRect.startRow, this.selectionBoundRect.startCol, this.selectionBoundRect.endRow, this.selectionBoundRect.endCol);
        this.updateSelection();
    }

    toggleGridlines() {
        this.gridlinesOn = !this.gridlinesOn;
        this.forceRerender();
    }

    scaler() {
        return (devicePixelRatio < 1 ? (1 + (1 - devicePixelRatio)) * (1 + (1 - devicePixelRatio)) : 1);
    }

    // Modify the clearSelectedCells function to record changes
    clearSelectedCells() {
        if (!this.selectionBoundRect) return;
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;

        const changes = [];
        const deletions = [];
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                const obj = { row, col, previousValue: this.getCellText(row, col), newValue: '', changeKind: 'valchange' };
                deletions.push([row, col]);
                changes.push(obj);
            }
        }
        this.data.deleteCells(deletions);
        this.recordChanges(changes);

        for (let [row, col] of deletions) {
            this.renderCell(row, col);
        }
        // this.updateVisibleGrid(true);
    }

    getColumnName(columnNumber: number) {
        let columnName = '';
        while (columnNumber >= 0) {
            const remainder = columnNumber % 26;
            columnName = String.fromCharCode(65 + remainder) + columnName;
            columnNumber = Math.floor(columnNumber / 26) - 1;

            if (columnNumber < 0) break;
        }
        return columnName;
    }

    handlePaste(text: string) {
        if (!this.selectionBoundRect) return;
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;

        const clipboardData = text;
        const rowsData = clipboardData.split('\n');
        const changes = []; // To record changes for undo/redo

        for (let i = 0; i < rowsData.length; i++) {
            const rowData = rowsData[i].split('\t');
            for (let j = 0; j < rowData.length; j++) {
                const row = startRow + i;
                const col = startCol + j;
                if (row < this.totalRows && col < this.totalCols) {
                    changes.push({
                        row,
                        col,
                        previousValue: this.getCellText(row, col),
                        newValue: rowData[j],
                        changeKind: 'valchange'
                    });
                    this.setText(row, col, rowData[j]);
                    this.renderCell(row, col);
                }
            }
        }
        // Record the changes in the undo stack
        if (changes.length > 0) {
            this.recordChanges(changes);
        }
    }

    // Function to record a change in the history
    recordChanges(changes: any) {
        // Clear redo stack when a new change is made
        this.redoStack = [];

        // Add the change to the undo stack
        this.undoStack.push(changes);

        // Limit the size of the undo stack
        if (this.undoStack.length > this.MAX_HISTORY_SIZE) {
            this.undoStack.shift(); // Remove the oldest change
        }
    }

    setWidthOverride(col: any, width: any) {
        if (width == null) {
            delete this.widthOverrides[col];
        } else {
            this.widthOverrides[col] = width;
        }
    }

    setHeightOverride(row: any, height: any) {
        if (height == null) {
            delete this.heightOverrides[row];
        } else {
            this.heightOverrides[row] = height;
        }
    }

    // Function to undo the last change
    undo() {
        if (this.undoStack.length === 0) return; // Nothing to undo

        const changes: any = this.undoStack.pop(); // Get the last change
        const redoChanges = [];
        const updatedCells = [];
        let rerender = false;
        for (const change of changes) {
            const { row, col, previousValue, changeKind } = change;
            if (changeKind === 'merge') {
                this.unmergeSelectedCells(change.bounds, false); rerender = true;
                redoChanges.push({ changeKind: 'unmerge', bounds: change.bounds });
            } else if (changeKind === 'unmerge') {
                this.mergeSelectedCells(change.bounds, false); rerender = true;
                redoChanges.push({ changeKind: 'merge', bounds: change.bounds });
            } else if (changeKind === 'deleteEntireRow') {
                this.insertRow(change.row, change.rowData, false, change.heightOverride); rerender = true;
                // this.data.addRow(change.row, change.rowData);
                redoChanges.push({ changeKind: 'deleteEntireRow', row: change.row, rowData: change.rowData, heightOverride: change.heightOverride });
            } else if (changeKind === 'deleteEntireCol') {
                this.insertCol(change.col, change.colData, false, change.widthOverride); rerender = true;
                redoChanges.push({ changeKind: 'deleteEntireCol', col: change.col, colData: change.colData, widthOverride: change.widthOverride });
            } else if (changeKind === 'insertEntireRow') {
                this.deleteRow(change.row, false); rerender = true;
                redoChanges.push({ changeKind: 'insertEntireRow', row: change.row });
            } else if (changeKind === 'insertEntireCol') {
                this.deleteCol(change.col, false); rerender = true;
                redoChanges.push({ changeKind: 'insertEntireCol', col: change.col });
            } else if (changeKind === 'widthOverrideUpdate') {
                const prev = this.widthOverrides[change.col];
                this.setWidthOverride(change.col, change.value);
                this.updateWidthAccum();
                this.renderHeaders();
                rerender = true;
                redoChanges.push({ changeKind: 'widthOverrideUpdate', col: change.col, value: prev });
            } else if (changeKind === 'heightOverrideUpdate') {
                const prev = this.heightOverrides[change.row];
                this.setHeightOverride(change.row, change.value);
                this.updateHeightAccum();
                this.renderRowNumbers();
                rerender = true;
                redoChanges.push({ changeKind: 'heightOverrideUpdate', row: change.row, value: prev });
            } else if (changeKind === 'valchange') {
                // Record the current value for redo
                redoChanges.push({ row, col, previousValue: this.getCellText(row, col), newValue: previousValue, changeKind: 'valchange' });
                // Revert the cell to its previous value
                this.setCell(row, col, 'text', previousValue);
                updatedCells.push([row, col]);
            } else {
                console.log('UNHANDLED UNDO:', changeKind)
            }
        }
        this.redoStack.push(redoChanges);

        if (rerender) {
            this.forceRerender();
        } else {
            this.rerenderCells(updatedCells);
        }
        this.updateSelection();
    }

    rerenderCells(arr: any = []) {
        for (let [row, col] of arr) {
            this.renderCell(row, col);
        }
    }

    // Function to redo the last undone change
    redo() {
        if (this.redoStack.length === 0) return; // Nothing to redo

        const changes = this.redoStack.pop(); // Get the last undone change
        const undoChanges = [];
        const updatedCells = [];
        let rerender = false;
        for (const change of changes) {
            const { row, col, newValue, previousValue, changeKind } = change;
            if (changeKind === 'unmerge') {
                this.mergeSelectedCells(change.bounds, false); rerender = true;
                undoChanges.push({ changeKind: 'merge', bounds: change.bounds });
            } else if (changeKind === 'merge') {
                this.unmergeSelectedCells(change.bounds, false); rerender = true;
                undoChanges.push({ changeKind: 'unmerge', bounds: change.bounds });
            } else if (changeKind === 'deleteEntireRow') {
                this.deleteRow(change.row, false); rerender = true;
                undoChanges.push({ changeKind: 'deleteEntireRow', row: change.row, rowData: change.rowData, heightOverride: change.heightOverride });
            } else if (changeKind === 'deleteEntireCol') {
                this.deleteCol(change.col, false); rerender = true;
                undoChanges.push({ changeKind: 'deleteEntireCol', col: change.col, colData: change.colData, widthOverride: change.widthOverride });
            } else if (changeKind === 'insertEntireRow') {
                this.insertRow(change.row, null, false); rerender = true;
                undoChanges.push({ changeKind: 'insertEntireRow', row: change.row });
            } else if (changeKind === 'insertEntireCol') {
                this.insertCol(change.col, null, false); rerender = true;
                undoChanges.push({ changeKind: 'insertEntireCol', col: change.col });
            } else if (changeKind === 'widthOverrideUpdate') {
                const prev = this.widthOverrides[change.col];
                this.setWidthOverride(change.col, change.value);
                this.updateWidthAccum();
                this.renderHeaders();
                rerender = true;
                undoChanges.push({ changeKind: 'widthOverrideUpdate', col: change.col, value: prev });
            } else if (changeKind === 'heightOverrideUpdate') {
                const prev = this.heightOverrides[change.row];
                this.setHeightOverride(change.row, change.value);
                this.updateHeightAccum();
                this.renderRowNumbers();
                rerender = true;
                undoChanges.push({ changeKind: 'heightOverrideUpdate', row: change.row, value: prev });
            } else if (changeKind === 'valchange') {
                // Record the current value for undo
                undoChanges.push({ row, col, previousValue: this.getCellText(row, col), newValue, changeKind: 'valchange' });
                // Apply the new value to the cell
                this.setCell(row, col, 'text', previousValue);
                updatedCells.push([row, col]);
            } else {
                console.log('UNHANDLED REDO:', changeKind)
            }
        }
        this.undoStack.push(undoChanges);

        if (rerender) {
            this.forceRerender();
        } else {
            this.rerenderCells(updatedCells);
        }
        this.updateSelection();
    }

    rowColInBounds(row: number, col: number, bounds: any) {
        if (bounds == null) return false;
        return (
            row <= bounds.endRow &&
            row >= bounds.startRow &&
            col <= bounds.endCol &&
            col >= bounds.startCol
        );
    }

    // Function to hide the context menu
    hideContextMenu() {
        this.contextMenu.style.display = 'none';
    }

    handleCellDblClick(e: any) {
        if (e.target === this.editInput) return;
        const { row, col } = this.getCellFromEvent(e);
        if (row === -1 || col === -1) return;
        this.startCellEdit(row, col);
    }

    openFormatMenu() {
        const { win, addListener } = launchFormatMenu();
        addListener((type: string, value: string) => {
            console.log('formatmenu', type, value)
            const selectedCells = this.getSelectedCells();
            this.setCells(selectedCells, type, value);
        });
    }

    forceRerender() {
        this.updateVisibleGrid(true);
    }

    handleKeyDown(e: any) {
        const key = e.key.toLowerCase();
        // F2 key or Enter key to start editing
        if ((key === 'f2' || e.key === 'enter') && this.selectionStart) {
            e.preventDefault();
            this.startCellEdit(this.selectionStart.row, this.selectionStart.col);
        }
        else if (key === 'f3') {
            if (this.editingCell) return;
            this.openFormatMenu();
            e.preventDefault();
        }
        // Escape key to cancel editing
        else if (key === 'escape' && this.editInput.style.display !== 'none') {
            this.cancelCellEdit();
        }
        else if (key === 'delete') {
            if (this.editingCell) return;
            this.clearSelectedCells();
        }
        else if (key === 'x' && e.ctrlKey) {
            if (this.editingCell) return;
            document.execCommand('copy');
            this.clearSelectedCells();
        }
        else if (key === 's' && e.ctrlKey) {
            if (this.editingCell) return;
            const data = this.data.save();
            const save = {
                mergedCells: this.mergedCells,
                heightOverrides: this.heightOverrides,
                widthOverrides: this.widthOverrides,
                gridlinesOn: this.gridlinesOn,
                data
            }
            // localStorage.setItem('data-save', data)
            localStorage.setItem('sheet-state', JSON.stringify(save))
            e.preventDefault();
        }
        else if (key === 'l' && e.ctrlKey) {
            if (this.editingCell) return;
            this.restoreSave();
            e.preventDefault();
        }
        else if (e.ctrlKey || e.metaKey) { // Check for Ctrl (Windows/Linux) or Cmd (Mac)
            if (this.editingCell) return;
            if (key === 'y' || (e.shiftKey && key === 'z')) {
                e.preventDefault(); // Prevent default behavior
                this.redo();
            } else if (key === 'z') {
                e.preventDefault(); // Prevent default behavior (e.g., browser undo)
                this.undo();
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            if (!this.selectionEnd || this.editingCell) return;
            e.preventDefault();
            this.handleArrowKeyDown(e);
        }
    }
    restoreSave() {
        let save: any = localStorage.getItem('sheet-state');
        if (save) {
            try {
                save = JSON.parse(save);
                if (!save) return false;
            } catch {
                return false;
            }
            this.widthOverrides = save.widthOverrides;
            this.heightOverrides = save.heightOverrides;
            this.mergedCells = save.mergedCells;
            this.gridlinesOn = save.gridlinesOn;
            const g = new SparseGrid();
            g.restore(save.data);
            this.setData(g);
            this.updateSelection();
            return true;
        }
        return false;
    }
    handleArrowKeyDown(e: any) {
        if (!this.selectionEnd || !this.selectionStart) return;
        const deltas: any = {
            'ArrowUp': [-1, 0], 'ArrowDown': [1, 0], 'ArrowLeft': [0, -1], 'ArrowRight': [0, 1]
        }
        const curMerge = this.getMerge(this.selectionEnd.row, this.selectionEnd.col);
        let row = this.selectionEnd.row + deltas[e.key][0];
        let col = this.selectionEnd.col + deltas[e.key][1];
        const merge = this.getMerge(row, col);
        if (e.shiftKey) {
            // TODO: do in less bruteforce way
            const prevRect = JSON.stringify(this.selectionBoundRect);
            if (e.key === 'ArrowUp') {
                let curRect;
                while (row > 0) {
                    curRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    row--;
                }
            }
            else if (e.key === 'ArrowDown') {
                let curRect;
                while (row < this.getTotalRows()) {
                    curRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    row++;
                }
            }
            else if (e.key === 'ArrowLeft') {
                let curRect;
                while (col > 0) {
                    curRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    col--;
                }
            }
            else if (e.key === 'ArrowRight') {
                let curRect;
                while (col < this.getTotalCols()) {
                    curRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    col++;
                }
            }
        } else if (merge && merge === curMerge) {
            if (e.key === 'ArrowUp') { row = merge.startRow - 1; }
            else if (e.key === 'ArrowDown') { row = merge.endRow + 1; }
            else if (e.key === 'ArrowLeft') { col = merge.startCol - 1; }
            else if (e.key === 'ArrowRight') { col = merge.endCol + 1; }
        }
        row = Math.max(0, row); row = Math.min(row, this.totalRowBounds-1);
        col = Math.max(0, col); col = Math.min(col, this.totalColBounds-1);
        if (e.shiftKey) this.selectionEnd = { row, col };
        this.selectCell({ row, col, continuation: e.shiftKey });
    }
    inVisibleBounds(row: number, col: number) {
        const { row: visStartRow, col: visStartCol } = this.getTopLeftBounds();
        const { row: visEndRow, col: visEndCol } = this.getBottomRightBounds();
        return row >= visStartCol && row <= visEndRow &&
            col >= visStartCol && col <= visEndCol;
    }
    scrollTo(row: number, col: number, delta: string) {
        if (row < 0 || row >= this.totalRows || col < 0 || col >= this.totalCols) return;
        const merge = this.getMerge(row, col);
        let left, top, width, height, value;
        if (merge) {
            left = this.getWidthOffset(merge.startCol, true);
            top = this.getHeightOffset(merge.startRow, true);
            width = this.getMergeWidth(merge);
            height = this.getMergeHeight(merge);
            value = this.getCellText(merge.startRow, merge.startCol);
        } else {
            left = this.getWidthOffset(col, true);
            top = this.getHeightOffset(row, true);
            width = this.getCellWidth(row, col);
            height = this.rowHeight(row);
            value = this.getCellText(row, col);
        }
        if (delta === 'ArrowUp') {
            this.container.scrollTo({
                top: top - 100,
                behavior: 'smooth'
            });

        } else if (delta === 'ArrowDown') {
            this.container.scrollTo({
                // top: top + 100,
                top,
                behavior: 'smooth'
            });
        } else if (delta == 'ArrowLeft') {
            this.container.scrollTo({
                // left: left - 100,
                left,
                behavior: 'smooth'
            });
        } else if (delta === 'ArrowRight') {
            this.container.scrollTo({
                // left: left + width,
                left: left - this.container.clientWidth - width,
                behavior: 'smooth'
            });
        }
    }
    getSelectedCells() {
        if (!this.selectionBoundRect) return [];
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
        const cells = this.data.getCells(startRow, startCol, endRow, endCol);
        return cells;
    }
    getTotalRows() {
        return this.totalRows;
    }
    getTotalCols() {
        return this.totalCols;
    }
    get totalRows() {
        return Math.max(this.data?.rowCount || 0, this.blockRows) + (this.blockRows * this.padding);
    }
    get totalCols() {
        return Math.max(this.data?.colCount || 0, this.blockCols) + (this.blockCols * this.padding);
    }
    getMerge(row: number, col: number) {
        // Check if the cell is part of a merged range
        return this.mergedCells.find((merged: any) =>
            row >= merged.startRow &&
            row <= merged.endRow &&
            col >= merged.startCol &&
            col <= merged.endCol
        );
    }

    getMergeWidth(merge: any) {
        return this.getWidthBetweenColumns(merge.startCol, merge.endCol);
    }
    getMergeHeight(merge: any) {
        return this.getHeightBetweenRows(merge.startRow, merge.endRow);
    }
    startCellEdit(row: number, col: number) {
        if (row < 0 || row >= this.totalRows || col < 0 || col >= this.totalCols) return;
        const merge = this.getMerge(row, col);
        let left, top, width, height, value;
        if (merge) {
            left = this.getWidthOffset(merge.startCol, true);
            top = this.getHeightOffset(merge.startRow, true);
            width = this.getMergeWidth(merge);
            height = this.getMergeHeight(merge);
            value = this.getCellText(merge.startRow, merge.startCol);
            row = merge.startRow, col = merge.startCol;
        } else {
            left = this.getWidthOffset(col, true);
            top = this.getHeightOffset(row, true);
            width = this.getCellWidth(row, col);
            height = this.rowHeight(row);
            value = this.getCellText(row, col);
        }

        // Set up edit input
        this.editInput.value = value;
        this.editInput.style.left = `${left}px`;
        this.editInput.style.top = `${top}px`;
        this.editInput.style.minWidth = `${width}px`;
        this.editInput.style.width = (value.length + 1) + "ch";
        this.editInput.style.height = `${height}px`;
        this.editInput.style.display = 'block';
        this.editInput.focus();

        // Store edit state
        this.editingCell = { row, col };
        this.editInput.onblur = this.finishCellEdit.bind(this);
        this.editInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                this.finishCellEdit();
            } else {
                this.editInput.style.width = (this.editInput.value.length + 1) + "ch";
            }
        };
    }

    setText(row: number, col: number, text: string) {
        this.data?.setCellProperty(row, col, 'text', text);
    }
    setCell(row: number, col: number, field: string, value: any) {
        const cell = this.getCell(row, col);
        if (!cell) return;
        cell[field] = value;
        if (!this.data.has(row, col)) {
            this.data.set(row, col, cell);
        }
    }
    setCells(cells: any, field: string, value: any) {
        for (let cell of cells) {
            this.setCell(cell.row, cell.col, field, value);
            this.renderCell(cell.row, cell.col);
        }
        if (field === 'cellType') {
            console.log('forcing rerender')
            this.forceRerender();
        }
    }
    // mergeInCell(row: number, col: number, data: any) {
    //     const cell = this.getCell(row, col);
    //     if (!cell) return;
    //     Object.assign(cell, data);
    // }
    finishCellEdit() {
        if (!this.editingCell) return;

        const { row, col } = this.editingCell;
        if (this.editInput.value === this.getCellText(row, col)) {
            this.cancelCellEdit();
            return;
        }
        this.recordChanges([{ row, col, previousValue: this.getCellText(row, col), newValue: this.editInput.value, changeKind: 'valchange' }]);
        this.setText(row, col, this.editInput.value);
        // Hide input and redraw cell
        this.cancelCellEdit();
        this.renderCell(row, col);
    }

    cancelCellEdit() {
        this.editInput.style.display = 'none';
        this.editingCell = null;
        this.editInput.onblur = null;
        this.editInput.onkeydown = null;
    }

    updateRenderingQuality() {
        if (
            this.lastBlockCanvases !== this.blockCanvases()
        ) {
            console.log("RESIZE");
            this.lastBlockCanvases = this.blockCanvases();
            this.forceRerender();
        } else if (Math.abs(window.devicePixelRatio - this.lastDevicePixelRatio) > 0.00) {
            // Only update if scale changed significantly
            this.lastDevicePixelRatio = window.devicePixelRatio;
            requestAnimationFrame(() => {
                if (this.busy) return;
                const createTimeout = () =>
                    setTimeout(() => {
                        this.busy = true;
                        this.activeBlocks.forEach(block => {
                            if (block.subBlocks.length < 2) {
                                this.renderBlock(block, true);
                            } else {
                                block.subBlocks.forEach((subBlock: any) => {
                                    this.renderBlock(subBlock, true);
                                })
                            }
                        });
                        this.busy = false;
                        this.rqtimeout = null;
                    }, 200);
                if (this.rqtimeout) clearTimeout(this.rqtimeout);
                this.rqtimeout = createTimeout();
            })
        }
    }

    createSelectionHandle() {
        this.selectionHandle = document.createElement('div');
        this.selectionHandle.className = 'selection-handle bottom-right';
        this.selectionHandle.style.display = 'none';
        this.selectionLayer.appendChild(this.selectionHandle);

        // Add drag event for the handle
        this.selectionHandle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            if (!this.selectedCell) return;
            this.isResizing = true;
            this.resizeStart = { x: e.clientX, y: e.clientY };
            this.resizeInitialSize = {
                width: this.selectedCell.offsetWidth,
                height: this.selectedCell.offsetHeight
            };
        });
    }

    handleMouseDown(e: any) { // handle dragging select cell logic
        if (e.button !== 0) return;
        if (e.target.closest('.header-cell')) return;
        if (e.target.closest('.row-number-container')) return;
        if (e.target === this.container) return;
        if (e.target === this.editInput) return;
        if (e.button === 2) return;
        if (this.draggingHeader) return;
        if (e.target !== this.contextMenu && !this.contextMenu.contains(e.target)) {
            this.hideContextMenu();
        }
        this.handleSelectionMouseDown(e);
    }

    handleSelectionMouseDown(e: any) {
        const { row, col }: {row: number, col: number} = this.getCellFromEvent(e);
        if (e.ctrlKey && this.selectionStart) { // start new selection keep old one
            this.selectionStart = null;
            this.selectionEnd = null;
            this.selectionBoundRect = null;
            this.isSelecting = true;
            this.addNewSelection();
            this.selectCell({ row, col });
        } else if (e.shiftKey && this.selectionStart) { // continue old selection
            this.isSelecting = true;
            this.selectCell({ row, col, continuation: true }); // kill old selections start new
        } else {
            this.isSelecting = true;
            this.selectCell({ row, col, clear: true });
        }
    }

    selectCell({ row, col, continuation = false, clear = false }: any) {
        if (row === -1 || col === -1) return;
        if (clear) {
            this.selectionLayer.innerHTML = '';
            this.addNewSelection();
        }
        if (!this.activeSelection) this.addNewSelection();
        if (!continuation) this.selectionStart = { row, col };
        this.selectionEnd = { row, col };
        if (!this.selectionStart) return;
        this.selectionBoundRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
        this.updateSelection();

        // this.forceRerender(); // debug purposes, remove
    }

    getCellsInRange(startRow: number, startCol: number, endRow: number, endCol: number) {
        const cells: any = [];
        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                cells.push(this.getCell(i, j));
            }
        }
        return cells;
    }

    getMergesInRange({ startRow, startCol, endRow, endCol }: { startRow: number, startCol: number, endRow: number, endCol: number }) {
        const merges = new Set();
        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                const merge = this.getMerge(i, j);
                if (merge) {
                    merges.add(merge);
                }
            }
        }
        return [...merges.values()];
    }

    normalizeCoordinates({ startRow, startCol, endRow, endCol }: { startRow: number, startCol: number, endRow: number, endCol: number }) {
        const _startRow = Math.min(startRow, endRow)
        const _endRow = Math.max(startRow, endRow);
        const _startCol = Math.min(startCol, endCol);
        const _endCol = Math.max(startCol, endCol);
        return { startRow: _startRow, startCol: _startCol, endRow: _endRow, endCol: _endCol };
    }

    getBoundingRectCells(startRow: number, startCol: number, endRow: number, endCol: number) {
        ({ startRow, startCol, endRow, endCol } = this.normalizeCoordinates({ startRow, startCol, endRow, endCol }))
        const merges: any = this.getMergesInRange({ startRow, startCol, endRow, endCol });
        if (merges.length === 0) return { startRow, startCol, endRow, endCol };
        for (const merge of merges) {
            startRow = Math.min(startRow, merge.startRow);
            startCol = Math.min(startCol, merge.startCol);
            endRow = Math.max(endRow, merge.endRow);
            endCol = Math.max(endCol, merge.endCol);
        }
        return { startRow, startCol, endRow, endCol };
    }

    handleMouseMove(e: any) {
        if (this.draggingHeader) {
            const scrollLeft = this.container.scrollLeft;
            this.draggingHeader.el.style.left = `${scrollLeft + e.clientX - 8}px`;
        } else if (this.draggingRow) {
            const scrollTop = this.container.scrollTop;
            this.draggingRow.el.style.top = `${scrollTop + e.clientY - this.headerRowHeight - 5}px`;
        } else if (this.isSelecting) {
            const { row, col } = this.getCellFromEvent(e);
            if (row !== -1 && col !== -1) {
                this.selectionEnd = { row, col };
                if (!this.selectionStart) return;
                this.selectionBoundRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                this.updateSelection();
            }
        } else if (this.isResizing) {
            const dx = e.clientX - this.resizeStart.x;
            const dy = e.clientY - this.resizeStart.y;

            const newWidth = Math.max(this.cellWidth, this.resizeInitialSize.width + dx);
            const newHeight = Math.max(this.cellHeight, this.resizeInitialSize.height + dy);

            if (!this.selectedCell) return;
            this.selectedCell.style.width = `${newWidth}px`;
            this.selectedCell.style.height = `${newHeight}px`;

            // Position the handle
            this.positionSelectionHandle();
        }
    }

    handleMouseUp(e: any) {
        if (this.isSelecting) {
            this.isSelecting = false;
            const { row, col } = this.getCellFromEvent(e);
            if (row !== -1 && col !== -1) {
                if (!this.selectionStart) return;
                this.selectionEnd = { row, col };
                const rect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                this.updateSelection();
            }
        } else if (this.isResizing) {
            this.isResizing = false;
        } else if (this.draggingHeader) {
            const col = this.draggingHeader.col;
            this.draggingHeader = null;
            const scrollLeft = this.container.scrollLeft;
            const diff = (scrollLeft + e.clientX) - this.getWidthOffset(col + 1, true);

            const prevOverride = this.widthOverrides[col];
            const change = this.widthOverrides[col] ? this.widthOverrides[col] + diff : this.getCellWidth(col) + diff;
            this.setWidthOverride(col, change);
            this.recordChanges([{ changeKind: 'widthOverrideUpdate', col, value: prevOverride }]);
            this.updateWidthAccum();
            this.renderHeaders();
            this.forceRerender();
            this.updateSelection();
            e.stopPropagation();
        } else if (this.draggingRow) {
            const row = this.draggingRow.row;
            this.draggingRow = null;
            const scrollTop = this.container.scrollTop;
            const diff = (scrollTop + e.clientY) - this.getHeightOffset(row + 1, true);
            const prevOverride = this.heightOverrides[row];
            const change = this.heightOverrides[row] ? this.heightOverrides[row] + diff : this.getCellHeight(row) + diff;
            this.setHeightOverride(row, change);
            this.recordChanges([{ changeKind: 'heightOverrideUpdate', row, value: prevOverride }]);
            this.updateHeightAccum();
            this.renderRowNumbers();
            this.forceRerender();
            this.updateSelection();
            e.stopPropagation();
        }
    }

    getColWidth(col: any) {
        return this.widthOverrides[col] ?? this.cellWidth;
    }

    getTopLeftBounds() {
        const rect = this.container.getBoundingClientRect();
        const scrollLeft = this.container.scrollLeft;
        const scrollTop = this.container.scrollTop;
        // Adjust for header and row numbers
        const x = Math.max(0, (this.rowNumberWidth + 8) - scrollLeft) - rect.left + scrollLeft - this.rowNumberWidth; // 50 for row numbers
        const y = (this.headerRowHeight + 8) - rect.top + scrollTop - this.headerRowHeight;

        if (x < 0 || y < 0) return { row: -1, col: -1 };

        // Find column
        let col = this.bsearch(this.widthAccum, x + this.rowNumberWidth) - 1;


        // Find row
        const row = this.bsearch(this.heightAccum, y + this.headerRowHeight) - 1;

        return {
            row: Math.min(row, this.totalRowBounds - 1),
            col: Math.min(col, this.totalColBounds - 1)
        };
    }

    getBottomRightBounds() {
        const rect = this.container.getBoundingClientRect();
        const scrollLeft = this.container.scrollLeft;
        const scrollTop = this.container.scrollTop;
        // Adjust for header and row numbers
        const x = rect.right - rect.left + scrollLeft - (this.rowNumberWidth + 8);
        const y = rect.bottom - rect.top + scrollTop - this.headerRowHeight;

        if (x < 0 || y < 0) return { row: -1, col: -1 };

        // Find column
        let col = this.bsearch(this.widthAccum, x + this.rowNumberWidth) - 1;

        // Find row
        const row = this.bsearch(this.heightAccum, y + this.headerRowHeight) - 1;

        return {
            row: Math.min(row, this.totalRowBounds - 1),
            col: Math.min(col, this.totalColBounds - 1)
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

    getCellFromEvent(e: any) {
        const rect = this.container.getBoundingClientRect();
        const scrollLeft = this.container.scrollLeft;
        const scrollTop = this.container.scrollTop;
        // Adjust for header and row numbers
        const x = e.clientX - rect.left + scrollLeft - this.rowNumberWidth;
        const y = e.clientY - rect.top + scrollTop - this.headerRowHeight; // 30 for header

        if (x < 0 || y < 0) return { row: -1, col: -1 };

        let col = this.bsearch(this.widthAccum, x + this.rowNumberWidth) - 1;
        let row = this.bsearch(this.heightAccum, y + this.headerRowHeight) - 1;
        return {
            row: Math.min(row, this.totalRowBounds - 1),
            col: Math.min(col, this.totalColBounds - 1)
        };
    }

    mergeSelectedCells(bounds: any = null, recordChanges = true) {
        if (!this.selectionStart || !this.selectionEnd) return;
        let sr = this.selectionStart.row, sc = this.selectionStart.col,
            er = this.selectionEnd.row, ec = this.selectionEnd.col;
        if (bounds) {
            sr = bounds.startRow, sc = bounds.startCol,
                er = bounds.endRow, ec = bounds.endCol
        }

        // Normalize selection coordinates
        const startRow = Math.min(sr, er);
        const endRow = Math.max(sr, er);
        const startCol = Math.min(sc, ec);
        const endCol = Math.max(sc, ec);

        // Check if the selected range overlaps with existing merged cells
        for (const merged of this.mergedCells) {
            if (
                startRow <= merged.endRow &&
                endRow >= merged.startRow &&
                startCol <= merged.endCol &&
                endCol >= merged.startCol
            ) {
                alert('Cannot merge cells that overlap with existing merged cells.');
                return;
            }
        }

        // Add the merged range to the list
        this.mergedCells.push({ startRow, endRow, startCol, endCol });
        recordChanges && this.recordChanges([{ changeKind: 'merge', bounds: { startRow, endRow, startCol, endCol } }]);

        recordChanges && this.forceRerender();
    }

    unmergeSelectedCells(bounds: any = null, recordChanges = true) {
        if (!this.selectionStart || !this.selectionEnd) return;
        let sr = this.selectionStart.row, sc = this.selectionStart.col,
            er = this.selectionEnd.row, ec = this.selectionEnd.col;
        if (bounds) {
            sr = bounds.startRow, sc = bounds.startCol,
                er = bounds.endRow, ec = bounds.endCol
        }

        // Normalize selection coordinates
        const startRow = Math.min(sr, er);
        const endRow = Math.max(sr, er);
        const startCol = Math.min(sc, ec);
        const endCol = Math.max(sc, ec);
        let merged;
        for (let i = 0; i < this.mergedCells.length; i++) {
            merged = this.mergedCells[i];
            if (
                startRow <= merged.endRow &&
                endRow >= merged.startRow &&
                startCol <= merged.endCol &&
                endCol >= merged.startCol
            ) {
                this.mergedCells.splice(i, 1);
            }
        }
        recordChanges && this.recordChanges([{
            changeKind: 'unmerge', bounds: { startRow: merged.startRow, endRow: merged.endRow, startCol: merged.startCol, endCol: merged.endCol }
        }])
        recordChanges && this.forceRerender();
    }

    addNewSelection() {
        const newSelection = document.createElement('div');
        this.selectionLayer.appendChild(newSelection);
        this.activeSelection = newSelection;
        return newSelection;
    }

    updateSelection() {
        if (!this.activeSelection) return;
        // Clear previous selection
        this.activeSelection.innerHTML = '';
        if (!this.selectionHandle) return;
        this.selectionHandle.style.display = 'none';

        if (!this.selectionBoundRect) return;

        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;

        let left = this.getWidthOffset(startCol);
        let width = this.getWidthBetweenColumns(startCol, endCol);

        const top = this.getHeightOffset(startRow); // Below header
        const height = this.getHeightBetweenRows(startRow, endRow);

        // Create selection element
        this.selectedCell = document.createElement('div');
        this.selectedCell.className = 'selected-cell';
        this.selectedCell.style.left = `${left}px`;
        this.selectedCell.style.top = `${top}px`;
        this.selectedCell.style.width = `${width}px`;
        this.selectedCell.style.height = `${height}px`;

        this.activeSelection.appendChild(this.selectedCell);

        // Add resize handle
        this.positionSelectionHandle();
        this.selectionHandle.style.display = 'block';

        for(let col of this.selectedCols) {
            if (col < startCol || col > endCol) {
                this.selectedCols.delete(col);
                const el: HTMLDivElement | null = this.headerContainer.querySelector(`[data-hccol='${col}']`);
                if (!el) continue;
                el.classList.remove('col-selected');
            }
        }
        for(let i = startCol; i <= endCol; i++) {
            if (i in this.selectedCols) {
                continue;
            }
            this.selectedCols.add(i);
            const el: HTMLDivElement | null = this.headerContainer.querySelector(`[data-hccol='${i}']`);
            if (!el) continue;
            el.classList.add('col-selected');
        }
        for (let row of this.selectedRows) {
            if (row < startRow || row > endRow) {
                this.selectedRows.delete(row);
                const el: HTMLDivElement | null = this.rowNumberContainer.querySelector(`[data-rnrow='${row}']`);
                if (!el) continue;
                el.classList.remove('row-selected');
            }
        }
        for (let i = startRow; i <= endRow; i++) {
            if (i in this.selectedRows) {
                continue;
            }
            this.selectedRows.add(i);
            const el: HTMLDivElement | null = this.rowNumberContainer.querySelector(`[data-rnrow='${i}']`);
            if (!el) continue;
            el.classList.add('row-selected');
        }
    }

    positionSelectionHandle() {
        if (!this.selectedCell || !this.selectionHandle) return;

        const rect = this.selectedCell.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();

        this.selectionHandle.style.left = `${rect.right - containerRect.left - 3}px`;
        this.selectionHandle.style.top = `${rect.bottom - containerRect.top - 3}px`;
    }

    setData(data: any = null, initialData: any = null) {
        data = data || new SparseGrid();
        if (initialData) {
            initialData.forEach(((cell: any) => {
                data.set(cell.row, cell.col, cell);
            }))
        }
        // for (let i = 0; i < 2000; i++) {
        //     for (let j = 0; j < 2000; j++) {
        //         data.set(i, j, { text: (Math.random() * 1000).toFixed(2), _id: uuid() })
        //     }
        // }
        this.parser = new ExpressionParser(data);
        this.data = data;

        this.updateGridDimensions();
        this.renderHeaders();
        this.renderRowNumbers();
        this.updateVisibleGrid(true);
    }

    renderHeaders() {
        this.headerContainer.innerHTML = `<div class="header-cell" style="width:${this.rowNumberWidth}px;"></div>`;
        this.headerContainer.onmousedown = (e: any) => {
            if (e.button !== 0) return;
            if (e.target.getAttribute('data-col') != null) {
                this.draggingHeader = { el: e.target, col: parseInt(e.target.getAttribute('data-col')) };
            }
        }

        // Calculate total width needed for columns
        let totalWidth = this.rowNumberWidth;
        for (let col: any = 0; col <= this.totalColBounds; col++) {
            const width = this.getColWidth(col);
            totalWidth += width;

            const headerCell = document.createElement('div');
            headerCell.className = 'header-cell';
            headerCell.setAttribute('data-hccol', col);
            headerCell.textContent = this.getColumnName(col);
            headerCell.style.width = `${width}px`;

            const headerHandle = document.createElement('div');
            headerHandle.className = 'header-handle';
            headerHandle.style.height = `${this.headerRowHeight}px`;
            headerHandle.setAttribute('data-col', col);
            headerHandle.style.left = `${totalWidth - 8}px`;

            this.headerContainer.appendChild(headerCell);
            this.headerContainer.appendChild(headerHandle);
        };

        this.headerContainer.style.width = `${totalWidth + 10}px`;
    }

    createRowNumber(label: string) {
        const el = document.createElement('div');
        el.className = 'row-number';
        // el.textContent = label;
        el.innerHTML = `<div>${label}</div>`
        return el;
    }

    renderRowNumbers() {
        this.rowNumberContainer.innerHTML = '';
        this.rowNumberContainer.onmousedown = (e: any) => {
            if (e.button !== 0) return;
            if (e.target.getAttribute('data-row') != null) {
                this.draggingRow = { el: e.target, row: parseInt(e.target.getAttribute('data-row')) };
            }
        }

        // Create or reuse row numbers for visible rows
        // let totalHeight = 0;
        let totalHeight = 0;
        for (let row: any = 0; row <= this.totalRowBounds; row++) {
            // if (row >= this.totalRows) break;

            const rowNumberEl: any = this.createRowNumber(row + 1);
            // rowNumberEl.textContent = row + 1;
            totalHeight += this.rowHeight(row);
            rowNumberEl.style.height = `${this.rowHeight(row)}px`;
            rowNumberEl.style.lineHeight = `${this.rowHeight(row)}px`;
            rowNumberEl.setAttribute('data-rnrow', row);
            this.rowNumberContainer.appendChild(rowNumberEl);

            const rowNumberHandle = document.createElement('div');
            rowNumberHandle.className = 'row-handle';
            rowNumberHandle.setAttribute('data-row', row);
            rowNumberHandle.style.top = `${totalHeight - 5}px`;
            this.rowNumberContainer.appendChild(rowNumberHandle);
        }
        // this.totalHeight = totalHeight;
        this.rowNumberContainer.style.height = `${totalHeight + 20}px`; // extra pixels fixes slight alignment issue on scroll
    }

    get totalRowBounds() {
        return this.heightAccum?.length || this.blockRows;
    }
    get totalColBounds() {
        return this.widthAccum?.length || this.blockCols;
    }
    get totalYBounds() {
        return this.heightAccum[this.heightAccum.length - 1];
    }
    get totalXBounds() {
        return this.widthAccum[this.widthAccum.length - 1];
    }

    updateHeightAccum() {
        let prevRowBounds = this.totalRowBounds;
        const oldHeight = this.heightAccum.length;
        this.heightAccum = [this.headerRowHeight];
        let heightSum = this.headerRowHeight;
        const updateVisHeight = (this.container.clientHeight + this.container.scrollTop) >= (this.container.scrollHeight - 150);
        for (let row = 0; row < oldHeight - 1 || row % this.blockRows !== 0 || row < this.totalRows || (updateVisHeight && row < (prevRowBounds + this.blockRows)); row++) {
            this.heightAccum.push(heightSum += this.heightOverrides[row] ?? this.cellHeight);
        }
    }

    updateWidthAccum() {
        let prevColBounds = this.totalColBounds;
        const oldWidth = this.widthAccum.length;
        this.widthAccum = [this.rowNumberWidth];
        let widthSum = this.rowNumberWidth;
        const updateVisWidth = (this.container.clientWidth + this.container.scrollLeft) >= (this.container.scrollWidth - 150);
        for (let col = 0; col < oldWidth - 1 || col % this.blockCols !== 0 || col < this.totalCols || (updateVisWidth && col < (prevColBounds + this.blockCols)); col++) {
            this.widthAccum.push(widthSum += this.getColWidth(col));
        }
    }

    updateGridDimensions() {
        this.updateHeightAccum();
        this.updateWidthAccum();
    }

    handleScroll() {
        const updateVisHeight = (this.container.clientHeight + this.container.scrollTop) >= (this.container.scrollHeight - 150);
        const updateVisWidth = (this.container.clientWidth + this.container.scrollLeft) >= (this.container.scrollWidth - 150);
        if (updateVisHeight || updateVisWidth) {
            console.log('SCROLL UPDATE VIS HEIGHT OR WIDTH')
            this.updateGridDimensions();
            this.renderRowNumbers();
            this.renderHeaders();
            this.forceRerender();
        } else {
            this.updateVisibleGrid();
        }
        this.updateSelection();
    }

    calculateVisibleRange() {
        const { row: visStartRow, col: visStartCol } = this.getTopLeftBounds();
        const { row: visEndRow, col: visEndCol } = this.getBottomRightBounds();
        this.visibleStartRow = visStartRow;
        this.visibleStartCol = visStartCol;
        this.visibleEndRow = visEndRow;
        this.visibleEndCol = visEndCol;
    }

    updateVisibleGrid(force = false) {

        const padding = this.padding;
        const maxBlockRows = Math.floor(this.totalRowBounds / this.blockRows);
        const maxBlockCols = Math.floor(this.totalColBounds / this.blockCols);

        this.calculateVisibleRange();

        // Determine which blocks we need to render
        const neededBlocks = new Set();
        const startBlockRow = Math.max(0, Math.floor(this.visibleStartRow / this.blockRows) - padding);
        const endBlockRow = Math.min(maxBlockRows, Math.floor((this.visibleEndRow - 1) / this.blockRows));
        const startBlockCol = Math.max(0, Math.floor(this.visibleStartCol / this.blockCols) - padding);
        const endBlockCol = Math.min(maxBlockCols, Math.floor((this.visibleEndCol - 1) / this.blockCols));

        // console.log('visible blocks', [startBlockRow, startBlockCol], 'through', [endBlockRow, endBlockCol])

        for (let blockRow = startBlockRow; blockRow <= endBlockRow; blockRow++) {
            for (let blockCol = startBlockCol; blockCol <= endBlockCol; blockCol++) {
                neededBlocks.add(`${blockRow},${blockCol}`);
            }
        }

        // Remove blocks that are no longer needed
        const toRemove: any = [];
        this.activeBlocks.forEach((block, key) => {
            if (force || !neededBlocks.has(key)) {
                toRemove.push(key);
                this.releaseBlock(block);
            }
        });

        toRemove.forEach((key: any) => this.activeBlocks.delete(key));
        // this.updatePlaceholders();

        // TODO: when zoom is >= 170%, subdivide blocks
        requestAnimationFrame(() => {
            // Add new blocks that are needed
            neededBlocks.forEach((key: any) => {
                if (!this.activeBlocks.has(key)) {
                    const [blockRow, blockCol] = key.split(',').map(Number);
                    const block = this.createBlock(blockRow, blockCol);
                } else {
                    // Ensure existing blocks are properly positioned
                    const block = this.activeBlocks.get(key);
                    this.positionBlock(block);
                }
            });
        })
    }

    blockCanvases() {
        if (devicePixelRatio >= 1.875) {
            return 4;
        } if (devicePixelRatio > 1.7) {
            return 2;
        } else {
            return 1;
        }
    }

    positionBlock(block: any) {
        // Calculate horizontal position (left)
        let left = this.rowNumberWidth; // Account for row numbers column
        for (let col = 0; col < block.startCol; col++) {
            left += this.getColWidth(col);
        }

        // Calculate vertical position (top)

        const top = this.heightAccum[block.startRow];

        block.blockContainer.style.left = `${left}px`;
        block.blockContainer.style.top = `${top}px`;
        block.blockContainer.style.display = 'block';

        // block.left = left;
    }

    positionSubBlock(block: any, i: number) {
        if (i === 0) return;

        // Calculate vertical position (top)
        if (i === 1 || i === 3) {
            block.canvas.style.left = `${block.parentBlock.subBlocks[0].width}px`;
        }
        if (i >= 2) {
            block.canvas.style.top = `${block.parentBlock.subBlocks[0].height}px`;
        }
        // block.blockContainer.style.top = `${top}px`;
        // block.blockContainer.style.display = 'block';
    }

    createBlock(blockRow: number, blockCol: number) {
        // Calculate block boundaries
        const startRow = blockRow * this.blockRows;
        // const endRow = Math.min(startRow + this.blockRows, this.totalRows);
        const endRow = Math.min(startRow + this.blockRows);
        const startCol = blockCol * this.blockCols;
        // const endCol = Math.min(startCol + this.blockCols, this.totalCols);
        const endCol = Math.min(startCol + this.blockCols);

        const blockContainer = document.createElement('div');
        blockContainer.id = `${blockRow},${blockCol}`;
        blockContainer.className = 'canvas-block-container';

        const createCanvas = (idx: number | null = null) => {
            // const canvas = this.pool.pop() || document.createElement('canvas');
            const canvas = document.createElement('canvas');
            canvas.className = 'canvas-block';
            canvas.id = `canvas-${blockRow},${blockCol}${idx != null ? '__' + idx : ''}`;
            return canvas;
        }

        const block: any = {
            startRow,
            endRow,
            startCol,
            endCol,
            blockRow,
            blockCol,
            blockContainer,
            canvas: null,
            subBlocks: []
        };
        const key = `${blockRow},${blockCol}`;
        this.activeBlocks.set(key, block);

        const subBlockTemplate = () => {
            return { startRow, startCol, endRow, endCol, canvas: createCanvas(), parentBlock: block, isSubBlock: true, index: 0 };
        }

        this.calculateBlockDimensionsContainer(block);
        this.positionBlock(block);

        // Add to DOM if not already present
        if (!blockContainer.parentNode) {
            this.container.appendChild(blockContainer);
        }
        if (this.blockCanvases() === 1) {
            block.canvas = createCanvas();
            blockContainer.appendChild(block.canvas)
            this.calculateBlockDimensions(block);
            this.renderBlock(block);
        } else {
            if (this.blockCanvases() === 2) {
                block.subBlocks.push(
                    { startRow, startCol, endRow, endCol: Math.floor((startCol + endCol) / 2), canvas: createCanvas(0), parentBlock: block, isSubBlock: true, index: 0 }, // left half
                    { startRow, startCol: Math.floor((startCol + endCol) / 2), endRow, endCol, canvas: createCanvas(1), parentBlock: block, isSubBlock: true, index: 1 }, // right half
                )
            } else { // 4
                block.subBlocks.push(
                    { startRow, startCol, endRow: Math.floor((startRow + endRow) / 2), endCol: Math.floor((startCol + endCol) / 2), canvas: createCanvas(0), parentBlock: block, isSubBlock: true, index: 0 }, // top left
                    { startRow, startCol: Math.floor((startCol + endCol) / 2), endRow: Math.floor((startRow + endRow) / 2), endCol, canvas: createCanvas(1), parentBlock: block, isSubBlock: true, index: 1 }, // top right
                    { startRow: Math.floor((startRow + endRow) / 2), startCol, endRow, endCol: Math.floor((startCol + endCol) / 2), canvas: createCanvas(2), parentBlock: block, isSubBlock: true, index: 2 }, // bottom left
                    { startRow: Math.floor((startRow + endRow) / 2), startCol: Math.floor((startCol + endCol) / 2), endRow, endCol, canvas: createCanvas(3), parentBlock: block, isSubBlock: true, index: 3 }, // bottom right
                )
            }
            for (let i = 0; i < this.blockCanvases(); i++) {
                blockContainer.appendChild(block.subBlocks[i].canvas);
                this.calculateBlockDimensions(block.subBlocks[i]);
                this.positionSubBlock(block.subBlocks[i], i);
                this.renderBlock(block.subBlocks[i]);
            }
        }

        return block;
    }

    calculateBlockDimensions(block: any) {
        const scaleFactor = this.effectiveDevicePixelRatio();
        // Calculate block width based on columns
        block.width = 0;
        for (let col = block.startCol; col < block.endCol; col++) {
            block.width += this.getColWidth(col);
        }

        // Calculate block height based on rows
        block.height = (this.heightAccum[block.endRow] - this.heightAccum[block.startRow]);

        // Set canvas dimensions
        block.canvas.width = block.width * scaleFactor;
        block.canvas.height = block.height * scaleFactor;
        block.canvas.style.width = `${block.width}px`;
        block.canvas.style.height = `${block.height}px`;

        const ctx = block.canvas.getContext('2d', { alpha: false });
        ctx.scale(scaleFactor, scaleFactor);
    }

    calculateBlockDimensionsContainer(block: any) {
        // const scaleFactor = this.effectiveDevicePixelRatio();
        // Calculate block width based on columns
        block.width = 0;
        for (let col = block.startCol; col < block.endCol; col++) {
            block.width += this.getColWidth(col);
        }

        // Calculate block height based on rows
        block.height = (this.heightAccum[block.endRow] - this.heightAccum[block.startRow]);
        // block.height = (block.endRow - block.startRow) * this.cellHeight;
        block.blockContainer.style.width = `${block.width}px`;
        block.blockContainer.style.height = `${block.height}px`;
    }

    effectiveDevicePixelRatio() {
        if (this.blockCanvases() > 2) {
            return Math.min(window.devicePixelRatio || 1, 3.6);
        }
        if (this.blockCanvases() == 2) {
            return Math.min(window.devicePixelRatio || 1, 3);
        }
        return Math.min(window.devicePixelRatio || 1, 1.4);
    }

    blockKey(block: any) {
        return `${block.blockRow},${block.blockCol}`;
    }

    rowHeight(row: any) {
        return this.heightOverrides[row] ?? this.cellHeight;
    }

    leftBlock(block: any) {
        if (block.isSubBlock) {
            if (block.index === 0) {
                const leftBlock = this.getBlock(block.parentBlock.blockRow, block.parentBlock.blockCol - 1);
                if (!leftBlock) return;
                return leftBlock.subBlocks?.[1];
            } else if (block.index === 1) {
                return block.parentBlock.subBlocks?.[0];
            } else if (block.index === 2) {
                const leftBlock = this.getBlock(block.parentBlock.blockRow, block.parentBlock.blockCol - 1);
                if (!leftBlock) return;
                return leftBlock.subBlocks?.[leftBlock.subBlocks?.length - 1];
            } else if (block.index === 3) {
                return block.parentBlock.subBlocks?.[2];
            }
            return null;
        } else {
            return this.getBlock(block.blockRow, block.blockCol - 1)
        }
    }

    blockFromRc(row: number, col: number) {
        const blockRow = Math.floor(row / 34);
        const blockCol = Math.floor(col / 34);
        const block = this.getBlock(blockRow, blockCol);
        if (!block) return null; // todo: left block might be pruned because not in view
        if (block.subBlocks.length === 0) return block;
        for (let subBlock of block.subBlocks) {
            if (row >= subBlock.startRow && row <= subBlock.endRow && col >= subBlock.startCol && col <= subBlock.endCol) {
                return subBlock;
            }
        }
        return null;
    }

    getKey(row: number, col: number) {
        return `${row},${col}`;
    }

    getWidthHeight(row: number, col: number) {
        const merged = this.getMerge(row, col);
        let width, height;
        if (merged) {
            width = this.getWidthBetweenColumns(merged.startCol, merged.endCol), height = this.getHeightBetweenRows(merged.startRow, merged.endRow)
        } else {
            width = this.getCellWidth(row, col), height = this.getHeight(row, col);
        }
        return { width, height }
    }

    // getBlock(blockRow: number, blockCol: number) {
    //     return this.activeBlocks.get(this.blockKey({ blockRow, blockCol }));
    // }

    getBlock(row: number, col: number) {
        const blockRow = Math.floor(row / this.blockRows);
        const blockCol = Math.floor(col / this.blockCols);
        const key = this.getKey(blockRow, blockCol);
        if (this.activeBlocks.has(key)) {
            return this.activeBlocks.get(key);
        }
        return null;
    }

    getBlockOrSubBlock(row: number, col: number) {
        const parentBlock = this.getBlock(row, col);
        if (!parentBlock) return null;
        if (parentBlock.subBlocks.length === 0) {
            return parentBlock;
        }
        if (parentBlock.subBlocks.length === 2) {
            let ncol = col % this.blockCols;
            const subBlockCols = Math.floor(this.blockCols / 2);
            let idx = ncol >= subBlockCols ? 1 : 0;
            return parentBlock.subBlocks[idx];
        }
        if (parentBlock.subBlocks.length === 4) {
            let ncol = col % this.blockCols;
            const subBlockCols = Math.floor(this.blockCols / 2);
            let right = ncol >= subBlockCols;

            let nrow = row % this.blockRows;
            const subBlockRows = Math.floor(this.blockRows / 2);
            let bottom = nrow >= subBlockRows;

            let i = 0;
            if (!right && !bottom) i = 0;
            else if (right && !bottom) i = 1;
            else if (!right && bottom) i = 2;
            else if (right && bottom) i = 3;

            return parentBlock.subBlocks[i];
        }
        return null;
    }

    getCellCoordsContainer(row: number, col: number) {
        const merge = this.getMerge(row, col);
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
    getCellCoordsCanvas(row: number, col: number) {
        const block = this.getBlockOrSubBlock(row, col);
        if (!block) return null;
        const merge = this.getMerge(row, col);
        let left, top, width, height, value;
        if (merge) {
            left = this.getWidthBetweenColumns(block.startCol, merge.startCol);
            top = this.getHeightBetweenRows(block.startRow, merge.startRow);
            width = this.getMergeWidth(merge);
            height = this.getMergeHeight(merge);
            row = merge.startRow, col = merge.startCol;
        } else {
            left = this.getWidthBetweenColumns(block.startCol, col - 1);
            // top = this.getHeightBetweenRows(block.startRow, row-1);
            top = this.heightAccum[row] - this.heightAccum[block.startRow]
            width = this.getCellWidth(row, col);
            height = this.rowHeight(row);
        }
        return { left, top, width, height, row, col };
    }
    renderBorders(ctx: any, row: any, col: any) {
        if (!this.getCell(row,col)?.border) return;
        const border = this.getCell(row, col)?.border;
        ctx.save();
        ctx.strokeStyle = 'red';

        // left border
        if (hasBorderStr(border, 'left')) {
            ctx.beginPath();
            ctx.moveTo(this.getWidthOffset(col), this.getHeightOffset(row));
            ctx.lineTo(this.getWidthOffset(col), this.getHeightOffset(row) + this.getCellHeight(row));
            ctx.stroke();
        }

        // top border
        if (hasBorderStr(border, 'top')) {
            ctx.beginPath();
            ctx.moveTo(this.getWidthOffset(col), this.getHeightOffset(row));
            ctx.lineTo(this.getWidthOffset(col) + this.getCellWidth(col), this.getHeightOffset(row));
            ctx.stroke();
        }

        // right border
        if (hasBorderStr(border, 'right')) {
            ctx.beginPath();
            ctx.moveTo(this.getWidthOffset(col) + this.getCellWidth(col), this.getHeightOffset(row));
            ctx.lineTo(this.getWidthOffset(col) + this.getCellWidth(col), this.getHeightOffset(row) + this.getCellHeight(row));
            ctx.stroke();
        }

        // bottom border
        if (hasBorderStr(border, 'bottom')) {
            ctx.beginPath();
            ctx.moveTo(this.getWidthOffset(col), this.getHeightOffset(row) + this.getCellHeight(row));
            ctx.lineTo(this.getWidthOffset(col) + this.getCellWidth(col), this.getHeightOffset(row) + this.getCellHeight(row));
            ctx.stroke();
        }

        ctx.restore();
    }

    renderCell(row: any, col: any) { // FIX BUG ON EDGE OF CANVAS EDIT
        if (this.getMerge(row, col)) {
            this.forceRerender();
            return;
        }
        const block = this.getBlockOrSubBlock(row, col);
        if (!block) return null;
        const { left, top, width, height }: any = this.getCellCoordsCanvas(row, col);
        const ctx = block.canvas.getContext('2d', { alpha: false });
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(left + 1, top + 1, width - 2, height - 2);
        ctx.fillStyle = '#333333';
        this.renderBorders(ctx,row,col);
        this.renderCellText(ctx, left, top, width, row, col);
        if (dependencyTree[row]?.[col]) {
            for(let childRow in dependencyTree[row][col]) {
                for (let childCol in dependencyTree[row][col][childRow]) {
                    this.renderCell(childRow, childCol)
                }
            }
        }
    }

    renderBlock(block: any, calcDimensions = false) {
        const key = `${block.blockRow},${block.blockCol}`;
        if (calcDimensions) {
            this.calculateBlockDimensions(block);
        }
        const ctx = block.canvas.getContext('2d', { alpha: false });
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, block.canvas.clientWidth, block.canvas.clientHeight);

        // Set rendering quality based on zoom
        this.applyRenderingQuality(ctx);

        // Draw cells
        let x = 0;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333333';
        // ctx.strokeStyle = '#d4d4d4';
        ctx.strokeStyle = '#d4d4d4';
        ctx.font = this.getFontString();

        ctx.translate(0.5, 0.5); // thick gridlines fix

        // draw row gridlines
        if (this.gridlinesOn && this.quality() !== 'performance') {
            for (let row = block.startRow; row < block.endRow; row++) {
                const y = this.heightAccum[row] - this.heightAccum[block.startRow];
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(block.canvas.clientWidth, y);
                ctx.stroke();
            }
        }
        // draw col grid lines
        if (this.gridlinesOn && this.quality() !== 'performance') {
            for (let col = block.startCol; col < block.endCol; col++) {
                const colWidth = this.getColWidth(col);
                // draw col gridlines
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, block.canvas.clientHeight);
                ctx.stroke();
                x += colWidth;
            }
        }
        x = 0;
        const seenMerges = new Set();
        for (let col = block.startCol; col < block.endCol; col++) {
            const colWidth = this.getColWidth(col);

            for (let row = block.startRow; row < block.endRow; row++) {
                if (!this.getCell(row, col)) continue;
                // Check if the cell is part of a merged range
                const merged = this.getMerge(row, col);
                const y = this.heightAccum[row] - this.heightAccum[block.startRow];

                // Skip rendering if the cell is part of a merged range (except the top-left cell)
                if (merged && row === merged.startRow && col === merged.startCol) {
                    seenMerges.add(merged);
                    ctx.save();
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(x, y, this.getWidthBetweenColumns(merged.startCol, merged.endCol), this.getHeightBetweenRows(merged.startRow, merged.endRow));
                    ctx.restore();
                    if (this.getCell(row, col).cellType === 'button') {
                        const button = this.getButton(row, col).el;
                        this.positionElement(button, this.widthAccum[col], this.heightAccum[row], this.getWidthBetweenColumns(merged.startCol, merged.endCol), this.getHeightBetweenRows(merged.startRow, merged.endRow));
                    } else if (this.getCell(row, col).cellType === 'linechart') {
                        const lineChart = this.getLineChart(row, col)?.el;
                        this.positionElement(lineChart, this.widthAccum[col], this.heightAccum[row], this.getWidthBetweenColumns(merged.startCol, merged.endCol), this.getHeightBetweenRows(merged.startRow, merged.endRow));
                    } else {
                        this.clearElRegistry(row, col);
                        this.renderCellText(ctx, this.widthAccum[col] - this.widthAccum[block.startCol], y, this.getWidthBetweenColumns(merged.startCol, merged.endCol), merged.startRow, merged.startCol);
                    }
                    continue;
                }
                else if (merged && (row !== merged.startRow || col !== merged.startCol)) {
                    const originBlock = this.blockFromRc(merged.startRow, merged.startCol);
                    // todo: left block might be pruned because not in view
                    if (block === originBlock) continue;
                    if (seenMerges.has(merged)) continue;
                    seenMerges.add(merged);
                    const leftBlock = this.leftBlock(block);
                    let accumulatedWidth;
                    let width;
                    if (!leftBlock) {
                        accumulatedWidth = this.widthAccum[merged.startCol] - this.rowNumberWidth;
                        width = 0;
                    } else {
                        accumulatedWidth = this.widthAccum[merged.startCol] - this.widthAccum[leftBlock.startCol];
                        width = leftBlock.width;
                    }

                    // clear gridlines
                    const renderWidth = merged ? this.getWidthBetweenColumns(merged.startCol, merged.endCol) : colWidth;
                    const mergeWidth = this.getWidthBetweenColumns(merged.startCol, merged.endCol);
                    const mergeHeight = this.getHeightBetweenRows(merged.startRow, merged.endRow);
                    ctx.save();
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(accumulatedWidth - width, y, renderWidth, mergeHeight);
                    ctx.restore();
                    if (row !== merged.startRow) continue; // ok until we add vertical alignment

                    // handle text overflow of mergedcell between two blocks
                    if (this.getCell(merged.startRow, merged.startCol)?.cellType === 'button') continue;
                    this.renderCellText(ctx, accumulatedWidth - width, y, this.getWidthBetweenColumns(merged.startCol, merged.endCol), merged.startRow, merged.startCol);
                    continue;
                }

                const renderWidth = merged ? this.getWidthBetweenColumns(merged.startCol, merged.endCol) : colWidth;

                if (this.getCell(row, col).cellType === 'button') {
                    if (!merged) {
                        const button = this.getButton(row, col).el;
                        this.positionElement(button, this.widthAccum[col], this.heightAccum[row], renderWidth, this.rowHeight(row));
                    }
                } else if (this.getCell(row, col).cellType === 'chart') {
                    const lineChart = this.getLineChart(row, col)?.el;
                    this.positionElement(lineChart, this.widthAccum[col], this.heightAccum[row], renderWidth, this.rowHeight(row));
                } else {
                    this.renderBorders(ctx,row,col);
                    this.renderCellText(ctx, x, y, renderWidth, row, col);
                }
            }

            x += colWidth;
        }

        // if (this.activePlaceholders.has(key)) {
        //     this.releasePlaceholder(this.activePlaceholders.get(key));
        //     this.activePlaceholders.delete(key);
        // }
    }
    clearElRegistry(row: number, col: number) {
        const _id = this.getCellId(row, col);
        if (this.elRegistry[_id]) {
            this.elRegistry[_id].el.parentNode?.removeChild(this.elRegistry[_id].el);
        }
    }
    isSelectStart(row: number, col: number) {
        if (!this.selectionStart) return;
        return this.selectionStart.row === row && this.selectionStart.col === col;
    }
    isSelectEnd(row: number, col: number) {
        if (!this.selectionEnd) return;
        return this.selectionEnd.row === row && this.selectionEnd.col === col;
    }
    positionElement(el: any, x: number, y: number, width: number, height: number, append = true) {
        el.style.top = `${y}px`;
        el.style.left = `${x}px`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        append && this.container.appendChild(el);
    }
    getCellId(row: number, col: number) {
        return this.getCell(row, col)?._id;
    }
    getButton(row: number, col: number) {
        const _id = this.getCellId(row, col);
        if (this.elRegistry[_id] && this.elRegistry[_id].type === 'button') {
            return this.elRegistry[_id];
        } else if (this.elRegistry[_id] && this.elRegistry.type !== 'button') {
            this.elRegistry[_id].el.parentNode?.removeChild(this.elRegistry[_id].el);
        }
        const button: any = document.createElement('button');
        button.textContent = this.getCellText(row, col);
        button.onclick = (e: any) => e.stopPropagation();
        button.ondblclick = (e: any) => e.stopPropagation();
        button.style.zIndex = 1;
        button.style.position = 'absolute';
        button.style.overflow = 'hidden';
        button.style.userSelect = 'none';
        this.elRegistry[_id] = { type: 'button', el: button };
        return this.elRegistry[_id];
    }
    getLineChart(row: number, col: number) {
        const _id = this.getCellId(row, col);
        if (this.elRegistry[_id] && this.elRegistry[_id].type === 'lineChart') {
            const data = this.elRegistry[_id].data;
            const { width, height } = this.getWidthHeight(row, col);
            this.elRegistry[_id].lineChart.render(data, width, height);
            return this.elRegistry[_id];
        } else if (this.elRegistry[_id] && this.elRegistry[_id].type !== 'lineChart') {
            this.elRegistry[_id].el.parentNode?.removeChild(this.elRegistry[_id].el);
        }
        const data = [
            ["10", "2023-01-01"],
            ["15", "2023-01-02"],
            ["12", "2023-01-03"],
            ["20", "2023-01-04"],
            ["18", "2023-01-05"],
            ["25", "2023-01-06"],
            ["22", "2023-01-07"]
        ];
        const wrapper: any = document.createElement('div');
        // wrapper.appendChild(lineChart.container);
        wrapper.onclick = (e: any) => e.stopPropagation();
        wrapper.ondblclick = (e: any) => e.stopPropagation();
        wrapper.style.zIndex = 1;
        wrapper.style.position = 'absolute';
        wrapper.style.overflow = 'hidden';
        wrapper.style.height = '100%';
        wrapper.style.width = '100%';
        const { width, height } = this.getWidthHeight(row, col);
        const lineChart = createLineChart(data, wrapper, width, height);
        this.elRegistry[_id] = { el: wrapper, lineChart, data, type: 'lineChart' };
        return this.elRegistry[_id];
    }
    getWidthOffset(col: number, withStickyLeftBar = false) {
        return this.widthAccum[col] - (withStickyLeftBar ? 0 : this.rowNumberWidth);
    }
    getHeightOffset(row: number, withStickyHeader = false) {
        return this.heightAccum[row] - (withStickyHeader ? 0 : this.headerRowHeight);
    }
    getCellWidth(a: any, b: any = null) {
        let col = a;
        if (typeof b === 'number') {
            col = b;
        }
        return this.getColWidth(col);
    }
    getCellHeight(row: number, col = null) {
        return this.rowHeight(row);
    }
    getHeight(row: number, col: number | null = null) {
        return this.rowHeight(row);
    }
    getWidthBetweenColumns(col1: number, col2: number) {
        let accumulatedWidth = 0;
        for (let _col = col1; _col <= col2; _col++) {
            const colWidth = this.getColWidth(_col);
            accumulatedWidth += colWidth;
        }
        return accumulatedWidth;
    }
    getHeightBetweenRows(startRow: number, endRow: number) {
        if (endRow < startRow) { let tmp = endRow; endRow = startRow; startRow = tmp; }
        return this.heightAccum[endRow + 1] - this.heightAccum[startRow]; // needs +1?
    }
    quality() {
        const devicePixelRatio = window.devicePixelRatio;
        if (devicePixelRatio < 0.5) {
            return 'performance';
        } else if (devicePixelRatio < 1) {
            return 'balance';
        } else {
            return 'max';
        }
    }
    applyRenderingQuality(ctx: any) {
        switch (this.quality()) {
            case 'performance':
                ctx.textRendering = 'optimizeSpeed';
                ctx.imageSmoothingEnabled = false;
                break;
            case 'balance':
                ctx.textRendering = 'geometricPrecision';
                ctx.imageSmoothingEnabled = true;
                break;
            case 'max':
            default:
                ctx.textRendering = 'geometricPrecision';
                ctx.imageSmoothingEnabled = true;
        }
    }

    getCell(row: number, col: number) {
        if (!this.data) return { row, col };
        return this.data.get(row, col)
    }
    getCellText(row: number, col: number) {
        return this.getCell(row, col)?.text || '';
    }
    getCellTextAlign(row: number, col: number) {
        return this.getCell(row, col)?.textAlign;
    }

    renderCellText(ctx: any, x: number, y: number, width: number, row: number, col: number, _text = '') {
        const value = this.getCellText(row, col);
        let text = value !== undefined && value !== null ? String(value) : '';
        if (_text !== '') text = _text;
        // if (text === '') return;
        try {
            removeDependents(row,col);
            text = this.parser.evaluateExpression(text, [row,col]);
        } catch (e) {
            console.warn(e);
            text = text;
        }
        if (text === '') return;
        ctx.save(); // Save the current state
        if (this.getCellColor(row, col)) {
            ctx.fillStyle = this.getCellColor(row, col);
        }
        if (this.getCell(row, col)?.fontSize != null) {
            ctx.font = this.getFontString(row, col);
        }
        if (this.getCell(row, col)?.textBaseline != null) {
            ctx.textBaseline = this.getCell(row, col).textBaseline;
        }
        ctx.beginPath();
        if (this.getCellTextAlign(row, col)) ctx.textAlign = this.getCellTextAlign(row, col);
        ctx.rect(x, y, width, this.rowHeight(row)); // Adjust y position based on your text baseline
        ctx.clip();
        ctx.fillText(text, x + 4, y + this.rowHeight(row) / 2);
        ctx.restore(); // Restore the state to remove clipping
    }

    getCellColor(row: number, col: number) {
        return this.getCell(row, col)?.color ?? '';
    }

    getAbbreviatedText(text: string) {
        if (text.length > 8) {
            return text.substring(0, 5) + '...';
        }
        return text;
    }

    getFontString(row: number | null = null, col: number | null = null) {
        let fontSize = 12;
        if (row != null && col != null && this.getCell(row, col).fontSize != null) {
            fontSize = this.getCell(row, col).fontSize;
        }
        let fontString = `${fontSize}px Arial`;

        if (this.quality() === 'max' && devicePixelRatio >= 1) {
            // Only use subpixel rendering when not zoomed out
            fontString += ', sans-serif';
        }

        return fontString;
    }

    releaseBlock(block: any) {
        if (block.subBlocks.length > 1) {
            while (block.subBlocks.length > 1) {
                block.subBlocks.pop();
            }
        }
        block.blockContainer.innerHTML = '';
        block.blockContainer.parentNode.removeChild(block.blockContainer);
    }
}