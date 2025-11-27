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

import { hasBorderStr, addBorder, arrows, isNumeric } from "./utils";
import { shiftTextRefs, rowColToRef } from "./shiftops";
import { header } from './templates';
import { Rect, GigaSheetTypeOptions, CellCoordsRect } from './interfaces';
import ContextMenu from './components/contextmenu';
import { FormulaBar } from './components/formulaBar';
import { Toolbar } from './components/toolbar';
import scrollIntoView from 'packages/scrollIntoView';

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
    formulaBar: FormulaBar | null;
    toolbar: Toolbar | null;
    options: any;
    lastCol: number | null;
    probe: HTMLDivElement;
    lastDirKey: any;
    scheduledRenders: {[key: string]: any};
    scheduledOffBlockRenders: {[key: string]: any};
    renderQueued: boolean;
    maxRows: number | null;
    maxCols: number | null;
    initialCells: any;
    constructor(wrapper: HTMLElement, options: GigaSheetTypeOptions | any, state?: any) {
        this.toolbar = null;
        this.renderQueued = false;
        this.options = options;
        this.formulaBar = null;
        this.lastCol = null;
        this.scheduledRenders = {};
        this.scheduledOffBlockRenders = {};
        this.wrapper = wrapper || document.createElement('div');
        const _container = document.createElement('div');
        this._container = _container;
        _container.tabIndex = 0; // Make div focusable
        _container.style.width = '100%';
        _container.style.height = '100%';
        _container.style.display = 'flex';
        _container.style.flexDirection = 'column';
        // _container.style.maxHeight = 'calc(100vh - 40px)';
        this.maxRows = options.maxRows || null;
        this.maxCols = options.maxCols || null;
        console.log('maxrows,cols', this.maxRows, this.maxCols)
        if (options.toolbar !== false) {
            this.toolbar = new Toolbar();
            _container.appendChild(this.toolbar.container);
        }
        if (options.formulaBar != false) {
            this.formulaBar = new FormulaBar();
            _container.appendChild(this.formulaBar.container);
        }
        // _container.innerHTML += header;
        _container.insertAdjacentHTML('beforeend', `
        <div class="grid-container">
            <div class="corner-cell"></div>
            <div class="header-container"></div>
            <div class="row-number-container"></div>
            <div class="selection-layer"></div>
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
        // this.headerContainer.style.height = `${this.headerRowHeight}px`;
        this.headerRowHeight = 0;
        this.rowNumberWidth =0;
        if (options.cellHeaders !== false) {
        this.headerRowHeight = this.cellHeight || 30;
        this.rowNumberWidth = 42;
        this.headerContainer.style.lineHeight = `${this.headerRowHeight}px`;
        this.selectionLayer.style.top = `${this.headerRowHeight}px`;
        this.selectionLayer.style.left = `${this.rowNumberWidth}px`;
        this.rowNumberContainer.style.width = `${this.rowNumberWidth}px`;
        this.rowNumberContainer.style.lineHeight = `${this.headerRowHeight}px`;
            this.cornerCell.style.width = `${this.rowNumberWidth}px`;
            this.cornerCell.style.height = `${this.headerRowHeight}px`;
            this.cornerCell.style.marginTop = `-${this.headerRowHeight + 1}px`; // -1 for border
        }
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
        this.probe = document.createElement('div');
        this.probe.style.position = 'absolute';
        // this.probe.style.display = 'none';
        this.probe.style.visibility = 'hidden';
        this.probe.style.width = '10px';
        this.probe.style.height = '10px';
        this.probe.style.borderRadius = '5px';
        // this.probe.style.background = 'red';
        this.selectionLayer.appendChild(this.probe);

        this.initRender();
        this.data = null;
        this.parser = null;
        // if (!this.restoreSave()) {
            this.setData(new SparseGrid(), options.initialCells);
        // }
        this.initialCells = options.initialCells;
        // this.intervalSetRandomData();
    }

    intervalSetRandomData() {
        if (!this.initialCells) return;
        setInterval(() => {
            for(let cell of this.initialCells) {
                if (!cell.text || (
                    !isNaN(cell.text) &&
                        !Number.isNaN(parseFloat(cell.text))
                        && !Number.isInteger(parseFloat(cell.text)))
                ) {
                    let mul = 1;
                    if (Math.random() > .8) mul = -1;
                    this.setText(cell.row,cell.col, (Math.random()*10*mul).toFixed(3));
                    this.renderCell(cell.row,cell.col);
                }
            }
        }, 1500)
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
            if (overrides[key] == null) continue;
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
                this.renderCell(row,col,false);
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
        this._container.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Copy selected cells to clipboard
        this._container.addEventListener('copy', (e) => {
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
            e.clipboardData!.setData('json/pasteData', JSON.stringify({
                srcCell: {row: startRow, col: startCol},
                configs: this.getSelectedCellDataSparse(),
                merges: this.getMergesInRange(this.selectionBoundRect)
            }));
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
                // document.execCommand('paste');
            } else if (action === 'cut') {
                document.execCommand('copy');
                this.clearSelectedCells();
            }
        })
        this._container.addEventListener('paste', (e) => {
            if (this.editingCell) return;
            // this.handlePaste(e.clipboardData!.getData('text/plain'));
            this.handlePasteData(e.clipboardData!.getData('json/pasteData'));
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
            if (this.formulaBar) {
                this.formulaBar.textarea.value = e.target.value;
            }
        }
        this.toolbar?.onAction(async (action: string, value?: any) => {
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
                const c = selectedCells[0];
                if (c?.row == null) return;
                const fontSize = this.getCell(c.row, c.col)?.fontSize || '12';
                this.toolbar?.set('fontSize', fontSize.toString());
            } else if (action === 'Shrink Font') {
                const selectedCells = this.getSelectedCells();
                const cells = [];
                for (let vcell of selectedCells) {
                    const cell = this.getCell(vcell.row, vcell.col);
                    if (cell.fontSize == null) {
                        cell.fontSize = 12;
                    }
                    cell.fontSize--;
                    cells.push(cell);
                }
                this.rerenderCells(cells);
                const c = selectedCells[0];
                if (c?.row == null) return;
                const fontSize = this.getCell(c.row, c.col)?.fontSize || '12';
                this.toolbar?.set('fontSize', fontSize.toString());
            } else if (action === 'Bold') {
                const selectedCells = this.getSelectedCells();
                const cells = [];
                for (let vcell of selectedCells) {
                    const cell = this.getCell(vcell.row, vcell.col);
                    cell.bold = !cell.bold;
                    cells.push(cell);
                }
                this.rerenderCells(cells);
            } else if (action === 'Italic') {
                const selectedCells = this.getSelectedCells();
                const cells = [];
                for (let vcell of selectedCells) {
                    const cell = this.getCell(vcell.row, vcell.col);
                    cell.italic = !cell.italic;
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
            } else if (action === 'backgroundColor') {
                const selectedCells = this.getSelectedCells();
                const cells = [];
                for (let vcell of selectedCells) {
                    const cell = this.getCell(vcell.row, vcell.col);
                    this.setCell(cell.row, cell.col, 'backgroundColor', value);
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

        // for (let [row, col] of deletions) {
        //     this.renderCell(row, col);
        // }
        this.rerenderCells(deletions);
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

    handlePasteData(text: string) {
        let pasteData;
        try {
            pasteData = JSON.parse(text);
        } catch {}
        const changes = [];
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
        const destCell = {row: startRow, col: startCol};
        const srcCell = pasteData.srcCell;
        const offsetRow = destCell.row-srcCell.row;
        const offsetCol = destCell.col-srcCell.col;
        const configs = pasteData.configs;
        for (let config of configs) {
            config.row = config.row + offsetRow;
            config.col = config.col + offsetCol;
            changes.push({
                row: config.row,
                col: config.col,
                prevData: Object.assign({}, this.getCell(config.row,config.col)),
                changeKind: 'valchange'
            });
            this.putCellObj(config.row, config.col, config);
            this.renderCell(config.row, config.col);
        }
        for(let merge of pasteData.merges) {
            const newMerge = {...merge};
            newMerge.startRow = newMerge.startRow + offsetRow;
            newMerge.endRow = newMerge.endRow + offsetRow;
            newMerge.startCol = newMerge.startCol + offsetCol;
            newMerge.endCol = newMerge.endCol + offsetCol;
            this.mergeSelectedCells(newMerge, false);
            changes.push({ changeKind: 'merge', bounds: { ...newMerge } });
        }
        if (changes.length > 0) {
            this.recordChanges(changes);
        }
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
                if (row <= this.totalRowBounds && col <= this.totalColBounds) {
                    changes.push({
                        row,
                        col,
                        prevData: Object.assign({}, this.getCell(row,col)),
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
            const { row, col, previousValue, changeKind, prevData } = change;
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
                redoChanges.push({ row, col, prevData: Object.assign({}, this.getCell(row,col)), previousValue: this.getCellText(row, col), newValue: previousValue, changeKind: 'valchange' });
                // Revert the cell to its previous value
                this.putCellObj(row,col, prevData);
                // this.setCell(row, col, 'text', previousValue);
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

    rerenderCellsForce(arr: any) {
        for (let cell of arr) {
            this.putCellObj(cell.row, cell.col, cell);
            this.renderCell(cell.row, cell.col);
        }

        // this.rerenderMerges(arr);
    }
    rerenderCells(arr: any) {
        for (let cell of arr) {
            let row, col;
            if (Array.isArray(cell)) {
                row = cell[0]; col = cell[1];
            } else {
                row = cell.row; col = cell.col;
            }
            this.renderCell(row, col, false);
        }

        // this.rerenderMerges(arr);
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
            const { row, col, newValue, previousValue, changeKind, prevData } = change;
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
                undoChanges.push({ row, col, prevData: Object.assign({}, this.getCell(row,col)), previousValue: this.getCellText(row, col), newValue, changeKind: 'valchange' });
                // Apply the new value to the cell
                this.putCellObj(row,col,prevData)
                // this.setCell(row, col, 'text', previousValue);
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

    applyBorder(border: any) {
        const selectedCells = this.getSelectedCellsOrVirtual();
        console.log('selected cells', selectedCells)
        for(let cell of selectedCells) {
            cell.border = addBorder(cell.border, border);
        }
        this.rerenderCellsForce(selectedCells);
        // this.setCells(selectedCells, type, value);
    }

    openFormatMenu() {
        const { win, addListener } = launchFormatMenu();
        addListener((type: string, value: string) => {
            if (type === 'border-apply') {
                this.applyBorder(parseInt(value));
            } else {
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, type, value);
            }
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
        else if (key === 'k' && e.ctrlKey) {
            if (this.editingCell) return;
            console.log({
                cellHeight: this.cellHeight,
                cellWidth: this.cellWidth,
                mergedCells: this.mergedCells,
                heightOverrides: Object.assign({}, this.heightOverrides),
                widthOverrides: Object.assign({}, this.widthOverrides),
                gridlinesOn: this.gridlinesOn,
                initialCells: this.data.getAllCells()
            });
            // data = this.data.
            e.preventDefault();
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
        } else if (key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright' || key === 'enter' || key === 'tab') {
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
        this.lastDirKey = e.key;
        const deltas: any = {
            'ArrowUp': [-1, 0], 'ArrowDown': [1, 0], 'ArrowLeft': [0, -1], 'ArrowRight': [0, 1], 'Enter': e.shiftKey ? [-1, 0] : [1,0],
            'Tab': e.shiftKey ? [0, -1] : [0, 1]
        }
        const curMerge = this.getMerge(this.selectionEnd.row, this.selectionEnd.col);
        let row = this.selectionEnd.row + deltas[e.key][0];
        let col = this.selectionEnd.col + deltas[e.key][1];
        const merge = this.getMerge(row, col);
        const corner = [
            row > this.selectionStart.row ? 'b' : 't',
            col > this.selectionStart.col ?  'r' : 'l'
        ];
        if (e.shiftKey) {
            // TODO: do in less bruteforce way
            const prevRect = JSON.stringify(this.selectionBoundRect);
            if (e.key === 'ArrowUp' || (e.key === 'Enter')) {
                let curRect;
                while (row > 0) {
                    curRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    row--;
                }
            }
            else if (e.key === 'ArrowDown') {
                let curRect;
                while (row < this.totalRowBounds) {
                    curRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    row++;
                }
            }
            else if (e.key === 'ArrowLeft' || (e.key === 'Tab')) {
                let curRect;
                while (col > 0) {
                    curRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    col--;
                }
            }
            else if (e.key === 'ArrowRight') {
                let curRect;
                while (col < this.totalColBounds) {
                    curRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    col++;
                }
            }
        } else if (merge && merge === curMerge) {
            if (e.key === 'ArrowUp') { row = merge.startRow - 1; }
            else if (e.key === 'ArrowDown' || e.key === 'Enter') { row = merge.endRow + 1; }
            else if (e.key === 'ArrowLeft') { col = merge.startCol - 1; }
            else if (e.key === 'ArrowRight' || e.key === 'Tab') { col = merge.endCol + 1; }
        }
        row = Math.max(0, row);
        col = Math.max(0, col);
        if (e.shiftKey || arrows.has(e.key)) {
            this.lastCol = col;
        } else if (e.key === 'Enter') {
            col = this.lastCol;
        }
        row = Math.min(row, this.totalRowBounds);
        col = Math.min(col, this.totalColBounds);
        if (e.shiftKey && e.key !== 'Enter') this.selectionEnd = { row, col };
        this.selectCell({ row, col, continuation: e.shiftKey && !['Enter', 'Tab'].includes(e.key) });
        if (this.selectedCell) {
            this.selectedCell.appendChild(this.probe);
            this.probe.style.top = '';
            this.probe.style.left = '';
            this.probe.style.bottom = '';
            this.probe.style.right = '';
            if (arrows.has(e.key) && e.shiftKey) {
                this.probe.style.width = `${this.getCellWidth(col)+20}px`;
                this.probe.style.height = `${this.getCellHeight(row)+20}px`;
                corner.forEach(side => {
                    if (side === 't') { this.probe.style.top = `${-20 - this.headerRowHeight}px`; }
                    else if (side === 'b') { this.probe.style.bottom = '-20px'; }
                    else if (side === 'l') { this.probe.style.left = `${-20 - this.rowNumberWidth}px`; }
                    else if (side === 'r') { this.probe.style.right = '-20px'; }
                });
                scrollIntoView(this.probe, {
                    scrollMode: 'if-needed',
                    block: 'nearest',
                    inline: 'nearest',
                });
            } else {
                let w = this.selectedCell.getBoundingClientRect().width+50;
                let h = this.selectedCell.getBoundingClientRect().height+40;
                this.probe.style.width = `${w+this.rowNumberWidth}px`;
                this.probe.style.height = `${h+this.headerRowHeight}px`;
                this.probe.style.left = `-${(w/4)+this.rowNumberWidth}px`;
                this.probe.style.top = `-${(h/4)+this.headerRowHeight}px`;
                scrollIntoView(this.probe, {
                    scrollMode: 'if-needed',
                    block: 'nearest',
                    inline: 'nearest',
                });
            }
        }
    }
    inVisibleBounds(row: number, col: number) {
        const { row: visStartRow, col: visStartCol } = this.getTopLeftBounds();
        const { row: visEndRow, col: visEndCol } = this.getBottomRightBounds();
        return row >= visStartCol && row <= visEndRow &&
            col >= visStartCol && col <= visEndCol;
    }
    getSelectedCells() {
        if (!this.selectionBoundRect) return [];
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
        const cells = this.data.getCellsForce(startRow, startCol, endRow, endCol).filter((cell: {row:number,col:number}) => this.isValid(cell.row, cell.col));
        return cells;
    }
    getSelectedCellsOrVirtual() {
        if (!this.selectionBoundRect) return [];
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
        const cells = this.data.getCellsForce(startRow, startCol, endRow, endCol).filter((cell: {row:number,col:number}) => this.isValid(cell.row, cell.col));
        return cells;
    }
    getSelectedCellDataSparse() {
        const cells: any = [];
        if (!this.selectionBoundRect) return cells;
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
        for(let i = startRow; i <= endRow; i++) {
            for(let j = startCol; j <= endCol; j++) {
                if (this.data.has(i,j)) {
                    cells.push(this.getCell(i,j));
                }
            }
        }
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
    get shouldDrawGridlines() {
        return this.gridlinesOn && this.quality() !== 'performance';
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
            } else if (e.key === 'Tab') {
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
    putCellObj(row: number, col: number, obj: any) {
        if (!obj) return;
        // if (!this.data.has(row, col)) {
            this.data.set(row, col, obj);
        // }
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
        this.recordChanges([{ row, col, prevData: Object.assign({}, this.getCell(row,col)), previousValue: this.getCellText(row, col), newValue: this.editInput.value, changeKind: 'valchange' }]);
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
        const blocks: any = [];
        const blockSet = new Set();
        for (let i = merge.startRow; i <= merge.endRow; i++) {
            for (let j = merge.startCol; j <= merge.endCol; j++) {
                const block = this.getBlockOrSubBlock(i, j);
                if (!block) continue;
                if (blockSet.has(block)) continue;
                blockSet.add(block);
                blocks.push([block,[i,j]]);
            }
        }
        return blocks;
        return blockSet;
    }

    cancelCellEdit() {
        this.editInput.style.display = 'none';
        this.editingCell = null;
        this.editInput.onblur = null;
        this.editInput.onkeydown = null;
        this.onSelectionChange();
        this._container.focus();
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
        this._container.focus();
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
            let x = e.clientX;
            x = x - this._container.getBoundingClientRect().x;
            let y = e.clientY;
            y = y - this._container.getBoundingClientRect().y;
            const { row, col } = this.getCellFromEvent(e);
            this.lastCol = col;
            this.showContextMenu(x, y, row, col);
            return;
        }
        if (e.button !== 0) return;
        this.handleSelectionMouseDown(e);
    }

    handleSelectionMouseDown(e: any) {
        const { row, col }: {row: number, col: number} = this.getCellFromEvent(e);
        this.lastCol = col;
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
            this.selectionLayer.appendChild(this.probe)
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
            let x = e.clientX;
            x = x - this._container.getBoundingClientRect().x;
            this.draggingHeader.el.style.left = `${scrollLeft + x - 8}px`;
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
            const scrollLeft = this.container.scrollLeft;
            let x = e.clientX;
            x = x - this._container.getBoundingClientRect().x;
            const scrollTop = this.container.scrollTop;
            const rect = this.container.getBoundingClientRect();
            this.probe.style.right = `0px`;
            this.probe.style.bottom = `0px`;
            this.probe.style.width = `${this.getCellWidth(col)+20}px`;
            this.probe.style.height = `${this.getCellHeight(row)+20}px`;
            const probeRect = this.probe.getBoundingClientRect();
            this.probe.style.left = `${scrollLeft + x - this.rowNumberWidth - (probeRect.width / 2)}px`;
            this.probe.style.top = `${scrollTop + e.clientY - this.headerRowHeight - rect.y - (probeRect.height / 2)}px`;
            if (this.atEndWidth()) {
                this.probe.style.left = `${scrollLeft-30}px`;
            }
            if (this.atEndHeight()) {
                this.probe.style.top = `${scrollTop}px`;
            }
            scrollIntoView(this.probe, {
                scrollMode: 'if-needed',
                block: 'nearest',
                inline: 'nearest',
            });
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
            let x = e.clientX;
            x = x - this._container.getBoundingClientRect().x;
            const diff = (scrollLeft + x) - this.getWidthOffset(col + 1, true);
            
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
        let x = Math.max(0, (this.rowNumberWidth + 8) - scrollLeft) - rect.left + scrollLeft - this.rowNumberWidth; // 50 for row numbers
        let y = (this.headerRowHeight + 8) - rect.top + scrollTop - this.headerRowHeight;
        // console.log(x,y)
        x = scrollLeft;
        y = scrollTop;
        // console.log(scrollLeft,scrollTop)
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
        let row = this.bsearch(this.heightAccum, y + this.headerRowHeight) - 1;

        row = Math.min(row+1, this.totalRowBounds);
        col = Math.min(col+1, this.totalColBounds);

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
            row: Math.min(row, this.totalRowBounds),
            col: Math.min(col, this.totalColBounds)
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
        if (this.formulaBar) {
            this.formulaBar.input.value = ref;
            this.formulaBar.textarea.value = this.getTrueValue(row,col);
        }
        const fontSize = this.getCell(row, col)?.fontSize || '12';
        this.toolbar?.set('fontSize', fontSize.toString());
        const fontFamily = this.getCell(row, col).fontFamily || 'Arial';
        this.toolbar?.set('fontFamily', fontFamily);
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
        if (this.options.cellHeaders === false) {
            let totalWidth = this.rowNumberWidth;
            for (let col: any = 0; col <= this.totalColBounds; col++) {
                const width = this.getColWidth(col);
                totalWidth += width;
            };
            this.headerContainer.style.width = `${totalWidth + 10}px`;
            this.headerContainer.style.height = '1px';
            this.headerContainer.style.position = 'absolute';
            this.headerContainer.style.background = 'transparent';
            return;
        }
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
        // const extra = (this.maxCols && this.totalColBounds === this.maxCols-1) ? 0 : 10;
        const extra = 10;
        this.headerContainer.style.width = `${totalWidth + extra}px`;
    }

    createRowNumber(label: string) {
        const el = document.createElement('div');
        el.className = 'row-number';
        // el.textContent = label;
        el.innerHTML = `<div>${label}</div>`
        return el;
    }

    renderRowNumbers() {
        if (this.options.cellHeaders === false) {
            let totalHeight = 0;
            for (let row: any = 0; row <= this.totalRowBounds; row++) {
                totalHeight += this.rowHeight(row);
            }
            // this.totalHeight = totalHeight;
            this.rowNumberContainer.style.height = `${totalHeight + 20}px`;
            this.rowNumberContainer.style.width = '1px';
            this.rowNumberContainer.style.position = 'absolute';
            this.rowNumberContainer.style.background = 'transparent';
            return;
        }
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
        // const extra = (this.maxRows && this.totalRowBounds === this.maxRows-1) ? 0 : 20;
        const extra = 20;
        this.rowNumberContainer.style.height = `${totalHeight + extra}px`; // extra pixels fixes slight alignment issue on scroll
    }

    get totalRowBounds() {
        let bounds = this.heightAccum?.length || this.blockRows;
        if (this.maxRows) bounds = Math.min(bounds, this.maxRows-1);
        return bounds;
    }
    get totalColBounds() {
        let bounds = this.widthAccum?.length || this.blockCols;
        if (this.maxCols) bounds = Math.min(bounds, this.maxCols-1);
        return bounds;
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

    atEndWidth() {
        if (!this.maxCols) return false;
        if (!this.selectionEnd) return false;
        return this.selectionEnd.col >= this.maxCols - 1;
    }
    atEndHeight() {
        if (!this.maxRows) return false;
        if (!this.selectionEnd) return false;
        return this.selectionEnd.row >= this.maxRows - 1;
    }

    handleScroll() {
        const updateVisHeight = (this.container.clientHeight + this.container.scrollTop) >= (this.container.scrollHeight - 150);
        const updateVisWidth = (this.container.clientWidth + this.container.scrollLeft) >= (this.container.scrollWidth - 150);
        if (updateVisHeight || updateVisWidth) {
            console.log('SCROLL UPDATE VIS HEIGHT OR WIDTH')
            this.updateGridDimensions();
            this.renderRowNumbers();
            this.renderHeaders();
            // this.forceRerender();
            this.updateVisibleGrid();
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
        // console.log('visiblerange:', [visStartRow,visStartCol],[visEndRow,visEndCol])
    }

    updateVisibleGrid(force = false) {

        const padding = this.padding;
        const maxBlockRows = Math.floor(this.totalRowBounds / this.blockRows);
        const maxBlockCols = Math.floor(this.totalColBounds / this.blockCols);

        this.calculateVisibleRange();

        // Determine which blocks we need to render
        const neededBlocks = new Set();
        const startBlockRow = Math.max(0, Math.floor(this.visibleStartRow / this.blockRows) - padding);
        let endBlockRow = Math.min(maxBlockRows, Math.floor((this.visibleEndRow - 1) / this.blockRows));
        const startBlockCol = Math.max(0, Math.floor(this.visibleStartCol / this.blockCols) - padding);
        let endBlockCol = Math.min(maxBlockCols, Math.floor((this.visibleEndCol - 1) / this.blockCols));
        // console.log('endblock', [endBlockRow,endBlockCol])
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

        // Round positions in device pixels so the container aligns with integer
        // canvas pixel sizes and avoids sub-pixel gaps between blocks.
        const dpr = this.effectiveDevicePixelRatio();
        const leftDp = Math.round(left * dpr);
        const topDp = Math.round(top * dpr);
        const styleLeft = leftDp / dpr;
        const styleTop = topDp / dpr;

        block.blockContainer.style.left = `${styleLeft}px`;
        block.blockContainer.style.top = `${styleTop}px`;
        block.blockContainer.style.display = 'block';

        // block.left = left;
    }

    positionSubBlock(block: any, i: number) {
        if (i === 0) return;

        // Calculate vertical position (top)
        const dpr = this.effectiveDevicePixelRatio();
        if (i === 1 || i === 3) {
            const leftCss = Math.round(block.parentBlock.subBlocks[0].styleWidth * dpr) / dpr;
            block.canvas.style.left = `${leftCss}px`;
        }
        if (i >= 2) {
            const topCss = Math.round(block.parentBlock.subBlocks[0].styleHeight * dpr) / dpr;
            block.canvas.style.top = `${topCss}px`;
        }
    }

    createBlock(blockRow: number, blockCol: number) {
        // Calculate block boundaries
        const startRow = blockRow * this.blockRows;
        let endRow = Math.min(startRow + this.blockRows);
        if (this.maxRows) endRow = Math.min(endRow, this.maxRows);
        const startCol = blockCol * this.blockCols;
        let endCol = Math.min(startCol + this.blockCols);
        if (this.maxCols) endCol = Math.min(endCol, this.maxCols);

        const blockContainer = document.createElement('div');
        // blockContainer.id = `${blockRow},${blockCol}`;
        blockContainer.className = 'canvas-block-container';

        const createCanvas = (idx: number | null = null) => {
            // const canvas = this.pool.pop() || document.createElement('canvas');
            const canvas = document.createElement('canvas');
            canvas.className = 'canvas-block';
            // canvas.id = `canvas-${blockRow},${blockCol}${idx != null ? '__' + idx : ''}`;
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

        // this.calculateBlockDimensionsContainer(block);
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
        // Compute integer canvas pixel sizes to avoid gaps between adjacent blocks
        let widthSum = 0;
        for (let col = block.startCol; col < block.endCol; col++) {
            widthSum += this.getColWidth(col);
        }
        let widthDp = Math.round(widthSum * scaleFactor);
        const styleWidth = widthDp / scaleFactor;

        // Calculate block height based on rows (in device pixels)
        let heightDp = Math.round((this.heightAccum[block.endRow] - this.heightAccum[block.startRow]) * scaleFactor);
        const styleHeight = heightDp / scaleFactor;


        // console.log(styleHeight, block.index)

        // Set canvas dimensions (use integer device-pixel sizes)
        block.canvas.width = widthDp;
        block.canvas.height = heightDp;
        block.canvas.style.width = `${styleWidth}px`;
        block.canvas.style.height = `${styleHeight}px`;

        block.styleHeight = styleHeight;
        block.styleWidth = styleWidth;
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
            const cell = this.getCellOrMerge(row,col);
        // check not in bounds
            const srcblock = this.getBlockOrSubBlock(row,col);
            const mergeStartBlock = this.getBlockOrSubBlock(cell.row,cell.col);
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
    setGridlinesCtx(ctx: any, bgc: any) {
        // console.log('bgc:', bgc)
        if (bgc) {
            ctx.strokeStyle = bgc;
            return;
        }
        ctx.fillStyle = bgc || '#333333';
        ctx.strokeStyle = `hsl(0,0%,88%)`;
    }
    scale(val: number) {
        return Math.round(val * this.effectiveDevicePixelRatio());
    }
    scalex(val: number) {
        return val * this.effectiveDevicePixelRatio();
    }
    scalec(val: number) {
        return Math.ceil(val * this.effectiveDevicePixelRatio());
    }
    scalef(val: number) {
        return Math.floor(val * this.effectiveDevicePixelRatio());
    }

    // Scale a rectangle to device pixels and round edges so that fills/strokes align
    // precisely with gridlines. Returns device-pixel integer coords and sizes.
    scaleRect(x: number, y: number, width: number, height: number) {
        const dpr = this.effectiveDevicePixelRatio();
        const l = Math.round(x * dpr);
        const t = Math.round(y * dpr);
        const r = Math.round((x + width) * dpr);
        const b = Math.round((y + height) * dpr);
        return { l, t, w: Math.max(0, r - l), h: Math.max(0, b - t) };
    }
    setBorStroke(ctx: any) {
        ctx.strokeStyle = 'black';
    }
    setGridLineStroke(ctx: any) {
        ctx.strokeStyle = '#dddddd';
    }
    setClearStroke(ctx: any) {
        ctx.strokeStyle = 'white';
    }
    strokeLine(ctx: any, x1: number, y1: number, x2: number, y2: number) {
        ctx.beginPath();
        ctx.moveTo(x1 + 0.5, y1 + 0.5);
        ctx.lineTo(x2 + 0.5, y2 + 0.5);
        ctx.stroke();
    }
    renderleftBorder(ctx: any, row: number, col: number, fromBlockRender: boolean) {
        const cell = this.getCellOrMerge(row,col);
        const border = cell?.border;
        let left, top, width, height;
        ({ left, top, width, height } = this.getCellCoordsCanvas(cell.row, cell.col));
        const rect = this.scaleRect(left, top, width, height);
        const hasLeft = hasBorderStr(border, 'left') || hasBorderStr(this.getCellOrMerge(cell.row, cell.col-1)?.border, 'right');
        if (hasLeft) {
            this.setBorStroke(ctx);
            this.strokeLine(ctx, rect.l, rect.t, rect.l, rect.t + rect.h);
        } else if (!fromBlockRender) {
            if (this.shouldDrawGridlines) { this.setGridLineStroke(ctx); } else { this.setClearStroke(ctx); }
            this.strokeLine(ctx, rect.l, rect.t, rect.l, rect.t + rect.h);
        }
    }
    // drawborders
    renderBorders(ctx: any, row: number, col: number, fromBlockRender: boolean) {
        // return;
        const cell = this.getCellOrMerge(row,col);
        const border = cell?.border;
        ctx.save();
        ctx.lineWidth = 1;
        let left, top, width, height;
        ({ left, top, width, height } = this.getCellCoordsCanvas(row, col));
        const rect = this.scaleRect(left, top, width, height);

        // left border
        const hasLeft = hasBorderStr(border, 'left') || hasBorderStr(this.getCellOrMerge(cell.row, cell.col-1)?.border, 'right');
        if (hasLeft) {
            this.setBorStroke(ctx);
            this.strokeLine(ctx, rect.l, rect.t, rect.l, rect.t + rect.h);
        } else if (!fromBlockRender) {
            if (this.getCellOrMerge(cell.row, cell.col-1)?.backgroundColor) {

            } else {
                if (this.shouldDrawGridlines) { this.setGridLineStroke(ctx); } else { this.setClearStroke(ctx); }
                this.strokeLine(ctx, rect.l, rect.t, rect.l, rect.t + rect.h);
            }

            // todo: improve this logic, instead of above, calc right borders on cells abutting to the left
        }
        // top border
        const hasTop = hasBorderStr(border, 'top') || hasBorderStr(this.getCellOrMerge(cell.row-1, cell.col)?.border, 'bottom');
        if (hasTop) {
            this.setBorStroke(ctx);
            this.strokeLine(ctx, rect.l, rect.t, rect.l + rect.w, rect.t);
        } else if (!fromBlockRender) {
            if (this.getCellOrMerge(cell.row-1, cell.col)?.backgroundColor) {

            } else {
                if (this.shouldDrawGridlines) { this.setGridLineStroke(ctx); } else { this.setClearStroke(ctx); }
                this.strokeLine(ctx, rect.l, rect.t, rect.l + rect.w, rect.t);
            }

            // calc bottom borders on cells abutting to the top
        }

        // right border
        const hasRight = hasBorderStr(border, 'right') || hasBorderStr(this.getCellOrMerge(cell.row, cell.col+1)?.border, 'left');
        if (hasRight) {
            this.setBorStroke(ctx);
            this.strokeLine(ctx, rect.l + rect.w, rect.t, rect.l + rect.w, rect.t + rect.h);
        } else if (!fromBlockRender) {
            if (this.getCellOrMerge(cell.row, cell.col+1)?.backgroundColor) {

            } else {
                if (this.shouldDrawGridlines) { this.setGridLineStroke(ctx); } else { this.setClearStroke(ctx); }
                this.strokeLine(ctx, rect.l + rect.w, rect.t, rect.l + rect.w, rect.t + rect.h);
            }

            // calc left borders on cells abutting to the right
        }

        // bottom border
        const hasBottom = hasBorderStr(border, 'bottom') || hasBorderStr(this.getCellOrMerge(cell.row+1, cell.col)?.border, 'top');
        if (hasBottom) {
            this.setBorStroke(ctx);
            this.strokeLine(ctx, rect.l, rect.t + rect.h, rect.l + rect.w, rect.t + rect.h);
        } else if (!fromBlockRender) {
            if (this.getCellOrMerge(cell.row+1, cell.col)?.backgroundColor) {

            } else {
                if (this.shouldDrawGridlines) { this.setGridLineStroke(ctx); } else { this.setClearStroke(ctx); }
                this.strokeLine(ctx, rect.l, rect.t + rect.h, rect.l + rect.w, rect.t + rect.h);
            }

            // calc top borders on cells abutting to the bottom
        }

        ctx.restore();
    }

    getCtx(row: number,col:number) {
        let block = this.getBlockOrSubBlock(row, col);
        if (!block) return;
        return block?.canvas.getContext('2d');
    }

    immediateRenderCell(row: any, col: any, fromBlockRender: boolean) {
        if (!this.isValid(row,col)) return;

        let block = this.getBlockOrSubBlock(row, col);
        if (!block) return;
        let ctx = block?.canvas.getContext('2d');
        let left, top, width, height;
        // ctx.fillStyle = '#333333';
        
        
        this.renderCellBackground(ctx, row, col);
        this.renderBorders(ctx,row,col,fromBlockRender);
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
            
            this.renderCellText(ctx, row, col);
            if (dependencyTree[row]?.[col]) {
                for (let childRow in dependencyTree[row][col]) {
                    for (let childCol in dependencyTree[row][col][childRow]) {
                        this.renderCell(Number(childRow), Number(childCol));
                    }
                }
            }
        }
    }
    immedateOffBlockRender(row: any, col: any, fromBlockRender: boolean,block:any) {
        // if (!this.isValid(row,col)) return;
        // console.log(row,col)
        // let block = this.getBlockOrSubBlock(row, col);
        if (!block) return;
        try {
            this.getCellCoordsCanvas(row,col);
        } catch {
            return;
        }
        let ctx = block?.canvas.getContext('2d');

        this.renderCellBackground(ctx, row, col);
        this.renderBorders(ctx,row,col,fromBlockRender);
        this.clearElRegistry(row,col);
        this.renderCellText(ctx, row, col);
    }

    getCellsInMerge(merge: any) {
        const cells = [];
        for (let row = merge.startRow; row <= merge.endRow; row++) {
            for (let col = merge.startCol; col <= merge.endCol; col++) {
                cells.push(this.getCell(row,col));
            }
        }
        return cells;
    }

    immediateRenderAll = () => {
        for(let key in this.scheduledRenders) {
            const [row,col,fromBlockRender] = this.scheduledRenders[key];
            this.immediateRenderCell(row,col,fromBlockRender);
            delete this.scheduledRenders[key];
        }
        for(let key in this.scheduledOffBlockRenders) {
            const [row,col,fromBlockRender,block] = this.scheduledOffBlockRenders[key];
            this.immedateOffBlockRender(row,col,fromBlockRender,block);
            delete this.scheduledOffBlockRenders[key];
        }
        this.renderQueued = false;
    }

    renderCell(row: any, col: any, fromBlockRender?: boolean) {
        if (this.maxRows && row > this.maxRows || this.maxCols && col > this.maxCols) return;
        // return;
        // this.immediateRenderCell(...arguments)
        // schedules a render
        // const br = this.scheduledRenders[`${row},${col}`]?.[2];
        this.scheduledRenders[`${row},${col}`] = [row,col,fromBlockRender];
        const merge = this.getMerge(row,col);
        if (merge) {
            const startBlock = this.getBlockOrSubBlock(merge.startRow,merge.startCol);
            for (let block of this.getBlocksInMerge(merge)) {
                if (block[0] === startBlock) continue;
                // console.log(row,col)
                this.scheduledOffBlockRenders[`${block[1][0]},${block[1][1]}`] =
                    [block[1][0],block[1][1],fromBlockRender,block[0]];
            }
        }
        if (!this.renderQueued) {
            this.renderQueued = true;
            requestAnimationFrame(this.immediateRenderAll)
        }
    }

    scalerZoom() {
        return devicePixelRatio;
    }

    renderGridlines(block: any, ctx: any) {
        let y;
        let x = 0;
        if (this.gridlinesOn && this.quality() !== 'performance') {
            ctx.save();
            const dpr = this.effectiveDevicePixelRatio();
            for (let row = block.startRow; row < block.endRow; row++) {
                // Align stroke to half-pixel so 1px lines render sharply
                y = Math.round((this.heightAccum[row] - this.heightAccum[block.startRow]) * dpr) + 0.5;
                ctx.beginPath();
                ctx.moveTo(0.5, y);
                ctx.lineTo(block.canvas.width - 0.5, y);
                ctx.stroke();
            }
            // draw col grid lines
            for (let col = block.startCol; col < block.endCol; col++) {
                const colWidth = this.getColWidth(col);
                // draw col gridlines
                const xCoord = Math.round(x * dpr) + 0.5;
                ctx.beginPath();
                ctx.moveTo(xCoord, 0.5);
                ctx.lineTo(xCoord, block.canvas.height - 0.5);
                ctx.stroke();
                x += colWidth;
            }
            ctx.restore();
        }
    }

    setBlockCtx(ctx: any) {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333333';
        // const scaler = 88;
        // ctx.strokeStyle = `hsl(0,0%,88%)`;
        ctx.strokeStyle = '#dddddd';
        ctx.lineWidth = 1;
        ctx.font = this.getFontString();
    }

    renderBlock(block: any, calcDimensions = false) {
        // console.log([block.startRow,block.startCol],[block.endRow,block.endCol])
        if (calcDimensions) {
            this.calculateBlockDimensions(block);
            this.positionSubBlock(block, block.index);
        }
        const ctx = block.canvas.getContext('2d');

        this.applyRenderingQuality(ctx);

        this.setBlockCtx(ctx);

        this.renderGridlines(block, ctx);

        for (let col = block.startCol; col < block.endCol; col++) {
            for (let row = block.startRow; row < block.endRow; row++) {
                this.renderCell(row,col, true);
            }
        }
    }
    // renderMergesOnBlock(block: any, ctx: any) {
    //     const merges: Array<Rect> = this.getMergesInRange(block);
    //     for(let merge of merges) {
    //         const row = merge.startRow, col = merge.startCol;
    //         this.renderCell(row,col,block,ctx);
    //     }
    // }
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
        if (!this.data.has(row, col) || !this.data.get(row, col)) return { row, col };
        const cell = this.data.get(row, col);
        cell.row = row; cell.col = col; // bug: inserting can change row/col
        return cell;
    }
    getCellOrMerge(row: number, col: number) {
        const merge = this.getMerge(row, col);
        if (merge) return this.getCell(merge.startRow, merge.startCol);
        return this.getCell(row,col);
    }
    getCellText(row: number, col: number) {
        return this.getCell(row, col)?.text || '';
    }
    getCellTextAlign(row: number, col: number) {
        return this.getCell(row, col)?.textAlign;
    }

    // renderbackground
    renderCellBackground(ctx: any, row: number, col: number) {
        const cell = this.getCellOrMerge(row,col);

        if (cell?.backgroundColor != null) {
            ctx.save();
            ctx.fillStyle = cell.backgroundColor || 'white';
            const c = this.getCellCoordsCanvas(row,col);
            const { l, t, w, h } = this.scaleRect(c.left, c.top, c.width, c.height);
            ctx.fillRect(l+1, t+1, w, h);
            ctx.restore();
        } else {
            ctx.save();
            ctx.fillStyle = cell.backgroundColor || 'white';
            const c = this.getCellCoordsCanvas(row,col);
            const { l, t, w, h } = this.scaleRect(c.left, c.top, c.width, c.height);
            ctx.fillRect(l+1, t+1, w-1, h-1);
            ctx.restore();
        }
    }

    renderCellText(ctx: any, row: number, col: number, _text = '') {
        let left, top, width, height;
        ({ left, top, width, height } = this.getCellCoordsCanvas(row, col));
        const cell = this.getCellOrMerge(row,col);
        row = cell.row, col = cell.col;
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
        } else if (isNumeric(cell.text) && cell.text < 0) {
            ctx.fillStyle = 'red';
        }
        ctx.font = this.getFontString(row, col);
        if (this.getCell(row, col)?.textBaseline != null) {
            ctx.textBaseline = this.getCell(row, col).textBaseline;
        }
        ctx.beginPath();
        let textX = left;
        const textAlign = this.getCellTextAlign(row, col) || 'left';
        if (textAlign !== 'left') {
            if (textAlign === 'center') {
                textX += width / 2;
            } else if (textAlign === 'right') {
                textX += width - 4;
            }
            ctx.textAlign = this.getCellTextAlign(row, col);
        } else {
            textX += 4;
        }
        ctx.rect((left+1.4) * devicePixelRatio, (top+1.4) * devicePixelRatio, (width-2.8) * devicePixelRatio, (this.rowHeight(row)-1) * devicePixelRatio); // Adjust y position based on your text baseline
        ctx.clip();
        ctx.fillText(text, (textX) * devicePixelRatio, ((top + this.rowHeight(row) / 2)+1) * devicePixelRatio);
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
            fontSize = this.getCell(row, col).fontSize*devicePixelRatio;
        }
        let bold, italic, fontFamily = 'Arial';
        if (row != null && col != null) {
            bold = this.getCell(row, col).bold;
            italic = this.getCell(row, col).italic;
            fontFamily = this.getCell(row, col).fontFamily || 'Arial';
        }
        let fontString = '';
        if (bold) fontString += 'bold ';
        if (italic) fontString += 'italic ';

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
        block.blockContainer.remove();
        // block.blockContainer.parentNode.removeChild(block.blockContainer);
    }
}