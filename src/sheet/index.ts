// @ts-ignore
import SparseGrid from 'packages/sparsegrid';
// @ts-ignore
import ExpressionParser from 'packages/expressionparser';
// @ts-ignore
import { launchFormatMenu } from './windows/format';
// @ts-ignore
import { createLineChart } from './graphs/linechart.js';
import FinancialSubscriber from 'packages/financial/index';
// @ts-ignore
import { dependencyTree, tickerReg, shiftDependenciesDown, shiftDependenciesRight, shiftDependenciesUp, shiftDependenciesLeft, removeDependents } from "packages/dependencytracker";

import { hasBorderStr } from "./utils";
import { shiftTextRefs, rowColToRef } from "./shiftops";
import { header } from './templates';
import { Rect, GigaSheetTypeOptions, CellCoordsRect } from './interfaces';
import ContextMenu from './components/contextmenu';
import { FormulaBar } from './components/formulaBar';
import { Toolbar } from './components/toolbar';

export default class Sheet {
    wrapper: HTMLElement;
    container: HTMLElement;
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
    mergedCells: Rect[];
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
    // mergeButton: HTMLElement;
    formatButton: HTMLElement;
    _container: HTMLDivElement;
    ctxmenu: ContextMenu;
    formulaBar: FormulaBar;
    toolbar: Toolbar;
    constructor(wrapper: HTMLElement, options: GigaSheetTypeOptions | any, state?: any) {
        this.wrapper = wrapper || document.createElement('div');
        const _container = document.createElement('div');
        this._container = _container;
        _container.style.width = '100%';
        _container.style.height = '100%';
        _container.style.display = 'flex';
        _container.style.flexDirection = 'column';
        // _container.style.maxHeight = 'calc(100vh - 40px)';
        this.toolbar = new Toolbar();
        this.formulaBar = new FormulaBar();
        // _container.innerHTML += header;
        _container.appendChild(this.toolbar.container);
        _container.appendChild(this.formulaBar.container);
        _container.insertAdjacentHTML('beforeend', `
        <div id="grid-container" class="grid-container">
            <div id="corner-cell" class="corner-cell"></div>
            <div id="header-container" class="header-container"></div>
            <div id="row-number-container" class="row-number-container"></div>
            <div id="selection-layer" class="selection-layer"></div>
        </div>
        `);
        this.container = _container.querySelector('.grid-container')!;
        this.wrapper.appendChild(_container);
        this.ctxmenu = new ContextMenu();
        _container.append(this.ctxmenu.container)
        // this.container.style.minHeight = '100%';
        this.container.style.width = '100%';
        // this.container.style.height = '100%';
        this.container.style.position = 'relative';
        this.container.style.overflow = 'auto';
        this.container.scrollLeft = 0;
        this.container.scrollTop = 0;
        this.headerContainer = _container.querySelector('.header-container')!;
        this.rowNumberContainer = _container.querySelector('.row-number-container')!;
        this.cornerCell = _container.querySelector('.corner-cell')!;
        this.selectionLayer = _container.querySelector('.selection-layer')!;
        // this.mergeButton = _container.querySelector('.merge-button')!;
        this.formatButton = _container.querySelector('.format-button')!;
        this.lastDevicePixelRatio = window.devicePixelRatio;
        this.lastBlockCanvases = this.blockCanvases();
        // const rect = this.container.getBoundingClientRect();
        // this.cornerCell.style.top = `${rect.y}px`;

        // Configuration
        this.cellWidth = options.cellWidth ?? 64;
        this.cellHeight = options.cellHeight ?? 20;
        this.blockRows = options.blockRows ?? 28;  // Max rows per canvas block
        this.blockCols = options.blockCols ?? 30;  // Max cols per canvas block
        this.paddingBlocks = options.paddingBlocks ?? 1; // Extra blocks to render around visible area
        this.padding = options.padding || 1; // number of adjacent blocks to render
        this.MAX_HISTORY_SIZE = 100;
        this.rowNumberWidth = 42;
        this.headerRowHeight = this.cellHeight || 30;
        // this.headerContainer.style.height = `${this.headerRowHeight}px`;
        this.headerContainer.style.lineHeight = `${this.headerRowHeight}px`;
        this.selectionLayer.style.top = `${this.headerRowHeight}px`;
        this.selectionLayer.style.left = `${this.rowNumberWidth}px`;
        this.rowNumberContainer.style.width = `${this.rowNumberWidth}px`;
        this.rowNumberContainer.style.lineHeight = `${this.headerRowHeight}px`;
        this.cornerCell.style.width = `${this.rowNumberWidth}px`;
        this.cornerCell.style.height = `${this.headerRowHeight}px`;
        this.cornerCell.style.marginTop = `-${this.headerRowHeight + 1}px`; // -1 for border
        if (options.subscribeFinance) {
            this.subscribeFinance();
        }

        // State
        this.mergedCells = options.mergedCells || [];
        this.heightOverrides = this.buildOverrides(options.heightOverrides);
        this.widthOverrides = this.buildOverrides(options.widthOverrides);
        this.gridlinesOn = options.gridlinesOn ?? true;
        this.activeBlocks = new Map(); // Track active canvas blocks
        // window.activeBlocks = this.activeBlocks;
        // window.renderBlock = this.renderBlock.bind(this);
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

        // Add edit input element
        this.editInput = document.createElement('input');
        this.editInput.className = 'cell-edit-input';
        this.editInput.style.position = 'absolute';
        this.editInput.style.display = 'none';
        this.container.appendChild(this.editInput);
        // Initialize
        this.initEventListeners();
        this.createSelectionHandle();
        this.addNewSelection();

        this.initRender();
        this.data = null;
        this.parser = null;
        // if (!this.restoreSave()) {
            this.setData(new SparseGrid(), options.initialCells);
        // }
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
            // this.contextMenu.style.width = `${130 * this.scaler()}px`;
            // this.contextMenu.style.fontSize = `${14 * this.scaler()}px`;
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
        this.container.addEventListener('contextmenu', (e: any) => {
            if ((e.target as HTMLElement).closest('.row-number-container')) return;
            if ((e.target as HTMLElement).closest('.header-container')) return;
            if ((e.target as HTMLElement).closest('.corner-cell')) return;
            if (e.target.closest('.cell-edit-input')) return;
            e.preventDefault(); // Prevent the default browser context menu
        });

        this._container.querySelector('.align-button-group')?.addEventListener('click', (e: any) => {
            // console.log('clicked align buttons', e.target?.getAttribute('data-align'))
            const textAlign = e.target?.getAttribute('data-align');
            const selectedCells = this.getSelectedCells();
            this.setCells(selectedCells, 'textAlign', textAlign);
        })
        this._container.querySelector('.quick-text-actions-buttons')?.addEventListener('click', async (e: any) => {
            // console.log('clicked align buttons', e.target?.getAttribute('data-align'))
            const action = e.target?.getAttribute('data-action');
            if (action === 'copy') {
                document.execCommand('copy');
            } else if (action === 'paste') {
                const clipboardText = await navigator.clipboard.readText();
                this.handlePaste(clipboardText);
            } else if (action === 'cut') {
                document.execCommand('copy');
                this.clearSelectedCells();
            }
        })
        document.addEventListener('paste', (e) => {
            if (this.editingCell) return;
            this.handlePaste(e.clipboardData!.getData('text/plain'));
            e.preventDefault();
        });
        this.ctxmenu.onClick(async (action: string) => {
            if (action === 'copy') {
                document.execCommand('copy');
            } else if (action === 'cut') {
                document.execCommand('copy');
                this.clearSelectedCells();
            } else if (action === 'paste') {
                if (this.editingCell) return;
                const clipboardText = await navigator.clipboard.readText();
                this.handlePaste(clipboardText);
            } else if (action === 'insert-row') {
                this.insertRow();
            } else if (action === 'insert-column') {
                this.insertCol();
            } else if (action === 'delete-row') {
                this.deleteRow();
            } else if (action === 'delete-column') {
                this.deleteCol();
            } else if (action === 'clear') {
                this.clearSelectedCells();
            } else if (action === 'toggle-gridlines') {
                this.toggleGridlines();
                this.forceRerender();
            } else if (action === 'merge') {
                this.mergeSelectedCells();
            } else if (action === 'unmerge') {
                this.unmergeSelectedCells();
            }
        })
        this.editInput.oninput = (e: any) => {
            this.formulaBar.textarea.value = e.target.value;
        }
        this.toolbar.onAction(async (action: string, value?: any) => {
            if (action === 'Merge') {
                this.mergeSelectedCells();
            } else if (action === 'Copy') {
                document.execCommand('copy');
            } else if (action === 'Paste') {
                const clipboardText = await navigator.clipboard.readText();
                this.handlePaste(clipboardText);
            } else if (action === 'Undo') {
                this.undo();
            } else if (action === 'Redo') {
                this.redo();
            } else if (action === 'Left align') {
                const textAlign = 'left';
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, 'textAlign', textAlign);
            } else if (action === 'Center align') {
                const textAlign = 'center';
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, 'textAlign', textAlign);
            } else if (action === 'Right align') {
                const textAlign = 'right';
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, 'textAlign', textAlign);
            } else if (action === 'Grow Font') {
                const selectedCells = this.getSelectedCells();
                const cells = [];
                for(let vcell of selectedCells) {
                    const cell = this.getCell(vcell.row,vcell.col);
                    if (cell.fontSize == null) {
                        cell.fontSize = 12;
                    }
                    cell.fontSize++;
                    // cell.fontSize *= devicePixelRatio;
                    cells.push(cell);
                }
                this.rerenderCells(cells);
            } else if (action === 'Shrink Font') {
                const selectedCells = this.getSelectedCells();
                const cells = [];
                for (let vcell of selectedCells) {
                    const cell = this.getCell(vcell.row, vcell.col);
                    if (cell.fontSize == null) {
                        cell.fontSize = 12;
                    }
                    cell.fontSize--;
                    // cell.fontSize *= devicePixelRatio;
                    cells.push(cell);
                }
                this.rerenderCells(cells);
            } else if (action === 'Bold') {
                const selectedCells = this.getSelectedCells();
                const cells = [];
                for (let vcell of selectedCells) {
                    const cell = this.getCell(vcell.row, vcell.col);
                    if (cell.bold = !cell.bold) {
                        cell.fontSize = 12;
                    }
                    cell.fontSize *= devicePixelRatio;
                    cells.push(cell);
                }
                this.rerenderCells(cells);
            } else if (action === 'fontFamily') {
                const selectedCells = this.getSelectedCells();
                const cells = [];
                for (let vcell of selectedCells) {
                    const cell = this.getCell(vcell.row, vcell.col);
                    cell.fontFamily = value;
                    cells.push(cell);
                }
                this.rerenderCells(cells);
            } else if (action === 'fontSize') {
                const selectedCells = this.getSelectedCells();
                const cells = [];
                for (let vcell of selectedCells) {
                    const cell = this.getCell(vcell.row, vcell.col);
                    cell.fontSize = value;
                    cells.push(cell);
                }
                this.rerenderCells(cells);
            }
        })
    }

    showContextMenu(x: number, y: number, row: number, col: number) {
        const rect = this.container.getBoundingClientRect();
        this.ctxmenu.setPosition(x,y,rect)
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
                this.clearElRegistry(row, col);
                deletions.push([row, col]);
                changes.push(obj);
            }
        }
        this.data.deleteCells(deletions);
        this.recordChanges(changes);

        for (let [row, col] of deletions) {
            this.renderCell(row, col);
        }
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
        const { startRow, startCol } = this.selectionBoundRect;

        const clipboardData = text;
        const rowsData = clipboardData.split('\n');
        const changes = []; // To record changes for undo/redo

        for (let i = 0; i < rowsData.length; i++) {
            const rowData = rowsData[i].split('\t');
            for (let j = 0; j < rowData.length; j++) {
                const row = startRow + i;
                const col = startCol + j;
                // if (row <= this.totalRowBounds && col <= this.totalColBounds) {
                    changes.push({
                        row,
                        col,
                        previousValue: this.getCellText(row, col),
                        newValue: rowData[j],
                        changeKind: 'valchange'
                    });
                    this.setText(row, col, rowData[j]);
                    this.renderCell(row, col);
                // }
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

    rerenderCells(arr: any) {
        for (let cell of arr) {
            let row, col;
            if (Array.isArray(cell)) {
                row = cell[0]; col = cell[1];
            } else {
                row = cell.row; col = cell.col;
            }
            this.renderCell(row, col);
        }
        this.rerenderMerges(arr);
    }
    rerenderMerges(arr: any = []) {
        const mergeSet = new Set();
        for (let cell of arr) {
            let row,col;
            if (Array.isArray(cell)) {
                row = cell[0]; col = cell[1];
            } else {
                row = cell.row; col = cell.col;
            }
            const merge = this.getMerge(row, col);
            if (!merge) continue;
            mergeSet.add(merge);
            for (let block of this.getBlocksInMerge(merge)) {
                this.renderCell(merge.startRow, merge.startCol, block);
            }
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
        this.ctxmenu.hide();
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
            const selectedCells = this.getSelectedCells();
            this.setCells(selectedCells, type, value);
        });
    }

    forceRerender() {
        this.updateVisibleGrid(true);
    }

    handleKeyDown(e: any) {
        const key = e.key.toLowerCase();
        if ((key === 'f2') && this.selectionStart) {
            e.preventDefault();
            if (this.editingCell) return;
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
        } else if (key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright' || key === 'enter') {
            if (!this.selectionEnd || this.editingCell) return;
            e.preventDefault();
            this.handleArrowKeyDown(e);
        } else if (this.selectionStart && e.key?.length === 1) {
            if (this.editingCell) return;
            this.startCellEdit(this.selectionStart.row, this.selectionStart.col, e.key);
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
            'ArrowUp': [-1, 0], 'ArrowDown': [1, 0], 'ArrowLeft': [0, -1], 'ArrowRight': [0, 1], 'Enter': e.shiftKey ? [-1, 0] : [1,0]
        }
        const curMerge = this.getMerge(this.selectionEnd.row, this.selectionEnd.col);
        let row = this.selectionEnd.row + deltas[e.key][0];
        let col = this.selectionEnd.col + deltas[e.key][1];
        const merge = this.getMerge(row, col);
        if (e.shiftKey) {
            // TODO: do in less bruteforce way
            const prevRect = JSON.stringify(this.selectionBoundRect);
            if (e.key === 'ArrowUp' || (e.key === 'Enter' && e.shiftKey)) {
                let curRect;
                while (row > 0) {
                    curRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    row--;
                }
            }
            else if (e.key === 'ArrowDown' || (e.key === 'Enter' && !e.shiftKey)) {
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
            else if (e.key === 'ArrowDown' || e.key === 'Enter') { row = merge.endRow + 1; }
            else if (e.key === 'ArrowLeft') { col = merge.startCol - 1; }
            else if (e.key === 'ArrowRight') { col = merge.endCol + 1; }
        }
        row = Math.max(0, row); row = Math.min(row, this.totalRowBounds-1);
        col = Math.max(0, col); col = Math.min(col, this.totalColBounds-1);
        if (e.shiftKey && e.key !== 'Enter') this.selectionEnd = { row, col };
        this.selectCell({ row, col, continuation: e.shiftKey && e.key !== 'Enter' });
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
        const cells = this.data.getCellsForce(startRow, startCol, endRow, endCol).filter((cell: {row:number,col:number}) => this.isValid(cell.row, cell.col));
        return cells;
    }
    isValid(row:number,col:number) {
        const merge = this.getMerge(row,col);
        if (!merge) return true;
        return merge.startRow == row && merge.startCol == col;
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
        return this.getWidthBetweenColumns(merge.startCol, merge.endCol+1);
    }
    getMergeHeight(merge: any) {
        return this.getHeightBetweenRows(merge.startRow, merge.endRow+1);
    }
    startCellEdit(row: number, col: number, startingValue?: string) {
        if (row < 0 || row > this.totalRowBounds || col < 0 || col > this.totalColBounds) return;
        const merge = this.getMerge(row, col);
        let left, top, width, height, value;
        if (merge) {
            left = this.getWidthOffset(merge.startCol, true);
            top = this.getHeightOffset(merge.startRow, true);
            width = this.getMergeWidth(merge);
            height = this.getMergeHeight(merge);
            value = startingValue != null ? '' : this.getCellText(merge.startRow, merge.startCol);
            row = merge.startRow, col = merge.startCol;
        } else {
            left = this.getWidthOffset(col, true);
            top = this.getHeightOffset(row, true);
            width = this.getCellWidth(row, col);
            height = this.rowHeight(row);
            value = startingValue != null ? '' : this.getCellText(row, col);
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
        this.setCell(row,col,'text',text)
        // this.data?.setCellProperty(row, col, 'text', text);
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
        const merge = this.getMerge(row,col);
        if (merge) {
            for (let block of this.getBlocksInMerge(merge)) {
                this.renderCell(merge.startRow,merge.startCol,block);
            }
        } else {
            this.renderCell(row, col);
        }
    }

    getBlocksInMerge(merge: any): Set<any> {
        const blockSet = new Set();
        for (let i = merge.startRow; i <= merge.endRow; i++) {
            for (let j = merge.startCol; j <= merge.endCol; j++) {
                const block = this.getBlockOrSubBlock(i, j);
                if (!block) continue;
                if (blockSet.has(block)) continue;
                blockSet.add(block);
            }
        }
        return blockSet;
    }

    cancelCellEdit() {
        this.editInput.style.display = 'none';
        this.editingCell = null;
        this.editInput.onblur = null;
        this.editInput.onkeydown = null;
        this.onSelectionChange();
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
            console.log('update render quality')
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
        if (e.target.closest('.header-cell') ||
            e.target.closest('.row-number-container') ||
            e.target.closest('.corner-cell')) {
                this.hideContextMenu();
                return;
            }
        if (e.target === this.container) return;
        if (e.target === this.editInput) return;
        if (this.draggingHeader) return;
        if (e.target !== this.ctxmenu.container && !this.ctxmenu.container.contains(e.target)) {
            this.hideContextMenu();
        }
        if (e.button === 2) {
            const x = e.clientX;
            const y = e.clientY;
            const { row, col } = this.getCellFromEvent(e);
            this.showContextMenu(x, y, row, col);
            return;
        }
        if (e.button !== 0) return;
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

    getMergesInRange({ startRow, startCol, endRow, endCol }: Rect): Rect[] {
        const merges: Set<Rect> = new Set();
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
            const rect = this.container.getBoundingClientRect();
            this.draggingRow.el.style.top = `${scrollTop + e.clientY - this.headerRowHeight - rect.y - 5}px`;
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
            const draggingHeader = this.draggingHeader;
            const col = this.draggingHeader.col;
            this.draggingHeader = null;
            const scrollLeft = this.container.scrollLeft;
            const diff = (scrollLeft + e.clientX) - this.getWidthOffset(col + 1, true);

            
            const prevOverride = this.widthOverrides[col];
            const change = this.widthOverrides[col] ? this.widthOverrides[col] + diff : this.getCellWidth(col) + diff;
            if (change <= 1) {
                draggingHeader.el.style.left = draggingHeader.origLeft;
                return;
            }
            this.setWidthOverride(col, change);
            this.recordChanges([{ changeKind: 'widthOverrideUpdate', col, value: prevOverride }]);
            this.updateWidthAccum();
            this.renderHeaders();
            this.forceRerender();
            this.updateSelection();
            e.stopPropagation();
        } else if (this.draggingRow) {
            const draggingRow = this.draggingRow;
            const row = this.draggingRow.row;
            this.draggingRow = null;
            const scrollTop = this.container.scrollTop;
            const rect = this.container.getBoundingClientRect();
            const diff = (scrollTop + e.clientY - rect.y) - this.getHeightOffset(row + 1, true);
            const prevOverride = this.heightOverrides[row];
            const change = this.heightOverrides[row] ? this.heightOverrides[row] + diff : this.getCellHeight(row) + diff;
            if (change <= 1) {
                draggingRow.el.style.top = draggingRow.origTop;
                return;
            }
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
        if (!merged) return;
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

    getTrueValue(row: number,col: number) {
        const merge = this.getMerge(row,col);
        if (merge) {
            return this.getCellText(merge.startRow, merge.startCol);
        }
        return this.getCellText(row,col);
    }

    onSelectionChange() {
        if (!this.selectionBoundRect) return;
        const row = this.selectionBoundRect.startRow;
        const col = this.selectionBoundRect.startCol;
        const ref = rowColToRef(row,col);
        this.formulaBar.input.value = ref;
        this.formulaBar.textarea.value = this.getTrueValue(row,col);
    }

    updateSelection() {
        this.onSelectionChange();
        if (!this.activeSelection) return;
        // Clear previous selection
        this.activeSelection.innerHTML = '';
        if (!this.selectionHandle) return;
        this.selectionHandle.style.display = 'none';

        if (!this.selectionBoundRect) return;

        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;

        let left = this.getWidthOffset(startCol);
        let width = this.getWidthBetweenColumns(startCol, endCol+1);

        const top = this.getHeightOffset(startRow); // Below header
        const height = this.getHeightBetweenRows(startRow, endRow+1);

        // Create selection element
        this.selectedCell = document.createElement('div');
        this.selectedCell.className = 'selected-cell';
        this.selectedCell.style.left = `${left}px`;
        this.selectedCell.style.top = `${top}px`;
        this.selectedCell.style.width = `${width+1}px`;
        this.selectedCell.style.height = `${height+1}px`;

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
                const handle: any = el.nextSibling;
                if (handle) handle.classList.remove('handle-col-selected');
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
            const handle: any = el.nextSibling;
            if (handle) handle.classList.add('handle-col-selected');
        }
        for (let row of this.selectedRows) {
            if (row < startRow || row > endRow) {
                this.selectedRows.delete(row);
                const el: HTMLDivElement | null = this.rowNumberContainer.querySelector(`[data-rnrow='${row}']`);
                if (!el) continue;
                el.classList.remove('row-selected');
                const handle: any = el.nextSibling;
                if (handle) handle.classList.remove('handle-row-selected');
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
            const handle: any = el.nextSibling;
            if (handle) handle.classList.add('handle-row-selected');
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
                this.draggingHeader = { origLeft: e.target.style.left, el: e.target, col: parseInt(e.target.getAttribute('data-col')) };
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
                this.draggingRow = { origTop: e.target.style.top, el: e.target, row: parseInt(e.target.getAttribute('data-row')) };
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
            block.canvas.style.left = `${block.parentBlock.subBlocks[0].styleWidth}px`;
        }
        if (i >= 2) {
            block.canvas.style.top = `${block.parentBlock.subBlocks[0].styleHeight}px`;
        }
    }

    createBlock(blockRow: number, blockCol: number) {
        // Calculate block boundaries
        const startRow = blockRow * this.blockRows;
        const endRow = Math.min(startRow + this.blockRows);
        const startCol = blockCol * this.blockCols;
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

        // const subBlockTemplate = () => {
        //     return { startRow, startCol, endRow, endCol, canvas: createCanvas(), parentBlock: block, isSubBlock: true, index: 0 };
        // }

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
        let scaleFactor = this.effectiveDevicePixelRatio();
        block.width = 0;
        let styleWidth = 0;
        for (let col = block.startCol; col < block.endCol; col++) {
            block.width += this.getColWidth(col) * scaleFactor;
        }
        block.width = Math.round(block.width);
        styleWidth = block.width / scaleFactor;

        // Calculate block height based on rows
        block.height = (this.heightAccum[block.endRow] - this.heightAccum[block.startRow]) * scaleFactor;
        block.height = Math.round(block.height)
        let styleHeight = block.height / scaleFactor;

        // Set canvas dimensions
        block.canvas.width = block.width;
        block.canvas.height = block.height;
        block.canvas.style.width = `${styleWidth}px`;
        block.canvas.style.height = `${styleHeight}px`;

        const ctx = block.canvas.getContext('2d', { alpha: false });
        block.styleHeight = styleHeight;
        block.styleWidth = styleWidth;
        ctx.scale(1,1);
    }

    calculateBlockDimensionsContainer(block: any) {
        const scaleFactor = this.effectiveDevicePixelRatio();
        // Calculate block width based on columns
        block.width = 0;
        for (let col = block.startCol; col < block.endCol; col++) {
            block.width += this.getColWidth(col) * scaleFactor;
        }
        block.width = Math.round(block.width);
        block.width = block.width / scaleFactor;

        // Calculate block height based on rows
        block.height = (this.heightAccum[block.endRow] - this.heightAccum[block.startRow]) * scaleFactor;
        block.height = Math.round(block.height)
        block.height = block.height / scaleFactor;
        // block.height = (block.endRow - block.startRow) * this.cellHeight;
        block.blockContainer.style.width = `${block.width}px`;
        block.blockContainer.style.height = `${block.height}px`;
        block.styleWidth = block.width;
        block.styleHeight = block.height;
    }

    effectiveDevicePixelRatio() {
        return devicePixelRatio;
        // return devicePixelRatio * devicePixelRatio;
        if (this.blockCanvases() > 2) {
            return Math.min(window.devicePixelRatio || 1, 4);
            // return Math.min(window.devicePixelRatio || 1, 3.6);
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
            width = this.getWidthBetweenColumns(merged.startCol, merged.endCol+1), height = this.getHeightBetweenRows(merged.startRow, merged.endRow+1)
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

    getCellCoordsContainer(row: number, col: number): CellCoordsRect {
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
    getCellCoordsCanvas(row: number, col: number): CellCoordsRect {
        const block = this.getBlockOrSubBlock(row, col);
        // if (!block) return null;
        const merge = this.getMerge(row, col);
        let left, top, width, height;
        if (merge) {
            left = this.getWidthBetweenColumns(block.startCol, merge.startCol);
            top = this.getHeightBetweenRows(block.startRow, merge.startRow);
            width = this.getMergeWidth(merge);
            height = this.getMergeHeight(merge);
            row = merge.startRow, col = merge.startCol;
        } else {
            left = this.getWidthBetweenColumns(block.startCol, col);
            top = this.getHeightBetweenRows(block.startRow, row);
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
            ctx.moveTo(this.getWidthOffset(col) * devicePixelRatio, this.getHeightOffset(row) * devicePixelRatio);
            ctx.lineTo(this.getWidthOffset(col) * devicePixelRatio, (this.getHeightOffset(row) + this.getCellHeight(row)) * devicePixelRatio);
            ctx.stroke();
        }

        // top border
        if (hasBorderStr(border, 'top')) {
            ctx.beginPath();
            ctx.moveTo(this.getWidthOffset(col) * devicePixelRatio, this.getHeightOffset(row) * devicePixelRatio);
            ctx.lineTo((this.getWidthOffset(col) + this.getCellWidth(col)) * devicePixelRatio, this.getHeightOffset(row) * devicePixelRatio);
            ctx.stroke();
        }

        // right border
        if (hasBorderStr(border, 'right')) {
            ctx.beginPath();
            ctx.moveTo((this.getWidthOffset(col) + this.getCellWidth(col)) * devicePixelRatio, this.getHeightOffset(row) * devicePixelRatio);
            ctx.lineTo((this.getWidthOffset(col) + this.getCellWidth(col)) * devicePixelRatio, (this.getHeightOffset(row) + this.getCellHeight(row)) * devicePixelRatio);
            ctx.stroke();
        }

        // bottom border
        if (hasBorderStr(border, 'bottom')) {
            ctx.beginPath();
            ctx.moveTo(this.getWidthOffset(col) * devicePixelRatio, (this.getHeightOffset(row) + this.getCellHeight(row)) * devicePixelRatio);
            ctx.lineTo((this.getWidthOffset(col) + this.getCellWidth(col)) * devicePixelRatio, (this.getHeightOffset(row) + this.getCellHeight(row)) * devicePixelRatio);
            ctx.stroke();
        }

        ctx.restore();
    }

    renderCell(row: any, col: any, srcblock?: any, ctx?: any) {
        // if (this.getMerge(row, col)) {
        //     // this.forceRerender();
        //     return;
        // }
        if (!ctx) {
            let block = srcblock;
            if (!block) block = this.getBlockOrSubBlock(row,col);
            if (block) {
                ctx = block?.canvas.getContext('2d', { alpha: false });
            }
        }
        let left, top, width, height;
        try {
            ({ left, top, width, height } = this.getCellCoordsCanvas(row, col));
        } catch {
            return;
        }
        if (ctx) ctx.fillStyle = '#ffffff';
        if (!srcblock || this.rowColInBounds(row,col,srcblock)) {
            // console.log('inbounds::', row,col)
            ctx && ctx.fillRect((left + 1)*devicePixelRatio, (top + 1)*devicePixelRatio, (width - 2)*devicePixelRatio, (height - 2)*devicePixelRatio);
        } else {
            const ssr = srcblock.startRow, sec = srcblock.endCol;
            const merge = this.getMerge(row,col);
            if (!merge) return;
            row = merge.startRow, col = merge.startCol;
            const _width = this.getWidthBetweenColumns(srcblock.startCol,merge.endCol+1);
            const _height = this.getHeightBetweenRows(srcblock.startRow,merge.endRow+1);
            left = _width - width;
            top = _height - height;
            ctx && ctx.fillRect((left + 1)*devicePixelRatio, (top + 1)*devicePixelRatio, (width - 2)*devicePixelRatio, (height - 2)*devicePixelRatio);
        }
        if (ctx) ctx.fillStyle = '#333333';
        this.renderBorders(ctx,row,col);
        if (this.getCell(row, col).cellType === 'button') {
            const button = this.getButton(row, col).el;
            ({ left, top, width, height } = this.getCellCoordsContainer(row, col));
            this.positionElement(button, left, top, width, height);
        } else if (this.getCell(row, col).cellType === 'linechart') {
            const lineChart = this.getLineChart(row, col)?.el;
            ({ left, top, width, height } = this.getCellCoordsContainer(row, col));
            this.positionElement(lineChart, left, top, width, height);
        } else {
            this.clearElRegistry(row,col);
            this.renderCellText(ctx, left, top, width, row, col);
            if (dependencyTree[row]?.[col]) {
                for (let childRow in dependencyTree[row][col]) {
                    for (let childCol in dependencyTree[row][col][childRow]) {
                        this.renderCell(childRow, childCol)
                    }
                }
            }
        }
    }

    scalerZoom() {
        return devicePixelRatio;
    }

    renderBlock(block: any, calcDimensions = false) {
        if (calcDimensions) {
            this.calculateBlockDimensions(block);
        }
        const ctx = block.canvas.getContext('2d', { alpha: false });
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, block.canvas.width, block.canvas.height);

        // Set rendering quality based on zoom
        this.applyRenderingQuality(ctx);

        // Draw cells
        let x = 0;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333333';
        const scaler = 88;
        ctx.strokeStyle = `hsl(0,0%,${scaler}%)`;
        ctx.lineWidth = 1;
        ctx.font = this.getFontString();

        ctx.translate(0.5, 0.5); // thick gridlines fix

        // draw row gridlines
        let y;
        if (this.gridlinesOn && this.quality() !== 'performance') {
            for (let row = block.startRow; row < block.endRow; row++) {
                y = Math.round((this.heightAccum[row] - this.heightAccum[block.startRow])*devicePixelRatio);
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(block.canvas.width, y);
                ctx.stroke();
            }
        }
        // draw col grid lines
        if (this.gridlinesOn && this.quality() !== 'performance') {
            for (let col = block.startCol; col < block.endCol; col++) {
                const colWidth = this.getColWidth(col);
                // draw col gridlines
                ctx.beginPath();
                ctx.moveTo(Math.round(x * devicePixelRatio), 0);
                ctx.lineTo(Math.round(x * devicePixelRatio), block.canvas.height);
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
                if (merged) continue;
                const y = this.heightAccum[row] - this.heightAccum[block.startRow];

                // Skip rendering if the cell is part of a merged range (except the top-left cell)

                const renderWidth = colWidth;

                if (this.getCell(row, col).cellType === 'button') {
                    if (!merged) {
                        const button = this.getButton(row, col).el;
                        this.positionElement(button, this.widthAccum[col], this.heightAccum[row], renderWidth, this.rowHeight(row));
                    }
                } else if (this.getCell(row, col).cellType === 'linechart') {
                    const lineChart = this.getLineChart(row, col)?.el;
                    this.positionElement(lineChart, this.widthAccum[col], this.heightAccum[row], renderWidth, this.rowHeight(row));
                } else {
                    this.renderBorders(ctx,row,col);
                    this.renderCellText(ctx, x, y, renderWidth, row, col);
                }
            }

            x += colWidth;
        }

        this.renderMergesOnBlock(block, ctx);
    }
    renderMergesOnBlock(block: any, ctx: any) {
        const merges: Array<Rect> = this.getMergesInRange(block);
        for(let merge of merges) {
            const row = merge.startRow, col = merge.startCol;
            this.renderCell(row,col,block,ctx);
        }
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
        for (let _col = col1; _col < col2; _col++) {
            const colWidth = this.getColWidth(_col);
            accumulatedWidth += colWidth;
        }
        return accumulatedWidth;
    }
    getHeightBetweenRows(startRow: number, endRow: number) {
        if (endRow < startRow) { let tmp = endRow; endRow = startRow; startRow = tmp; }
        return this.heightAccum[endRow] - this.heightAccum[startRow];
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
        ctx.rect(x * devicePixelRatio, y * devicePixelRatio, width * devicePixelRatio, this.rowHeight(row) * devicePixelRatio); // Adjust y position based on your text baseline
        ctx.clip();
        ctx.fillText(text, (x + 4) * devicePixelRatio, (y + this.rowHeight(row) / 2) * devicePixelRatio);
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
        let fontSize = 12*devicePixelRatio;
        if (row != null && col != null && this.getCell(row, col).fontSize != null) {
            fontSize = this.getCell(row, col).fontSize;
        }
        let bold, fontFamily = 'Arial';
        if (row != null && col != null) {
            bold = this.getCell(row, col).bold;
            fontFamily = this.getCell(row, col).fontFamily || 'Arial';
        }
        let fontString = '';
        if (bold) fontString += 'bold ';

        fontString += `${fontSize}px ${fontFamily}`;

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