function createUuid() {
    let _id = 1;
    return function () {
        return _id++;
    }
}
const uuid = createUuid();
export default class SparseGrid {
    constructor() {
        this._data = [];           // {row: {col: value}}
        this._colCounts = [];      // {col: count}
        this._topRow = Infinity;
        this._bottomRow = -Infinity;
        this._leftCol = Infinity;
        this._rightCol = -Infinity;
        this._totalValues = 0;
        this._totalRows = 0;       // Track distinct rows with data
        this._totalCols = 0;       // Track distinct columns with data
        this._valueCount = 0;
    }

    save() {
        const state = {
            // Store data as arrays for compactness
            d: Object.keys(this._data).map(row => [
                Number(row),
                Object.keys(this._data[row]).map(col => [
                    col === 'count' ? col : Number(col),
                    this._data[row][col]
                ])
            ]),
            // Store counts as arrays for compactness
            cc: Object.entries(this._colCounts).map(([col, count]) => [Number(col), count]),
            // Store boundaries
            tr: this._topRow,
            br: this._bottomRow,
            lc: this._leftCol,
            rc: this._rightCol,
            // Store totals
            tv: this._totalValues,
            trow: this._totalRows,
            tcol: this._totalCols
        };
        return JSON.stringify(state);
    }

    restore(json) {
        const state = JSON.parse(json);

        // Clear current state
        this.clear();

        // Rebuild data structure
        state.d.forEach(([row, cols]) => {
            this._data[row] = [];
            cols.forEach(([col, value]) => {
                this._data[row][col] = value;
            });
        });

        state.cc.forEach(([col, count]) => {
            this._colCounts[col] = count;
        });

        // Restore boundaries and totals
        this._topRow = state.tr;
        this._bottomRow = state.br;
        this._leftCol = state.lc;
        this._rightCol = state.rc;
        this._totalValues = state.tv;
        this._totalRows = state.trow;
        this._totalCols = state.tcol;

        return this;
    }

    // Set a value at a specific row and column
    setCellProperty(row, col, property, value) {
        const cell = this.get(row, col);
        if (!cell._id) cell._id = uuid();
        cell[property] = value;
        this.set(row, col, cell);
    }

    setRowSize(row, size) {
        if (!this._data[row]) return;
        this._data[row].size = size;
    }
    incrementRowSize(row) {
        if (!this._data[row]) return;
        this._data[row].size++;
    }
    decrementRowSize(row) {
        if (!this._data[row]) return;
        this._data[row].size--;
    }
    set(row, col, value) {
        if (!Number.isInteger(row) || !Number.isInteger(col)) {
            throw new Error('Coordinates must be integers');
        }

        const isNewRow = !this._data[row];
        const isNewCell = isNewRow || !Object.hasOwn(this._data[row], col);
        const isNewCol = isNewCell && !this._colCounts[col];

        if (isNewRow) {
            this._data[row] = [];
            this.setRowSize(row, 0);
            this._totalRows++;

            // Update row boundaries
            if (row < this._topRow) this._topRow = row;
            if (row > this._bottomRow) this._bottomRow = row;
        }

        if (isNewCell) {
            this.incrementRowSize(row);
            this._totalValues++;

            if (isNewCol) {
                this._colCounts[col] = 0;
                this._totalCols++;
            }
            this._colCounts[col]++;

            // Update column boundaries
            if (col < this._leftCol) this._leftCol = col;
            if (col > this._rightCol) this._rightCol = col;
        }

        this._data[row][col] = value;
        if (!value._id) value._id = uuid();
        return isNewCell;
    }

    decrementColSize(col) {
        this._colCounts[col]--;
        if (this._colCounts[col] <= 0) delete this._colCounts[col];
    }
    incrementColSize(col) {
        if (!this._colCounts[col]) this._colCounts[col] = 0;
        this._colCounts[col]++;
    }

    deleteRow(row) {
        const rowObj = this._data[row];
        if (rowObj) {
            for (let col in rowObj) {
                this.decrementColSize(col);
            }
            this._totalRows--;
        };
        this._data.splice(row, 1);
        this._recalculateBoundaries();
        return rowObj;
    }

    addRow(row, data = []) {
        data = data || [];
        for (let col in data) {
            this.incrementColSize(col);
        }
        if (data.length > 0) this._totalRows++;
        this._data.splice(row, 0, data);
        this._recalculateBoundaries();
        return null;
    }

    addCol(col, data = []) {
        data = data || [];
        for (let row in this._data) {
            if (row === 'count') continue;
            this._data[row].splice(col, 0, undefined);
            delete this._data[row][col];
            if (row in data) {
                this._data[row][col] = data[row];
                this.incrementRowSize(row);
            }
        }
        if (data.length > 0) this._totalCols++;
        this._recalculateBoundaries();
        return null;
    }

    getCol(col) {
        const colData = [];
        for (let row in this._data) {
            if (row === 'count') continue;
            if (col in this._data[row]) {
                colData[row] = this._data[row][col];
            }
        }
        return colData;
    }

    deleteCol(col) {
        const colData = this.getCol(col);
        const colCount = this._colCounts[col];
        colData.size = colCount;
        if (this._colCounts[col]) {
            this._totalCols--;
        }
        for (let row in this._data) {
            if (row === 'count') continue;
            if (this.has(row, col)) {
                this.decrementColSize(col);
            }
            this._data[row].splice(col, 1);
        }
        this._colCounts.splice(col, 1); // shift colcounts
        this._recalculateBoundaries();
        return colData;
    }

    delete(row, col) {
        if (!this.has(row, col)) {
            return false;
        }

        delete this._data[row][col];
        this.decrementRowSize(row);
        this._colCounts[col]--;
        this._totalValues--;

        // Check if row became empty
        if (this._data[row].size === 0) {
            delete this._data[row];
            this._totalRows--;
        }

        // Check if column became empty
        if (this._colCounts[col] === 0) {
            delete this._colCounts[col];
            this._totalCols--;
        }

        let boundariesChanged = false;
        if (row === this._topRow || row === this._bottomRow) {
            boundariesChanged = true;
        }
        if (col === this._leftCol || col === this._rightCol) {
            boundariesChanged = true;
        }

        if (boundariesChanged) {
            this._recalculateBoundaries();
        }

        return true;
    }

    _recalculateBoundaries() {
        if (this.totalRows === 0) {
            this._topRow = Infinity;
            this._bottomRow = -Infinity;
            this._leftCol = Infinity;
            this._rightCol = -Infinity;
            return;
        }

        let minRow = Infinity;
        let maxRow = -Infinity;
        let minCol = Infinity;
        let maxCol = -Infinity;

        for (let row in this._data) {
            row = parseInt(row);
            if (row < minRow) minRow = row;
            if (row > maxRow) maxRow = row;
            for (let col in this._data[row]) {
                col = parseInt(col);
                if (col < minCol) minCol = col;
                if (col > maxCol) maxCol = col;
            }
        }

        this._topRow = minRow;
        this._bottomRow = maxRow;
        this._leftCol = minCol;
        this._rightCol = maxCol;
    }

    get(row, col) {
        if (!this._data[row] || !Object.hasOwn(this._data[row], col)) {
            return { row, col };
        }
        return this._data[row][col];
    }

    has(row, col = null) {
        if (col == null) return Object.hasOwn(this._data, row);
        return Object.hasOwn(this._data, row) && Object.hasOwn(this._data[row], col);
    }

    deleteCells(coordinates) {
        let deletedCount = 0;
        let boundaryChanged = false;
        const affectedRows = {};

        // First pass: perform deletions
        for (const [row, col] of coordinates) {
            if (!Number.isInteger(row) || !Number.isInteger(col)) continue;

            if (this.has(row, col)) {
                delete this._data[row][col];
                this.decrementRowSize(row);
                this._colCounts[col]--;
                deletedCount++;
                affectedRows[row] = true;

                if (col === this._leftCol || col === this._rightCol) {
                    boundaryChanged = true;
                }
            }
        }

        // Second pass: clean empty rows
        for (const row in affectedRows) {
            if (this._data[row].size === 0) {
                delete this._data[row];
                const numRow = Number(row);
                if (numRow === this._topRow || numRow === this._bottomRow) {
                    boundaryChanged = true;
                }
            }
        }

        this._totalValues -= deletedCount;
        if (boundaryChanged) {
            this._recalculateBoundaries();
        }

        return deletedCount;
    }

    // Get count of cells in a specific row
    getRowCount(row) {
        return this._data[row].size || 0;
    }

    // Get all non-empty rows with their counts
    getRowCounts() {
        return Object.fromEntries(
            Object.entries(this._data).map(([row, data]) => [Number(row), data.size])
        );
    }

    deleteCellsArea(startRow, startCol, endRow, endCol) {
        const [minRow, maxRow] = [Math.min(startRow, endRow), Math.max(startRow, endRow)];
        const [minCol, maxCol] = [Math.min(startCol, endCol), Math.max(startCol, endCol)];
        let deletedCount = 0;
        let boundariesChanged = false;

        // We need to collect rows first to avoid modifying while iterating
        const rowsToProcess = [];
        for (const row in this._rows) {
            if (row >= minRow && row <= maxRow) {
                rowsToProcess.push(row);
            }
        }

        for (const row of rowsToProcess) {
            const rowArr = this._rows[row];

            // Collect columns to delete
            const colsToDelete = [];
            for (const col in rowArr) {
                if (col >= minCol && col <= maxCol) {
                    colsToDelete.push(col);
                }
            }

            // Delete the collected columns
            for (const col of colsToDelete) {
                delete rowArr[col];
                this.decrementRowSize(row);
                this._colCounts[col]--;
                deletedCount++;

                if (col == this._leftCol || col == this._rightCol) {
                    boundariesChanged = true;
                }
            }

            // Clean empty rows
            if (this._data[row].size === 0) {
                delete this._data[row];
                this._totalRows--;
                boundariesChanged = true;
            }
        }

        this._valueCount -= deletedCount;
        if (boundariesChanged) {
            this._recalculateBoundaries();
        }

        return deletedCount;
    }

    getCells(startRow, startCol, endRow, endCol) {
        const cells = [];
        const [minRow, maxRow] = [Math.min(startRow, endRow), Math.max(startRow, endRow)];
        const [minCol, maxCol] = [Math.min(startCol, endCol), Math.max(startCol, endCol)];

        // Get and sort rows in range
        const rows = Object.keys(this._data)
            .map(Number)
            .filter(row => row >= minRow && row <= maxRow)

        for (const row of rows) {
            // Get and sort columns in range
            const cols = Object.keys(this._data[row])
                .map(Number)
                .filter(col => col >= minCol && col <= maxCol)

            for (const col of cols) {
                cells.push({
                    row,
                    col,
                    value: this._data[row][col]
                });
            }
        }

        return cells;
    }

    // Accessors
    get topRow() { return this._topRow === Infinity ? null : this._topRow; }
    get bottomRow() { return this._bottomRow === -Infinity ? null : this._bottomRow; }
    get leftCol() { return this._leftCol === Infinity ? null : this._leftCol; }
    get rightCol() { return this._rightCol === -Infinity ? null : this._rightCol; }
    get totalRows() { return this._totalRows; }       // Rows with at least one cell
    get totalColumns() { return this._totalCols; }    // Columns with at least one cell
    get totalValues() { return this._totalValues; }
    get rowCount() {
        return this._topRow !== Infinity && this._bottomRow !== -Infinity
            ? this._bottomRow - this._topRow + 1
            : 0;
    }
    get colCount() {
        return this._leftCol !== Infinity && this._rightCol !== -Infinity
            ? this._rightCol - this._leftCol + 1
            : 0;
    }
    get valueCount() { return this._valueCount; }

    get allDimensions() {
        return {
            topRow: this.topRow,
            bottomRow: this.bottomRow,
            leftCol: this.leftCol,
            rightCol: this.rightCol,
            rowCount: this.rowCount,
            colCount: this.colCount,
            totalValues: this.totalValues
        }
    }

    clear() {
        this._data = [];
        this._topRow = Infinity;
        this._bottomRow = -Infinity;
        this._leftCol = Infinity;
        this._rightCol = -Infinity;
        this._valueCount = 0;
    }

    forEach(callback) {
        let counter = 0;
        for (let row in this._data) {
            if (row === 'count') continue;
            for (let col in this._data[row]) {
                callback(this._data[row][col], row, col, counter++);
            }
        }
    }
}