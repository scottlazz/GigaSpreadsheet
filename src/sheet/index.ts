
import SparseGrid, {uuid} from '../packages/sparsegrid';
import ExpressionParser from '../packages/expressionparser';
import { launchFormatMenu } from './windows/format';
import { createLineChart } from './graphs/linechart';
// import FinancialSubscriber from '../packages/financial/index';
import { dependencyTree, tickerReg, shiftDependenciesDown, shiftDependenciesRight, shiftDependenciesUp, shiftDependenciesLeft, removeDependents } from "../packages/dependencytracker";
import { hasBorderStr, addBorder, isNumeric } from "./utils";
import { shiftTextRefs, rowColToRef } from "./shiftops";
import { Rect, GigaSheetTypeOptions, CellCoordsRect } from './interfaces';
import ContextMenu from './components/contextmenu';
import { FormulaBar } from './components/formulaBar';
import { Toolbar } from './components/toolbar';
import scrollIntoView from '../packages/scrollIntoView';
import { parseXML, CopyHandler, PasteHandler } from './copypaste';
import { Block } from './components/block';
import HistoryManager from './history';
import KeyboardHandler from './keyboardHandler';
import GridMetrics from './gridmetrics';
import RowNumbers from './rownumbers';
import HeaderIdentifiers from './headeridentifiers';

export default class Sheet {
    wrapper: HTMLElement;
    container: HTMLElement;
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

    activeBlocks: Map<any, any>;
    mergedCells: Rect[];
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
    scheduledRenders: {[key: string]: any};
    scheduledOffBlockRenders: {[key: string]: any};
    renderQueued: boolean;
    maxRows: number | null;
    maxCols: number | null;
    initialCells: any;
    widthMaxByCol: any;
    needDims: any;
    dimUpdatesQueued: any;
    measureCanvas: any;
    maxWidthInCol: any;
    historyManager: HistoryManager;
    keyboardHandler: KeyboardHandler;
    copyHandler: CopyHandler;
    pasteHandler: PasteHandler;
    metrics: GridMetrics;
    rowNumbers: RowNumbers;
    headerIdentifiers: HeaderIdentifiers;
    freeze: any;
    _selectionBoundRects: any;
    events: any;
    prevSelectionBoundRect: any;
    constructor(wrapper: HTMLElement, options: GigaSheetTypeOptions | any = {}) {
        this.events = {};
        this.toolbar = null;
        this._selectionBoundRects = [];
        this.renderQueued = false;
        this.dimUpdatesQueued = false;
        this.options = options;
        this.formulaBar = null;
        this.lastCol = null;
        this.scheduledRenders = {};
        this.needDims = {};
        this.scheduledOffBlockRenders = {};
        this.measureCanvas = document.createElement('canvas');
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
        if (options.toolbar !== false) {
            this.toolbar = new Toolbar();
            _container.appendChild(this.toolbar.container);
        }
        if (options.formulaBar != false) {
            this.formulaBar = new FormulaBar(this);
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
        this.cornerCell = _container.querySelector('.corner-cell')!;
        this.selectionLayer = _container.querySelector('.selection-layer')!;
        this.formatButton = _container.querySelector('.format-button')!;
        this.lastDevicePixelRatio = window.devicePixelRatio;
        this.lastBlockCanvases = this.blockCanvases();

        // Configuration
        this.cellWidth = options.cellWidth ?? 64;
        this.cellHeight = options.cellHeight ?? 20;
        this.blockRows = options.blockRows ?? 28;  // Max rows per canvas block
        this.blockCols = options.blockCols ?? 30;  // Max cols per canvas block
        this.paddingBlocks = options.paddingBlocks ?? 1; // Extra blocks to render around visible area
        this.padding = options.padding || 1; // number of adjacent blocks to render
        this.headerRowHeight = 0;
        this.rowNumberWidth = 0;
        if (options.cellHeaders !== false) {
            this.headerRowHeight = this.cellHeight || 30;
            this.rowNumberWidth = 42;
            this.selectionLayer.style.top = `${this.headerRowHeight}px`;
            this.selectionLayer.style.left = `${this.rowNumberWidth}px`;
            this.cornerCell.style.width = `${this.rowNumberWidth}px`;
            this.cornerCell.style.height = `${this.headerRowHeight}px`;
            this.cornerCell.style.marginTop = `-${this.headerRowHeight + 1}px`; // -1 for border
        }
        if (options.subscribeFinance) {
            // this.subscribeFinance();
        }

        // State
        this.historyManager = new HistoryManager(this);
        this.keyboardHandler = new KeyboardHandler(this);
        this.copyHandler = new CopyHandler(this);
        this.pasteHandler = new PasteHandler(this);
        this.metrics = new GridMetrics(this);
        this.rowNumbers = new RowNumbers(this);
        this.headerIdentifiers = new HeaderIdentifiers(this);
        this.mergedCells = options.mergedCells || [];
        this.heightOverrides = this.buildOverrides(options.heightOverrides);
        this.widthOverrides = this.buildOverrides(options.widthOverrides);
        this.maxWidthInCol = {};
        this.widthMaxByCol = {};
        this.freeze = {col: 4};
        this.gridlinesOn = options.gridlinesOn ?? true;
        this.activeBlocks = new Map(); // Track active canvas blocks
        // window.activeBlocks = this.activeBlocks;
        // window.renderBlock = this.renderBlock.bind(this);
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
        this.probe.style.display = 'none';
        // this.probe.style.display = 'none';
        this.probe.style.visibility = 'hidden';
        this.probe.style.width = '10px';
        this.probe.style.height = '10px';
        this.probe.style.borderRadius = '5px';
        // this.probe.style.background = 'red';
        this.selectionLayer.appendChild(this.probe);

        this.data = null;
        this.parser = null;
        this.initialCells = options.initialCells;
        // if (!this.restoreSave()) {
            this.initRender();
            this.setData(new SparseGrid(), options.initialCells);
            // }
            // this.intervalSetRandomData();
            // setTimeout(() => {

            // })
    }

    intervalSetRandomData() {
        if (!this.initialCells) return;
        setInterval(() => {
            for(let cell of this.initialCells) {
                if (
                    // true
                    !cell.text || (
                    !isNaN(cell.text) &&
                        !Number.isNaN(parseFloat(cell.text))
                        && !Number.isInteger(parseFloat(cell.text)))
                ) {
                    let mul = 1;
                    if (Math.random() > .8) mul = -1;
                    this.setCell(cell.row,cell.col, 'text', (Math.random()*10*mul).toFixed(3));
                    // const _cell = this.getCell(cell.row,cell.col);
                    // _cell.text = (Math.random()*10*mul).toFixed(3);
                    // this.putCellObj(cell.row,cell.col,Object.assign({}, _cell))
                    this.renderCell(cell.row,cell.col);
                }
            }
        }, 1500)
    }

    initRender() {
        this.updateGridDimensions();
        this.headerIdentifiers.renderHeaders();
        this.rowNumbers.renderRowNumbers();
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
        // const f = new FinancialSubscriber();
        // f.listenYA(["API", "^GSPC", "^DJI", "^IXIC", "^RUT", "CL=F", "GC=F", "NVDA", "GME", "RKT", "GAP", "BLD", "IBP"]);
        // f.onTick((data: any) => {
        //     const cells = tickerReg[data.id] || {};
        //     for (let key in cells) {
        //         const [row,col] = key.split(',');
        //         this.renderCell(row,col,false);
        //     }
        //     console.log('gigasheet::ontick', data)
        // });
    }

    subscribeEvent = (eventName: string, cb: any) => {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(cb);
    }
    emitEvent = (eventName: string, data?: any) => {
        const cbs = this.events[eventName] || [];
        for (let cb of cbs) {
            cb(data);
        }
    }

    hasEvent = (eventName: string) => {
        return !!this.events[eventName];
    }

    initEventListeners() {
        this.container.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                this.handleScroll()
            });
        });

        const resizeObserver = new ResizeObserver(() => {
            this.updateGridDimensions();
            this.metrics.calculateVisibleRange();
            this.rowNumbers.renderRowNumbers();
            this.headerIdentifiers.renderHeaders();

            this.updateVisibleGrid();
            this.updateSelection();
            this.updateRenderingQuality();
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
            this.copyHandler.onCopy(e);
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
            this.setCells(selectedCells, 'ta', textAlign);
        })
        this._container.querySelector('.quick-text-actions-buttons')?.addEventListener('click', async (e: any) => {
            // console.log('clicked align buttons', e.target?.getAttribute('data-align'))
            const action = e.target?.getAttribute('data-action');
            if (action === 'copy') {
                document.execCommand('copy');
            } else if (action === 'paste') {
                const clipboardText = await navigator.clipboard.readText();
                this.pasteHandler.handlePastePlaintext(clipboardText);
                // document.execCommand('paste');
            } else if (action === 'cut') {
                document.execCommand('copy');
                this.clearSelectedCells();
            }
        })
        this._container.addEventListener('paste', (e) => {
            this.pasteHandler.onPaste(e);
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
                this.pasteHandler.handlePastePlaintext(clipboardText);
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
                this.pasteHandler.handlePastePlaintext(clipboardText);
            } else if (action === 'Undo') {
                this.historyManager.undo();
            } else if (action === 'Redo') {
                this.historyManager.redo();
            } else if (action === 'Left align') {
                const textAlign = 'left';
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, 'ta', textAlign);
                const c = selectedCells[0];
                if (c?.row == null) return;
                const value = this.getCell(c.row, c.col)?.ta || 'left';
                this.toolbar?.set('textAlign', value);
            } else if (action === 'Center align') {
                const textAlign = 'center';
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, 'ta', textAlign);
                const c = selectedCells[0];
                if (c?.row == null) return;
                const value = this.getCell(c.row, c.col)?.ta || 'left';
                this.toolbar?.set('textAlign', value);
            } else if (action === 'Right align') {
                const textAlign = 'right';
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, 'ta', textAlign);
                const c = selectedCells[0];
                if (c?.row == null) return;
                const value = this.getCell(c.row, c.col)?.ta || 'left';
                this.toolbar?.set('textAlign', value);
            } else if (action === 'Grow Font') {
                const selectedCells = this.getSelectedCells();
                this.setCellsMutate(selectedCells, (cell: any) => {
                    if (cell.fontSize == null) {
                        cell.fontSize = 12;
                    }
                    cell.fontSize++;
                });
                const c = selectedCells[0];
                if (c?.row == null) return;
                const fontSize = this.getCell(c.row, c.col)?.fontSize || '12';
                this.toolbar?.set('fontSize', fontSize.toString());
            } else if (action === 'Shrink Font') {
                const selectedCells = this.getSelectedCells();
                this.setCellsMutate(selectedCells, (cell: any) => {
                    if (cell.fontSize == null) {
                        cell.fontSize = 12;
                    }
                    cell.fontSize--;
                });
                const c = selectedCells[0];
                if (c?.row == null) return;
                const fontSize = this.getCell(c.row, c.col)?.fontSize || '12';
                this.toolbar?.set('fontSize', fontSize.toString());
            } else if (action === 'Bold') {
                const selectedCells = this.getSelectedCells();
                this.setCellsMutate(selectedCells, (cell: any) => {
                    cell.bold = !cell.bold;
                });
                const c = selectedCells[0];
                if (c?.row == null) return;
                const value = this.getCell(c.row, c.col)?.bold || false;
                this.toolbar?.set('bold', value);
            } else if (action === 'Italic') {
                const selectedCells = this.getSelectedCells();
                this.setCellsMutate(selectedCells, (cell: any) => {
                    cell.italic = !cell.italic;
                });
                const c = selectedCells[0];
                if (c?.row == null) return;
                const value = this.getCell(c.row, c.col)?.italic || false;
                this.toolbar?.set('italic', value);
            } else if (action === 'fontFamily') {
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, 'ff', value);
            } else if (action === 'fontSize') {
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, 'fontSize', value);
            } else if (action === 'backgroundColor') {
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, 'bc', value);
            } else if (action === 'borderShape') {
                const cells = this.getSelectedCellsOrVirtual2D();
                if (value === 'top') {
                    this.setCellsMutate(cells[0], (cell: any) => {
                        if (cell.fontSize == null) {
                            this.setCell(cell.row, cell.col, 'border', addBorder(cell.border, 1 << 2));
                        }
                    });
                } else if (value === 'bottom') {
                    this.setCellsMutate(cells[cells.length-1], (cell: any) => {
                        if (cell.fontSize == null) {
                            this.setCell(cell.row, cell.col, 'border', addBorder(cell.border, 1 << 4));
                        }
                    });
                } else if (value === 'left') {
                    const leftCells = cells.map(row => row[0]);
                    this.setCellsMutate(leftCells, (cell: any) => {
                        if (cell.fontSize == null) {
                            this.setCell(cell.row, cell.col, 'border', addBorder(cell.border, 1 << 1));
                        }
                    });
                } else if (value === 'right') {
                    const rightCells = cells.map(row => row[row.length-1]);
                    this.setCellsMutate(rightCells, (cell: any) => {
                        if (cell.fontSize == null) {
                            this.setCell(cell.row, cell.col, 'border', addBorder(cell.border, 1 << 3));
                        }
                    });
                } else if (value === 'box') {
                    const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
                    this.setCellsMutate(this.getSelectedCellsOrVirtual(), (cell: any) => {
                        let border = cell.border;
                        if (cell.row === startRow) {
                            border = addBorder(border, 1 << 2);
                            this.setCell(cell.row, cell.col, 'border', border);
                        }
                        if (cell.row === endRow) {
                            border = addBorder(border, 1 << 4);
                            this.setCell(cell.row, cell.col, 'border', border);
                        }
                        if (cell.col === startCol) {
                            border = addBorder(border, 1 << 1);
                            this.setCell(cell.row, cell.col, 'border', border);
                        }
                        if (cell.col === endCol) {
                            border = addBorder(border, 1 << 3);
                            this.setCell(cell.row, cell.col, 'border', border);
                        }
                    });
                }
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
        for (let [row, col] of (Object.values(cellsNeedingShift) as any)) {
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
        this.rowNumbers.renderRowNumbers();
        record && this.historyManager.recordChanges([{ changeKind: 'deleteEntireRow', row, rowData, heightOverride }]);
        this.forceRerender();
        if (this.selectionBoundRect) {
            this.selectionBoundRect = this.getBoundingRectCells(this.selectionBoundRect.startRow, this.selectionBoundRect.startCol, this.selectionBoundRect.endRow, this.selectionBoundRect.endCol);
            this.updateSelection();
        }
    }

    deleteCol(col: any = null, record = true) {
        col = col != null ? col : this.selectionStart?.col;
        if (col == null) return;
        const cellsNeedingShift = shiftDependenciesLeft(col);
        for (let [row, col] of (Object.values(cellsNeedingShift) as any)) {
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
        this.headerIdentifiers.renderHeaders();
        
        record && this.historyManager.recordChanges([{ changeKind: 'deleteEntireCol', col, colData, widthOverride }]);
        this.forceRerender();
        this.selectionBoundRect = this.getBoundingRectCells(this.selectionBoundRect.startRow, this.selectionBoundRect.startCol, this.selectionBoundRect.endRow, this.selectionBoundRect.endCol);
        this.updateSelection();
    }

    shiftHeightOverrides(pivot: any, amount = 1) {
        if (amount === -1) {
            this.heightOverrides.splice(pivot, 1);
        } else if (amount === 1) {
            if (pivot < this.heightOverrides.length) {
                this.heightOverrides.splice(pivot, 0, undefined);
                delete this.heightOverrides[pivot];
            }
        }
    }

    shiftWidthOverrides(pivot: any, amount = 1) {
        if (amount === -1) {
            this.widthOverrides.splice(pivot, 1);
        } else if (amount === 1) {
            if (pivot < this.widthOverrides.length) {
                this.widthOverrides.splice(pivot, 0, undefined);
                delete this.widthOverrides[pivot];
            }
        }
    }

    insertRow(row: any = null, data = null, record = true, heightOverride = null) {
        row = row != null ? row : this.selectionStart?.row;
        if (row == null) return;
        const cellsNeedingShift = shiftDependenciesDown(row);
        for (let [row, col] of (Object.values(cellsNeedingShift) as any)) {
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
        this.rowNumbers.renderRowNumbers();
        record && this.historyManager.recordChanges([{ changeKind: 'insertEntireRow', row }]);
        this.forceRerender();
        if (this.selectionBoundRect) {
            this.selectionBoundRect = this.getBoundingRectCells(this.selectionBoundRect.startRow, this.selectionBoundRect.startCol, this.selectionBoundRect.endRow, this.selectionBoundRect.endCol);
            this.updateSelection();
        }
    }

    insertCol(col: any = null, data = null, record = true, widthOverride = null) {
        col = col != null ? col : this.selectionStart?.col;
        if (col == null) return;
        const cellsNeedingShift = shiftDependenciesRight(col);
        for (let [row, col] of (Object.values(cellsNeedingShift) as any)) {
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
        this.headerIdentifiers.renderHeaders();
        
        record && this.historyManager.recordChanges([{ changeKind: 'insertEntireCol', col }]);
        this.forceRerender();
        if (this.selectionBoundRect) {
            this.selectionBoundRect = this.getBoundingRectCells(this.selectionBoundRect.startRow, this.selectionBoundRect.startCol, this.selectionBoundRect.endRow, this.selectionBoundRect.endCol);
            this.updateSelection();
        }
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
                const obj = { row, col,
                    prevData: Object.assign({}, this.getCell(row, col)),
                    changeKind: 'valchange'
                };
                this.clearElRegistry(row, col);
                deletions.push([row, col]);
                changes.push(obj);
                this.updateDim(row,col);
            }
        }
        this.data.deleteCells(deletions);
        this.historyManager.recordChanges(changes);

        // for (let [row, col] of deletions) {
        //     this.renderCell(row, col);
        // }
        this.rerenderCells(deletions);
        this.onSelectionChange();
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

    recordCellBeforeChange(row: number, col: number, attr?: any) {
        const obj = { row, col,
            prevData: Object.assign({}, this.getCell(row, col)),
            attr,
            changeKind: 'valchange'
        };
        this.historyManager.changes.push(obj);
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
        const cell = this.getCellOrMerge(row, col);
        if (cell.renderType === 'custom') return;
        this.startCellEdit(row, col);
    }

    applyBorder(border: any) {
        const selectedCells = this.getSelectedCellsOrVirtual();
        this.setCellsMutate(selectedCells, (cell: any) => {
            if (cell.fontSize == null) {
                this.setCell(cell.row, cell.col, 'border', addBorder(cell.border, border));
            }
        });
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
        this.keyboardHandler.onKeyDown(e);
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
            this.widthOverrides = this.buildOverrides(save.widthOverrides);
            this.heightOverrides = this.buildOverrides(save.heightOverrides);
            this.mergedCells = save.mergedCells;
            this.gridlinesOn = save.gridlinesOn;
            const g = new SparseGrid();
            g.restore(save.data);
            this.setData(g);
            this.updateGridDimensions();
            this.headerIdentifiers.renderHeaders();
            this.rowNumbers.renderRowNumbers();
            this.updateVisibleGrid(true);
            this.updateSelection();
            return true;
        }
        return false;
    }
    getSelectedCells() {
        if (!this.selectionBoundRect) return [];
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
        const cells = this.data.getCellsForce(startRow, startCol, endRow, endCol).filter((cell: {row:number,col:number}) => this.isNotMergedOver(cell.row, cell.col));
        return cells;
    }
    getSelectedCellsOrVirtual() {
        if (!this.selectionBoundRect) return [];
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
        const cells = this.data.getCellsForce(startRow, startCol, endRow, endCol).filter((cell: {row:number,col:number}) => this.isNotMergedOver(cell.row, cell.col));
        return cells;
    }
    getSelectedCellsOrVirtual2D() {
        if (!this.selectionBoundRect) return [];
        const arr = [];
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
        for(let i = startRow; i <= endRow; i++) {
            const cells = this.data.getCellsForce(i, startCol, i, endCol).filter((cell: {row:number,col:number}) => this.isNotMergedOver(cell.row, cell.col));
            arr.push(cells);
        }
        return arr;
    }
    getSelectedCellsOrVirtualMultiple() {
        if (!this.selectionBoundRect) return [];
        const cells = [];
        for(let rect of this.getSelectionBoundRects()) {
            const { startRow, startCol, endRow, endCol } = rect;
            cells.push(this.data.getCellsForce(startRow, startCol, endRow, endCol).filter((cell: {row:number,col:number}) => this.isNotMergedOver(cell.row, cell.col)));
        }
        return cells;
    }
    getSelectedCellDataSparse() {
        const cells: any = [];
        if (!this.selectionBoundRect) return cells;
        for(let rect of this.getSelectionBoundRects()) {
            const { startRow, startCol, endRow, endCol } = rect;
            for(let i = startRow; i <= endRow; i++) {
                for(let j = startCol; j <= endCol; j++) {
                    if (this.data.has(i,j)) {
                        cells.push(this.getCell(i,j));
                    }
                }
            }
        }
        return cells;
    }
    isNotMergedOver(row:number,col:number) {
        const merge = this.getMerge(row,col);
        if (!merge) return true;
        return merge.startRow == row && merge.startCol == col;
    }
    isMergedOver(row:number,col:number) {
        return !this.isNotMergedOver(row,col);
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
        return Math.max(this.data?.bottomRow  || 0, this.blockRows) + (this.blockRows * this.padding);
    }
    get totalCols() {
        return Math.max(this.data?.rightCol || 0, this.blockCols) + (this.blockCols * this.padding);
    }
    getMerge = (row: number, col: number) =>{
        // Check if the cell is part of a merged range
        return this.mergedCells.find((merged: any) =>
            row >= merged.startRow &&
            row <= merged.endRow &&
            col >= merged.startCol &&
            col <= merged.endCol
        );
    }
    startCellEdit(row: number, col: number, startingValue?: string) {
        if (row < 0 || row > this.totalRowBounds || col < 0 || col > this.totalColBounds) return;
        let left, top, width, height, value;
        ({ left, top, width, height, row, col } = this.metrics.getCellCoordsContainer(row, col));
        const cell = this.getCellOrMerge(row,col);
        value = startingValue != null ? '' : this.getCellText(cell.row, cell.col);

        if (this.options.launchCustomEditor) {
            const customEditor = this.options.launchCustomEditor(cell, { left, top, width, height });
            return;
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
        this.recordCellBeforeChange(row, col, 'text');
        this.setCell(row,col,'text',text);
        this.historyManager.flushChanges();
        this.renderCell(row, col);
    }
    setCell(row: number, col: number, field: string, value: any) {
        const cell = this.getCell(row, col);
        if (!cell) return;
        cell[field] = value;
        if (!this.data.has(row, col)) {
            this.data.set(row, col, cell);
        }
        this.updateDim(row,col);
    }
    putCellObj(row: number, col: number, obj: any) {
        if (!obj) return;
        this.data.set(row, col, obj);
        this.updateDim(row,col);
    }
    setCellsMutate(cells: any, mutator: Function) {
        for (let cell of cells) {
            this.recordCellBeforeChange(cell.row, cell.col);
            mutator(cell);
            this.updateDim(cell.row, cell.col);
            this.renderCell(cell.row, cell.col);
        }
        this.historyManager.flushChanges();
    }
    setCells(cells: any, field: string, value: any) {
        for (let cell of cells) {
            this.recordCellBeforeChange(cell.row, cell.col);
            this.setCell(cell.row, cell.col, field, value);
            this.renderCell(cell.row, cell.col);
        }
        this.historyManager.flushChanges();
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
        this.historyManager.recordChanges([{ row, col, prevData: Object.assign({}, this.getCell(row,col)), changeKind: 'valchange' }]);
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
                const block = this.getSubBlock(i, j);
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
                            block.subBlocks.forEach((subBlock: any) => {
                                subBlock.renderBlock(true);
                            })
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
        this._container.focus();
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

    getSelectionBoundRects() {
        return [...this._selectionBoundRects, this.selectionBoundRect].filter(r => r != null);
    }

    handleSelectionMouseDown(e: any) {
        const { row, col }: {row: number, col: number} = this.getCellFromEvent(e);
        this.lastCol = col;
        if (e.ctrlKey && this.selectionStart) { // start new selection keep old one
            this._selectionBoundRects.push(this.selectionBoundRect);
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
            this._selectionBoundRects = [];
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
        this.updateSelection(true);

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
            let padderOffset = this.headerIdentifiers.renderHeaderPadder.getBoundingClientRect().width;
            if (padderOffset > 0) {
                padderOffset += 42;
            }
            this.draggingHeader.el.style.left = `${scrollLeft + x - 8 - padderOffset}px`;
        } else if (this.draggingRow) {
            const scrollTop = this.container.scrollTop;
            const rect = this.container.getBoundingClientRect();
            // this.draggingRow.el.style.top = `${scrollTop + e.clientY - this.headerRowHeight - rect.y - 5}px`;
            // console.log('dragging', (scrollTop + e.clientY - this.headerRowHeight - rect.y - 5) - this.renderRowNumberPadder.offsetTop);
            const top = (scrollTop + e.clientY - this.headerRowHeight - rect.y - 5) - this.rowNumbers.renderRowNumberPadder.getBoundingClientRect().height;
            this.draggingRow.el.style.top = `${top}px`;
        } else if (this.isSelecting) {
            this.probe.style.display = 'block';
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
            this.probe.style.width = `${this.metrics.getCellWidth(col)+20}px`;
            this.probe.style.height = `${this.metrics.getCellHeight(row)+20}px`;
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
            this.probe.style.display = 'none';
            // this.activeSelection.style.display = 'none';
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
            const diff = (scrollLeft + x) - this.metrics.getWidthOffset(col + 1, true);
            
            const prevOverride = this.widthOverrides[col];
            const change = this.widthOverrides[col] ? this.widthOverrides[col] + diff : this.metrics.getCellWidth(col) + diff;
            if (change <= 1) {
                draggingHeader.el.style.left = draggingHeader.origLeft;
                return;
            }
            this.setWidthOverride(col, change);
            this.historyManager.recordChanges([{ changeKind: 'widthOverrideUpdate', col, value: prevOverride }]);
            this.updateWidthAccum();
            this.headerIdentifiers.renderHeaders();
            this.forceRerender();
            this.updateSelection();
            e.stopPropagation();
        } else if (this.draggingRow) {
            const draggingRow = this.draggingRow;
            const row = this.draggingRow.row;
            this.draggingRow = null;
            const scrollTop = this.container.scrollTop;
            const rect = this.container.getBoundingClientRect();
            const diff = (scrollTop + e.clientY - rect.y) - this.metrics.getHeightOffset(row + 1, true);
            const prevOverride = this.heightOverrides[row];
            const change = this.heightOverrides[row] ? this.heightOverrides[row] + diff : this.metrics.getCellHeight(row) + diff;
            if (change <= 1) {
                draggingRow.el.style.top = draggingRow.origTop;
                return;
            }
            this.setHeightOverride(row, change);
            this.historyManager.recordChanges([{ changeKind: 'heightOverrideUpdate', row, value: prevOverride }]);
            this.updateHeightAccum();
            this.rowNumbers.renderRowNumbers();
            this.forceRerender();
            this.updateSelection();
            e.stopPropagation();
        }
    }

    getCellFromEvent(e: any) {
        const rect = this.container.getBoundingClientRect();
        const scrollLeft = this.container.scrollLeft;
        const scrollTop = this.container.scrollTop;
        // Adjust for header and row numbers
        const x = e.clientX - rect.left + scrollLeft - this.rowNumberWidth;
        const y = e.clientY - rect.top + scrollTop - this.headerRowHeight; // 30 for header

        if (x < 0 || y < 0) return { row: -1, col: -1 };

        let col = this.metrics.bsearch(this.widthAccum, x + this.rowNumberWidth) - 1;
        let row = this.metrics.bsearch(this.heightAccum, y + this.headerRowHeight) - 1;
        return {
            row: Math.min(row, this.totalRowBounds),
            col: Math.min(col, this.totalColBounds)
        };
    }

    mergeSelectedCells(bounds: any = null, recordChanges = true) {
        if (bounds == null && (!this.selectionStart || !this.selectionEnd)) return;
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
        recordChanges && this.historyManager.recordChanges([{ changeKind: 'merge', bounds: { startRow, endRow, startCol, endCol } }]);

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
        recordChanges && this.historyManager.recordChanges([{
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
        const fontFamily = this.getCell(row, col).ff || 'Arial';
        this.toolbar?.set('fontFamily', fontFamily);
        const backgroundColor = this.getCell(row, col).bc || '#FFFFFF';
        this.toolbar?.set('backgroundColor', backgroundColor);
        const textAlign = this.getCell(row, col).ta || 'left';
        this.toolbar?.set('textAlign', textAlign);
        const bold = this.getCell(row, col).bold || false;
        this.toolbar?.set('bold', bold);
        const italic = this.getCell(row, col).italic || false;
        this.toolbar?.set('italic', italic);
        if (this.hasEvent('selectionChange')) {
            if (!this.prevSelectionBoundRect || (
                this.prevSelectionBoundRect.startRow !== this.selectionBoundRect.startRow ||
                this.prevSelectionBoundRect.startCol !== this.selectionBoundRect.startCol ||
                this.prevSelectionBoundRect.endRow !== this.selectionBoundRect.endRow ||
                this.prevSelectionBoundRect.endCol !== this.selectionBoundRect.endCol
            )) {
                this.prevSelectionBoundRect = Object.assign({}, this.selectionBoundRect);
                this.emitEvent('selectionChange',Object.assign({}, this.selectionBoundRect));
            }
        }
    }

    updateSelection(fromKeyInput: boolean = false) {
        this.onSelectionChange();
        if (!this.activeSelection) return;
        // Clear previous selection
        this.activeSelection.innerHTML = '';
        if (!this.selectionHandle) return;
        this.selectionHandle.style.display = 'none';

        if (!this.selectionBoundRect) return;

        let { startRow, startCol, endRow, endCol } = this.selectionBoundRect;

        let left = this.metrics.getWidthOffset(startCol);
        let width = this.metrics.getWidthBetweenColumns(startCol, endCol+1);

        if (!fromKeyInput && (this.visibleEndRow < startRow || this.visibleEndCol < startCol)) {
            this.activeSelection.style.display = 'none';
            // return;
        } else {
            this.activeSelection.style.display = 'block';
        }
        endRow = Math.min(endRow, this.visibleEndRow);
        const top = this.metrics.getHeightOffset(startRow); // Below header
        const height = this.metrics.getHeightBetweenRows(startRow, endRow+1);

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
                const el: HTMLDivElement | null = this.headerIdentifiers.headerContainer.querySelector(`[data-hccol='${col}']`);
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
            const el: HTMLDivElement | null = this.headerIdentifiers.headerContainer.querySelector(`[data-hccol='${i}']`);
            if (!el) continue;
            el.classList.add('col-selected');
            const handle: any = el.nextSibling;
            if (handle) handle.classList.add('handle-col-selected');
        }
        for (let row of this.selectedRows) {
            if (row < startRow || row > endRow) {
                this.selectedRows.delete(row);
                const el: HTMLDivElement | null = this.rowNumbers.rowNumberContainer.querySelector(`[data-rnrow='${row}']`);
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
            const el: HTMLDivElement | null = this.rowNumbers.rowNumberContainer.querySelector(`[data-rnrow='${i}']`);
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

    setData(grid: any = null, initialData: any = null) {
        for(let cell of initialData || []) {
            cell._id = uuid.generate();
        }
        grid = grid || new SparseGrid();
        this.parser = new ExpressionParser(grid);
        this.data = grid;
        if (initialData) {
            this.rerenderCellsForce(initialData);
        }
    }

    createRowNumber(label: string) {
        const el = document.createElement('div');
        el.className = 'row-number';
        // el.textContent = label;
        el.innerHTML = `<div>${label}</div>`
        return el;
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
        // console.log(this.container.clientHeight, this.container.scrollTop, this.container.scrollHeight, updateVisHeight);
        for (
            let row = 0; 
            row < oldHeight - 1 ||
            row % this.blockRows !== 0 || // render full blocks
            row < this.totalRows || // render til bottom row that has data
            // this.heightAccum[this.heightAccum.length - 1] < this.container.scrollTop + this.container.clientHeight + 150 || // render til bottom of visible area
            this.heightAccum[this.heightAccum.length - 1] < this.container.clientHeight + 150 || // render til bottom of visible area
            (updateVisHeight && row < (prevRowBounds + this.blockRows)); // render extra block if near end
            row++
        ) {
            this.heightAccum.push(heightSum += this.heightOverrides[row] ?? this.cellHeight);
        }
    }

    updateWidthAccum() {
        let prevColBounds = this.totalColBounds;
        const oldWidth = this.widthAccum.length;
        this.widthAccum = [this.rowNumberWidth];
        let widthSum = this.rowNumberWidth;
        const updateVisWidth = (this.container.clientWidth + this.container.scrollLeft) >= (this.container.scrollWidth - 150);
        for (
            let col = 0;
            col < oldWidth - 1 ||
            col % this.blockCols !== 0 ||
            col < this.totalCols ||
            this.widthAccum[this.widthAccum.length - 1] < this.container.clientWidth + 150 || // render til right of visible area
            (updateVisWidth && col < (prevColBounds + this.blockCols));
            col++
        ) {
            this.widthAccum.push(widthSum += this.metrics.getColWidth(col));
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
        // this.activeSelection.style.display = 'none';
        // console.log(this.visibleStartRow, this.visibleStartCol, this.visibleEndRow, this.visibleEndCol);
        // if (this.selectionBoundRect) {
        //     if (this.selectionBoundRect.startRow >= this.visibleEndRow) {
        //         this.activeSelection.style.display = 'none';
        //     } else {
        //         this.activeSelection.style.display = 'block';
        //     }

        // }
        if (updateVisHeight || updateVisWidth) {
            console.log('SCROLL UPDATE VIS HEIGHT OR WIDTH')
            this.updateGridDimensions();
            this.metrics.calculateVisibleRange();
            this.rowNumbers.renderRowNumbers();
            this.headerIdentifiers.renderHeaders();
            // this.forceRerender();
            this.updateVisibleGrid();
        } else {
            this.updateGridDimensions();
            this.metrics.calculateVisibleRange();
            this.rowNumbers.renderRowNumbers();
            this.headerIdentifiers.renderHeaders();
            this.updateVisibleGrid();
        }
        this.updateSelection();
    }

    updateVisibleGrid(force = false) {

        const padding = this.padding;
        const maxBlockRows = Math.floor(this.totalRowBounds / this.blockRows);
        const maxBlockCols = Math.floor(this.totalColBounds / this.blockCols);

        this.metrics.calculateVisibleRange();

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
            if (!neededBlocks.has(key)) {
                toRemove.push(key);
                this.releaseBlock(block);
            } else if (force) {
                try {
                    block.subBlocks.forEach((subBlock: any) => {
                        subBlock.renderBlock(true);
                    });
                } catch (err) {
                    toRemove.push(key);
                    this.releaseBlock(block);
                }
            }
        });

        toRemove.forEach((key: any) => this.activeBlocks.delete(key));
        if (toRemove.length > 0) {
            // this.renderHeaders();
            this.rowNumbers.renderRowNumbers();
            this.headerIdentifiers.renderHeaders();
        }
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
                    block.positionBlock();
                    // this.positionBlock(block);
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

        const block = new Block({
            startRow,
            endRow,
            startCol,
            endCol,
            blockRow,
            blockCol,
            blockContainer,
            subBlocks: [],
            count: this.blockCanvases()
        }, this);
        const key = `${blockRow},${blockCol}`;
        this.activeBlocks.set(key, block);

        // Add to DOM if not already present
        if (!blockContainer.parentNode) {
            this.container.appendChild(blockContainer);
        }

        return block;
    }

    effectiveDevicePixelRatio() {
        return devicePixelRatio;
    }

    blockKey(block: any) {
        return `${block.blockRow},${block.blockCol}`;
    }

    getKey(row: number, col: number) {
        return `${row},${col}`;
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

    getSubBlock(row: number, col: number) {
        const parentBlock = this.getBlock(row, col);
        if (!parentBlock) return null;
        if (parentBlock.subBlocks.length === 1) {
            return parentBlock.subBlocks[0];
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
    setBorStroke(ctx: any, borderColor?: string) {
        ctx.strokeStyle = borderColor || 'black';
    }
    setGridLineStroke(ctx: any) {
        ctx.strokeStyle = '#dddddd';
    }
    setClearStroke(ctx: any) {
        ctx.strokeStyle = 'white';
    }
    strokeLine(ctx: any, x1: number, y1: number, x2: number, y2: number) {
        const color = ctx.strokeStyle;
        // ctx.globalCompositeOperation = 'destination-out';
        // ctx.strokeStyle = 'rgba(0,0,0,1)';
        // ctx.beginPath();
        // ctx.moveTo(x1 + 0.5, y1 + 0.5);
        // ctx.lineTo(x2 + 0.5, y2 + 0.5);
        // ctx.stroke();

        // ctx.globalCompositeOperation = 'source-over';
        // ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1 + 0.5, y1 + 0.5);
        ctx.lineTo(x2 + 0.5, y2 + 0.5);
        ctx.stroke();
    }
    getBorder(cell, side: string = 'left') {
        const border = cell?.border;
        if (typeof border === 'string') {
            try {
                const obj = JSON.parse(border);
                return obj[side];
            } catch (e) {
                return null;
            }
        }
        if (typeof border === 'number' && hasBorderStr(border, side)) {
            let borderColor = cell?.borderColor;
            if (typeof borderColor === 'string' && borderColor.startsWith('{')) {
                try {return JSON.parse(borderColor)[side];} catch (e) {}
            } else if (typeof borderColor === 'string') {
                return borderColor;
            }
            return 'black';
        }
    }
    // drawborders
    renderBorders(ctx: any, row: number, col: number, fromBlockRender: boolean) {
        // return;
        const cell = this.getCellOrMerge(row,col);
        ctx.save();
        ctx.lineWidth = 1;
        let left, top, width, height;
        ({ left, top, width, height } = this.metrics.getCellCoordsCanvas(row, col));
        const rect = this.scaleRect(left, top, width, height);

        // left border
        const leftCell = this.getCellOrMerge(cell.row, cell.col-1);
        const leftBorder = this.getBorder(cell, 'left') || this.getBorder(leftCell, 'right')
        //  || cell.bc || leftCell?.bc;
        if (leftBorder) {
            this.setBorStroke(ctx, leftBorder);
            this.strokeLine(ctx, rect.l, rect.t, rect.l, rect.t + rect.h);
        } else if (!fromBlockRender) {
            if (this.getCellOrMerge(cell.row, cell.col-1)?.bc) {

            } else {
                if (this.shouldDrawGridlines) { this.setGridLineStroke(ctx); } else { this.setClearStroke(ctx); }
                this.strokeLine(ctx, rect.l, rect.t, rect.l, rect.t + rect.h);
            }

            // todo: improve this logic, instead of above, calc right borders on cells abutting to the left
        }
        // top border
        const topCell = this.getCellOrMerge(cell.row-1, cell.col);
        const topBorder = this.getBorder(cell, 'top') || this.getBorder(topCell, 'bottom')
        //  || cell.bc || topCell?.bc;
        if (topBorder) {
            this.setBorStroke(ctx, topBorder);
            this.strokeLine(ctx, rect.l, rect.t, rect.l + rect.w, rect.t);
        } else if (!fromBlockRender) {
            if (this.getCellOrMerge(cell.row-1, cell.col)?.bc) {

            } else {
                if (this.shouldDrawGridlines) { this.setGridLineStroke(ctx); } else { this.setClearStroke(ctx); }
                this.strokeLine(ctx, rect.l, rect.t, rect.l + rect.w, rect.t);
            }

            // calc bottom borders on cells abutting to the top
        }

        // right border
        const rightCell = this.getCellOrMerge(cell.row, cell.col+1);
        const rightBorder = this.getBorder(cell, 'right') || this.getBorder(rightCell, 'left')
        //  || cell.bc || rightCell?.bc;
        if (rightBorder) {
            this.setBorStroke(ctx, rightBorder);
            this.strokeLine(ctx, rect.l + rect.w, rect.t, rect.l + rect.w, rect.t + rect.h);
        } else if (!fromBlockRender) {
            if (this.getCellOrMerge(cell.row, cell.col+1)?.bc) {

            } else {
                if (this.shouldDrawGridlines) { this.setGridLineStroke(ctx); } else { this.setClearStroke(ctx); }
                this.strokeLine(ctx, rect.l + rect.w, rect.t, rect.l + rect.w, rect.t + rect.h);
            }

            // calc left borders on cells abutting to the right
        }

        // bottom border
        const bottomCell = this.getCellOrMerge(cell.row+1, cell.col);
        const bottomBorder = this.getBorder(cell, 'bottom') || this.getBorder(bottomCell, 'top')
        //  || cell.bc || bottomCell?.bc;
        if (bottomBorder) {
            this.setBorStroke(ctx, bottomBorder);
            this.strokeLine(ctx, rect.l, rect.t + rect.h, rect.l + rect.w, rect.t + rect.h);
        } else if (!fromBlockRender) {
            if (this.getCellOrMerge(cell.row+1, cell.col)?.bc) {

            } else {
                if (this.shouldDrawGridlines) { this.setGridLineStroke(ctx); } else { this.setClearStroke(ctx); }
                this.strokeLine(ctx, rect.l, rect.t + rect.h, rect.l + rect.w, rect.t + rect.h);
            }

            // calc top borders on cells abutting to the bottom
        }

        ctx.restore();
    }

    getCtx(row: number,col:number) {
        let block = this.getSubBlock(row, col);
        if (!block) return;
        return block?.canvas.getContext('2d');
    }

    getOverlappingRect(rect1: Rect, rect2: Rect): Rect {
        const startRow = Math.max(rect1.startRow, rect2.startRow);
        const startCol = Math.max(rect1.startCol, rect2.startCol);
        const endRow = Math.min(rect1.endRow, rect2.endRow);
        const endCol = Math.min(rect1.endCol, rect2.endCol);

        if (startRow <= endRow && startCol <= endCol) {
            return { startRow, startCol, endRow, endCol };
        }
        return null;
    }

    immediateRenderCell(row: any, col: any, fromBlockRender: boolean) {
        if (this.isMergedOver(row,col)) {
            if (!fromBlockRender) return;
            // only render cells part of this merge once in this block
            const merge = this.getMerge(row,col);
            const _block = this.getSubBlock(row, col);
            if (_block) {
                const rect = this.getOverlappingRect(merge, {startRow: _block.startRow, endRow: _block.endRow-1, startCol: _block.startCol, endCol: _block.endCol-1});
                for(let r = rect.startRow; r <= rect.endRow; r++) {
                    for(let c = rect.startCol; c <= rect.endCol; c++) {
                        delete this.scheduledRenders[this.getKey(r,c)];
                    }
                }
            } else {
                console.log('no block for merge', merge, 'at cell', row, col)
                return;
            }
        }

        const cell = this.getCell(row, col);
        if (cell.renderType === 'custom' && this.options.renderCustomCell) {
            let left, top, width, height, value;
            ({ left, top, width, height, row, col } = this.metrics.getCellCoordsContainer(row, col));
            const customCell = this.options.renderCustomCell(cell, { left, top, width, height });
            return;
        }

        let block = this.getSubBlock(row, col);
        if (!block) return;
        let ctx = block?.canvas.getContext('2d');
        let left, top, width, height;
        // ctx.fillStyle = '#333333';
        
        
        this.renderCellBackground(ctx, row, col);
        this.renderBorders(ctx,row,col,fromBlockRender);
        if (this.getCell(row, col).cellType === 'button') {
            const button = this.getButton(row, col).el;
            ({ left, top, width, height } = this.metrics.getCellCoordsContainer(row, col));
            this.positionElement(button, left, top, width, height);
        } else if (this.getCell(row, col).cellType === 'linechart') {
            const lineChart = this.getLineChart(row, col)?.el;
            ({ left, top, width, height } = this.metrics.getCellCoordsContainer(row, col));
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
    immediateOffBlockRender(row: any, col: any, fromBlockRender: boolean,block:any) {
        if (!block) return;
        try {
            this.metrics.getCellCoordsCanvas(row,col);
        } catch (e) {
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
            this.immediateOffBlockRender(row,col,fromBlockRender,block);
            delete this.scheduledOffBlockRenders[key];
        }
        this.renderQueued = false;
    }
    immediateUpdateDims = () => {
        const ctx = this.measureCanvas.getContext('2d');
        let needsRerender = false;
        let colsNeedingRemax: any = {};
        for(let key in this.needDims) {

            const [row,col] = this.needDims[key];
            const cell = this.getCell(row,col);
            const isCustomRender = cell.renderType === 'custom' && this.options.renderCustomCell;
            if (isCustomRender) {
                delete this.needDims[key];
                continue;
            }
            if (this.getMerge(row,col)) {
                delete this.needDims[key];
                continue;
            }
            if (cell.text && cell.text.length > 3) {
                this.setTextCtx(ctx, row, col);
                const m = ctx.measureText(cell.text);
                const mwidth = (m.width/devicePixelRatio)+5;
                if (this.maxWidthInCol[cell.col]) {
                    if (mwidth > this.maxWidthInCol[cell.col].max) {
                        this.maxWidthInCol[cell.col] = {max: mwidth, row: cell.row};
                        needsRerender = true;
                    } else if (mwidth < this.maxWidthInCol[cell.col].max-50 && // subtract some width so it doesnt resize too much
                        this.maxWidthInCol[cell.col].row === cell.row
                    ) {
                        this.maxWidthInCol[cell.col] = {max: mwidth, row: cell.row};
                        needsRerender = true;
                        colsNeedingRemax[cell.col] = true;
                    }
                } else if (mwidth > this.cellWidth) {
                    this.maxWidthInCol[cell.col] = {max: mwidth, row: cell.row};
                    needsRerender = true;
                }

                cell._dims = {width: mwidth};
            } else {
                if (this.maxWidthInCol[cell.col] && this.maxWidthInCol[cell.col].row === cell.row) {
                    this.maxWidthInCol[cell.col].max = 0;
                    needsRerender = true;
                    colsNeedingRemax[cell.col] = true;
                }
                cell._dims = {width: 0};
            }
            delete this.needDims[key];
        }
        for(let col in colsNeedingRemax) {
            const cells = this.data.getCol(col);
            for(let key in cells) {
                const cell = cells[key];
                if (!this.isNotMergedOver(cell.row,cell.col)) continue;
                if (cell._dims) {
                    if (cell._dims.width > this.maxWidthInCol[cell.col].max) {
                        this.maxWidthInCol[cell.col].max = cell._dims.width;
                        this.maxWidthInCol[cell.col].row = cell.row;
                    }
                }
            }
        }
        this.dimUpdatesQueued = false;
        if (needsRerender) {
            this.updateWidthAccum();
            this.headerIdentifiers.renderHeaders();
            this.forceRerender();
            this.updateSelection();
        }
    }

    updateDim(row: any, col: any) {
        if (!this.isNotMergedOver(row,col)) return;
        if (!this.options?.autosize) return;
        if (col in this.widthOverrides && !this.getCell(row,col)?.ul) return;
        this.needDims[[row,col].toString()] = [row,col];
        if (!this.dimUpdatesQueued) {
            this.dimUpdatesQueued = true;
            requestAnimationFrame(this.immediateUpdateDims);
        }
    }

    renderCell(row: any, col: any, fromBlockRender?: boolean) {
        if (this.maxRows && row > this.maxRows || this.maxCols && col > this.maxCols) return;
        this.scheduledRenders[`${row},${col}`] = [row,col,fromBlockRender];
        const merge = this.getMerge(row,col);
        if (merge) {
            const startBlock = this.getSubBlock(merge.startRow,merge.startCol);
            for (let block of this.getBlocksInMerge(merge)) {
                if (block[0] === startBlock) continue;
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
        el.style.position = 'absolute';
        append && this.container.appendChild(el);
    }
    getCellId(row: number, col: number) {
        return this.getCell(row, col)?._id;
    }
    setElRegistry(row: number, col: number, el: any, type: string) {
        const _id = this.getCellId(row, col);
        if (!_id) return;
        if (this.elRegistry[_id]) this.elRegistry[_id].el.remove();
        this.elRegistry[_id] = { el, type };
    }
    getButton(row: number, col: number) {
        const _id = this.getCellId(row, col);
        if (this.elRegistry[_id] && this.elRegistry[_id].type === 'button') {
            return this.elRegistry[_id];
        } else if (this.elRegistry[_id] && this.elRegistry[_id].type !== 'button') {
            this.elRegistry[_id].el.remove();
        }
        const button: any = document.createElement('button');
        button.textContent = this.getCellText(row, col);
        button.onclick = (e: any) => e.stopPropagation();
        button.ondblclick = (e: any) => e.stopPropagation();
        button.style.zIndex = 1;
        button.style.position = 'absolute';
        button.style.overflow = 'hidden';
        button.style.userSelect = 'none';
        const cell = this.getCellOrMerge(row, col);
        if (cell.fontSize) button.style.fontSize = `${cell.fontSize}px`;
        if (cell.color) button.style.color = `${cell.color}`;
        button.style.userSelect = 'none';
        this.elRegistry[_id] = { type: 'button', el: button };
        return this.elRegistry[_id];
    }
    getLineChart(row: number, col: number) {
        const _id = this.getCellId(row, col);
        if (this.elRegistry[_id] && this.elRegistry[_id].type === 'lineChart') {
            const data = this.elRegistry[_id].data;
            const { width, height } = this.metrics.getWidthHeight(row, col);
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
        const { width, height } = this.metrics.getWidthHeight(row, col);
        const lineChart = createLineChart(data, wrapper, width, height);
        this.elRegistry[_id] = { el: wrapper, lineChart, data, type: 'lineChart' };
        return this.elRegistry[_id];
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

    hasCell(row: number, col: number) {
        return !this.data.has(row, col) || !this.data.get(row, col);
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
        return this.getCell(row, col)?.ta;
    }

    // renderbackground
    renderCellBackground(ctx: any, row: number, col: number) {
        const cell = this.getCellOrMerge(row,col);

        if (cell?.bc != null) {
            ctx.save();
            ctx.fillStyle = cell.bc || 'white';
            const c = this.metrics.getCellCoordsCanvas(row,col);
            const { l, t, w, h } = this.scaleRect(c.left, c.top, c.width, c.height);
            ctx.clearRect(l, t, w, h);
            ctx.fillRect(l, t, w, h);
            ctx.restore();
        } else {
            ctx.save();
            // ctx.fillStyle = cell.bc || 'white';
            const c = this.metrics.getCellCoordsCanvas(row,col);
            const { l, t, w, h } = this.scaleRect(c.left, c.top, c.width, c.height);
            // ctx.fillRect(l+1, t+1, w-1, h-1);
            // ctx.clearRect(l+1, t+1, w-1, h-1);
            // ctx.fillRect(l, t, w, h);
            ctx.clearRect(l, t, w, h);
            ctx.restore();
        }
    }

    setTextCtx(ctx: any, row: number, col: number) {
        const cell = this.getCellOrMerge(row,col);
        if (this.getCellColor(cell.row, cell.col)) {
            ctx.fillStyle = this.getCellColor(cell.row, cell.col);
        } else if (isNumeric(cell.text) && cell.text < 0) {
            ctx.fillStyle = 'red';
        }
        ctx.font = this.getFontString(cell.row, cell.col);
        if (this.getCell(cell.row, cell.col)?.textBaseline != null) {
            ctx.textBaseline = this.getCell(cell.row, cell.col).textBaseline;
        }
        const textAlign = this.getCellTextAlign(cell.row, cell.col) || 'left';
        if (textAlign !== 'left') {
            ctx.textAlign = this.getCellTextAlign(row, col);
        }
    }

    renderCellText(ctx: any, row: number, col: number) {
        let left, top, width, height;
        ({ left, top, width, height } = this.metrics.getCellCoordsCanvas(row, col));
        const cell = this.getCellOrMerge(row,col);
        row = cell.row, col = cell.col;
        const value = this.getCellText(row, col);
        let text = value !== undefined && value !== null ? String(value) : '';
        try {
            removeDependents(row,col);
            text = this.parser.evaluateExpression(text, [row,col]);
        } catch (e) {
            console.warn(e);
            text = text;
        }
        if (text === '') return;
        ctx.save(); // Save the current state

        this.setTextCtx(ctx, row, col);
        let textX = left;
        const textAlign = this.getCellTextAlign(row, col) || 'left';
        if (textAlign !== 'left') {
            if (textAlign === 'center') {
                textX += width / 2;
            } else if (textAlign === 'right') {
                textX += width - 4;
            }
        } else {
            textX += 4;
        }
        ctx.rect((left+1.4) * devicePixelRatio, (top+1.4) * devicePixelRatio, (width-2.8) * devicePixelRatio, (this.metrics.rowHeight(row)-1) * devicePixelRatio); // Adjust y position based on your text baseline
        let region = new Path2D();
        region.rect((left+1.4) * devicePixelRatio, (top+1.4) * devicePixelRatio, (width-2.8) * devicePixelRatio, (this.metrics.rowHeight(row)-1) * devicePixelRatio);
        ctx.clip(region);
        ctx.fillText(text, (textX) * devicePixelRatio, ((top + this.metrics.rowHeight(row) / 2)+1) * devicePixelRatio);
        if (cell.ul && cell._dims) { // TODO fix underlines
            ctx.beginPath();
            ctx.strokeStyle = cell.color || 'black'; // Set underline color
            ctx.lineWidth = cell.fontSize ? cell.fontSize/6 : 2; // Set underline thickness
            const y = ((top + this.metrics.rowHeight(row) / 2)+(cell.fontSize/4)+3) * devicePixelRatio;
            ctx.moveTo((textX) * devicePixelRatio, y);
            ctx.lineTo(((textX) * devicePixelRatio)+(cell._dims.width*devicePixelRatio), y);
            ctx.stroke();
        }
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
            fontFamily = this.getCell(row, col).ff || 'Arial';
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
        if (block.subBlocks.length >= 1) {
            while (block.subBlocks.length >= 1) {
                block.subBlocks.pop();
            }
        }
        block.blockContainer.innerHTML = '';
        block.blockContainer.remove();
        // block.blockContainer.parentNode.removeChild(block.blockContainer);
    }
}
