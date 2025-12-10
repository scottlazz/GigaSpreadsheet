import Sheet from "..";

export default class HistoryManager {
    readonly MAX_HISTORY_SIZE: number;
    undoStack: any;
    redoStack: any;
    sheet: Sheet;
    changes: any[];
    constructor(sheet: Sheet) {
        this.sheet = sheet;
        this.changes = [];
        this.undoStack = [];
        this.redoStack = [];
        this.MAX_HISTORY_SIZE = 100;
    }
    recordChanges(changes: any) {
        this.redoStack = [];

        // Add the change to the undo stack
        this.undoStack.push(changes);

        // Limit the size of the undo stack
        if (this.undoStack.length > this.MAX_HISTORY_SIZE) {
            this.undoStack.shift(); // Remove the oldest change
        }
    }
    flushChanges() {
        this.recordChanges(this.changes);
        this.changes = [];
    }
    undo() {
        if (this.undoStack.length === 0) return; // Nothing to undo

        const changes: any = this.undoStack.pop(); // Get the last change
        const redoChanges = [];
        const updatedCells = [];
        let rerender = false;
        for (const change of changes) {
            const { row, col, previousValue, changeKind, prevData } = change;
            if (changeKind === 'merge') {
                this.sheet.unmergeSelectedCells(change.bounds, false); rerender = true;
                redoChanges.push({ changeKind: 'unmerge', bounds: change.bounds });
            } else if (changeKind === 'unmerge') {
                this.sheet.mergeSelectedCells(change.bounds, false); rerender = true;
                redoChanges.push({ changeKind: 'merge', bounds: change.bounds });
            } else if (changeKind === 'deleteEntireRow') {
                this.sheet.insertRow(change.row, change.rowData, false, change.heightOverride); rerender = true;
                // this.data.addRow(change.row, change.rowData);
                redoChanges.push({ changeKind: 'deleteEntireRow', row: change.row, rowData: change.rowData, heightOverride: change.heightOverride });
            } else if (changeKind === 'deleteEntireCol') {
                this.sheet.insertCol(change.col, change.colData, false, change.widthOverride); rerender = true;
                redoChanges.push({ changeKind: 'deleteEntireCol', col: change.col, colData: change.colData, widthOverride: change.widthOverride });
            } else if (changeKind === 'insertEntireRow') {
                this.sheet.deleteRow(change.row, false); rerender = true;
                redoChanges.push({ changeKind: 'insertEntireRow', row: change.row });
            } else if (changeKind === 'insertEntireCol') {
                this.sheet.deleteCol(change.col, false); rerender = true;
                redoChanges.push({ changeKind: 'insertEntireCol', col: change.col });
            } else if (changeKind === 'widthOverrideUpdate') {
                const prev = this.sheet.widthOverrides[change.col];
                this.sheet.setWidthOverride(change.col, change.value);
                this.sheet.updateWidthAccum();
                this.sheet.headerIdentifiers.renderHeaders();
                rerender = true;
                redoChanges.push({ changeKind: 'widthOverrideUpdate', col: change.col, value: prev });
            } else if (changeKind === 'heightOverrideUpdate') {
                const prev = this.sheet.heightOverrides[change.row];
                this.sheet.setHeightOverride(change.row, change.value);
                this.sheet.updateHeightAccum();
                this.sheet.rowNumbers.renderRowNumbers();
                rerender = true;
                redoChanges.push({ changeKind: 'heightOverrideUpdate', row: change.row, value: prev });
            } else if (changeKind === 'valchange') {
                // Record the current value for redo
                redoChanges.push({ row, col, prevData: Object.assign({}, this.sheet.getCell(row,col)), previousValue: this.sheet.getCellText(row, col), newValue: previousValue, changeKind: 'valchange' });
                // Revert the cell to its previous value
                if (change.attr) {
                    this.sheet.setCell(row, col, change.attr, prevData[change.attr]);
                } else {
                    this.sheet.putCellObj(row,col, prevData);
                }
                updatedCells.push([row, col]);
            } else {
                console.log('UNHANDLED UNDO:', changeKind)
            }
        }
        this.redoStack.push(redoChanges);

        if (rerender) {
            this.sheet.forceRerender();
        } else {
            this.sheet.rerenderCells(updatedCells);
        }
        this.sheet.updateSelection();
    }
    redo() {
        if (this.redoStack.length === 0) return; // Nothing to redo

        const changes = this.redoStack.pop(); // Get the last undone change
        const undoChanges = [];
        const updatedCells = [];
        let rerender = false;
        for (const change of changes) {
            const { row, col, newValue, previousValue, changeKind, prevData } = change;
            if (changeKind === 'unmerge') {
                this.sheet.mergeSelectedCells(change.bounds, false); rerender = true;
                undoChanges.push({ changeKind: 'merge', bounds: change.bounds });
            } else if (changeKind === 'merge') {
                this.sheet.unmergeSelectedCells(change.bounds, false); rerender = true;
                undoChanges.push({ changeKind: 'unmerge', bounds: change.bounds });
            } else if (changeKind === 'deleteEntireRow') {
                this.sheet.deleteRow(change.row, false); rerender = true;
                undoChanges.push({ changeKind: 'deleteEntireRow', row: change.row, rowData: change.rowData, heightOverride: change.heightOverride });
            } else if (changeKind === 'deleteEntireCol') {
                this.sheet.deleteCol(change.col, false); rerender = true;
                undoChanges.push({ changeKind: 'deleteEntireCol', col: change.col, colData: change.colData, widthOverride: change.widthOverride });
            } else if (changeKind === 'insertEntireRow') {
                this.sheet.insertRow(change.row, null, false); rerender = true;
                undoChanges.push({ changeKind: 'insertEntireRow', row: change.row });
            } else if (changeKind === 'insertEntireCol') {
                this.sheet.insertCol(change.col, null, false); rerender = true;
                undoChanges.push({ changeKind: 'insertEntireCol', col: change.col });
            } else if (changeKind === 'widthOverrideUpdate') {
                const prev = this.sheet.widthOverrides[change.col];
                this.sheet.setWidthOverride(change.col, change.value);
                this.sheet.updateWidthAccum();
                this.sheet.headerIdentifiers.renderHeaders();
                rerender = true;
                undoChanges.push({ changeKind: 'widthOverrideUpdate', col: change.col, value: prev });
            } else if (changeKind === 'heightOverrideUpdate') {
                const prev = this.sheet.heightOverrides[change.row];
                this.sheet.setHeightOverride(change.row, change.value);
                this.sheet.updateHeightAccum();
                this.sheet.rowNumbers.renderRowNumbers();
                rerender = true;
                undoChanges.push({ changeKind: 'heightOverrideUpdate', row: change.row, value: prev });
            } else if (changeKind === 'valchange') {
                // Record the current value for undo
                undoChanges.push({ row, col, prevData: Object.assign({}, this.sheet.getCell(row,col)), previousValue: this.sheet.getCellText(row, col), newValue, changeKind: 'valchange' });
                // Apply the new value to the cell
                if (change.attr) {
                    this.sheet.setCell(row, col, change.attr, prevData[change.attr]);
                } else {
                    this.sheet.putCellObj(row,col, prevData);
                }
                updatedCells.push([row, col]);
            } else {
                console.log('UNHANDLED REDO:', changeKind)
            }
        }
        this.undoStack.push(undoChanges);

        if (rerender) {
            this.sheet.forceRerender();
        } else {
            this.sheet.rerenderCells(updatedCells);
        }
        this.sheet.updateSelection();
    }
}