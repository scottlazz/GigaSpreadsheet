import Sheet from "..";
import { arrows } from "./utils";
import scrollIntoView from '../../packages/scrollIntoView';

export default class KeyboardHandler {
    sheet: Sheet;
    constructor(sheet: any) {
        this.sheet = sheet;
    }

    onKeyDown(e: KeyboardEvent) {
        const key = e.key.toLowerCase();
        if ((key === 'f2') && this.sheet.selectionStart) {
            e.preventDefault();
            if (this.sheet.editingCell) return;
            this.sheet.startCellEdit(this.sheet.selectionStart.row, this.sheet.selectionStart.col);
        }
        else if (key === 'f3') {
            if (this.sheet.editingCell) return;
            this.sheet.openFormatMenu();
            e.preventDefault();
        }
        // Escape key to cancel editing
        else if (key === 'escape' && this.sheet.editInput.style.display !== 'none') {
            this.sheet.cancelCellEdit();
        }
        else if (key === 'delete') {
            if (this.sheet.editingCell) return;
            this.sheet.clearSelectedCells();
        }
        else if (key === 'x' && e.ctrlKey) {
            if (this.sheet.editingCell) return;
            document.execCommand('copy');
            this.sheet.clearSelectedCells();
            e.preventDefault();
        }
        else if (key === 'k' && e.ctrlKey) {
            if (this.sheet.editingCell) return;
            let cells = this.sheet.data.getAllCells();
            cells = cells.filter(cell => Object.keys(cell).length > 3);
            console.log({
                cellHeight: this.sheet.cellHeight,
                cellWidth: this.sheet.cellWidth,
                mergedCells: this.sheet.mergedCells,
                autosize: this.sheet.options?.autosize ?? false,
                heightOverrides: Object.assign({}, this.sheet.heightOverrides),
                widthOverrides: Object.assign({}, this.sheet.widthOverrides),
                gridlinesOn: this.sheet.gridlinesOn,
                initialCells: cells
            });
            // data = this.data.
            e.preventDefault();
        }
        else if (key === 's' && e.ctrlKey) {
            if (this.sheet.editingCell) return;
            const data = this.sheet.data.save();
            const save = {
                mergedCells: this.sheet.mergedCells,
                heightOverrides: Object.assign({}, this.sheet.heightOverrides),
                widthOverrides: Object.assign({}, this.sheet.widthOverrides),
                gridlinesOn: this.sheet.gridlinesOn,
                data
            }
            // localStorage.setItem('data-save', data)
            localStorage.setItem('sheet-state', JSON.stringify(save))
            e.preventDefault();
        }
        else if (key === 'l' && e.ctrlKey) {
            if (this.sheet.editingCell) return;
            this.sheet.restoreSave();
            e.preventDefault();
        }
        else if (e.ctrlKey || e.metaKey) { // Check for Ctrl (Windows/Linux) or Cmd (Mac)
            if (this.sheet.editingCell) return;
            if (key === 'y' || (e.shiftKey && key === 'z')) {
                e.preventDefault(); // Prevent default behavior
                this.sheet.historyManager.redo();
            } else if (key === 'z') {
                e.preventDefault(); // Prevent default behavior (e.g., browser undo)
                this.sheet.historyManager.undo();
            }
        } else if (key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright' || key === 'enter' || key === 'tab') {
            if (!this.sheet.selectionEnd || this.sheet.editingCell) return;
            e.preventDefault();
            this.sheet.probe.style.display = 'block';
            this.handleArrowKeyDown(e);
        } else if (this.sheet.selectionStart && e.key?.length === 1) {
            if (this.sheet.editingCell) return;
            this.sheet.startCellEdit(this.sheet.selectionStart.row, this.sheet.selectionStart.col, e.key);
        }
    }

    handleArrowKeyDown(e: any) {
        if (!this.sheet.selectionEnd || !this.sheet.selectionStart) return;
        this.sheet.lastDirKey = e.key;
        const deltas: any = {
            'ArrowUp': [-1, 0], 'ArrowDown': [1, 0], 'ArrowLeft': [0, -1], 'ArrowRight': [0, 1], 'Enter': e.shiftKey ? [-1, 0] : [1,0],
            'Tab': e.shiftKey ? [0, -1] : [0, 1]
        }
        const curMerge = this.sheet.getMerge(this.sheet.selectionEnd.row, this.sheet.selectionEnd.col);
        let row = this.sheet.selectionEnd.row + deltas[e.key][0];
        let col = this.sheet.selectionEnd.col + deltas[e.key][1];
        const merge = this.sheet.getMerge(row, col);
        const corner = [
            row > this.sheet.selectionStart.row ? 'b' : 't',
            col > this.sheet.selectionStart.col ?  'r' : 'l'
        ];
        if (e.shiftKey) {
            // TODO: do in less bruteforce way
            const prevRect = JSON.stringify(this.sheet.selectionBoundRect);
            if (e.key === 'ArrowUp' || (e.key === 'Enter')) {
                let curRect;
                while (row > 0) {
                    curRect = this.sheet.getBoundingRectCells(this.sheet.selectionStart.row, this.sheet.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    row--;
                }
            }
            else if (e.key === 'ArrowDown') {
                let curRect;
                while (row < this.sheet.totalRowBounds) {
                    curRect = this.sheet.getBoundingRectCells(this.sheet.selectionStart.row, this.sheet.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    row++;
                }
            }
            else if (e.key === 'ArrowLeft' || (e.key === 'Tab')) {
                let curRect;
                while (col > 0) {
                    curRect = this.sheet.getBoundingRectCells(this.sheet.selectionStart.row, this.sheet.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    col--;
                }
            }
            else if (e.key === 'ArrowRight') {
                let curRect;
                while (col < this.sheet.totalColBounds) {
                    curRect = this.sheet.getBoundingRectCells(this.sheet.selectionStart.row, this.sheet.selectionStart.col, row, col);
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
            this.sheet.lastCol = col;
        } else if (e.key === 'Enter') {
            col = this.sheet.lastCol;
        }
        row = Math.min(row, this.sheet.totalRowBounds);
        col = Math.min(col, this.sheet.totalColBounds);
        if (e.shiftKey && e.key !== 'Enter') this.sheet.selectionEnd = { row, col };
        this.sheet.selectCell({ row, col, continuation: e.shiftKey && !['Enter', 'Tab'].includes(e.key) });
        if (this.sheet.selectedCell) {
            this.sheet.selectedCell.appendChild(this.sheet.probe);
            this.sheet.probe.style.top = '';
            this.sheet.probe.style.left = '';
            this.sheet.probe.style.bottom = '';
            this.sheet.probe.style.right = '';
            if (arrows.has(e.key) && e.shiftKey) {
                this.sheet.probe.style.width = `${this.sheet.metrics.getCellWidth(col)+20}px`;
                this.sheet.probe.style.height = `${this.sheet.metrics.getCellHeight(row)+20}px`;
                corner.forEach(side => {
                    if (side === 't') { this.sheet.probe.style.top = `${-20 - this.sheet.headerRowHeight}px`; }
                    else if (side === 'b') { this.sheet.probe.style.bottom = '-20px'; }
                    else if (side === 'l') { this.sheet.probe.style.left = `${-20 - this.sheet.rowNumberWidth}px`; }
                    else if (side === 'r') { this.sheet.probe.style.right = '-20px'; }
                });
                this.sheet.probe.style.display = 'block';
                scrollIntoView(this.sheet.probe, {
                    scrollMode: 'if-needed',
                    block: 'nearest',
                    inline: 'nearest',
                });
            } else {
                let w = this.sheet.selectedCell.getBoundingClientRect().width+50;
                let h = this.sheet.selectedCell.getBoundingClientRect().height+40;
                this.sheet.probe.style.width = `${w+this.sheet.rowNumberWidth}px`;
                this.sheet.probe.style.height = `${h+this.sheet.headerRowHeight}px`;
                this.sheet.probe.style.left = `-${(w/4)+this.sheet.rowNumberWidth}px`;
                this.sheet.probe.style.top = `-${(h/4)+this.sheet.headerRowHeight}px`;
                this.sheet.probe.style.display = 'block';
                scrollIntoView(this.sheet.probe, {
                    scrollMode: 'if-needed',
                    block: 'nearest',
                    inline: 'nearest',
                });
            }
        }
    }
}