import scrollIntoView from "src/packages/scrollIntoView";
import Sheet from "..";
import ExpressionParser from '../../packages/expressionparser';
import { rowColToRef } from "../shiftops";

export class FormulaBar {
    container: HTMLDivElement;
    tabCbs: Function[];
    input: HTMLInputElement;
    textarea: HTMLTextAreaElement;
    // menu: HTMLElement;
    active: string | number;
    sheet: Sheet;
    isEditing: boolean;
    isEditingCellSelect: boolean;
    constructor(sheet: Sheet) {
        this.sheet = sheet;
        this.isEditing = false;
        this.container = document.createElement('div');
        this.container.className = 'gigasheet-formulabar';
        this.container.innerHTML = `
            <input value="A1" class="gigasheet-name-box"></input>
            <!-- <div class="gigasheet-okcancelcontainer"><button>X</button><button>✓</button><button>fx</button></div> -->&nbsp;
            <textarea class="formulainput" spellcheck="false"></textarea>
        `
        // <div style="background-color: white;width:100%;height:100%;display:flex;align-items:center;padding-left:10px;" contenteditable="true" class="formulainput" spellcheck="false"></div>
        // this.menu = this.container.querySelector('.gigasheet-menu')!;
        this.active = 1;
        this.tabCbs = [];
        this.input = this.container.querySelector('.gigasheet-name-box')!;
        this.textarea = this.container.querySelector('textarea')!;
        this.addEvents();
    }
    addEvents() {
        // this.editInput.onblur = this.finishCellEdit.bind(this);
        this.textarea.onfocus = (e) => {
            this.isEditing = true;
        };
        this.textarea.onblur = (e) => {
            this.isEditing = false;
        };
        this.textarea.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === 'Tab') {
                this.isEditing = false;
                this.textarea.blur();
                this.sheet._container.focus();
                const selection = this.sheet.selectionBoundRect;
                const row = selection.startRow;
                const col = selection.startCol;
                this.sheet.historyManager.recordChanges([{ row, col, prevData: Object.assign({}, this.sheet.getCell(row,col)), changeKind: 'valchange' }]);
                this.sheet.setText(row,col,this.textarea.value);
                this.sheet.renderCell(row,col);
            } else if (e.key === 'Escape') {
                this.isEditing = false;
                this.textarea.value = this.sheet.getCellText(this.sheet.selectionStart!.row, this.sheet.selectionStart!.col);
                this.textarea.blur();
                this.sheet._container.focus();
            } else {
                this.isEditing = true;
            }
        };
        this.input.onfocus = (e) => {
            this.isEditingCellSelect = true;
        };
        this.input.onblur = (e) => {
            this.isEditingCellSelect = false;
        };
        this.input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                // this.sheet._container.focus();
                let cell;
                try {
                    cell = ExpressionParser.parseCellReference(this.input.value);
                } catch (err) {
                    return;
                }
                if (cell && cell.row >= 0 && cell.col >= 0) {
                    this.sheet.lastCol = cell.col;
                    this.sheet.selectCell({ row: cell.row, col: cell.col, continuation: false });
                }
                setTimeout(() => {
                    scrollIntoView(this.sheet.selectedCell, {
                        scrollMode: 'if-needed',
                        block: 'nearest',
                        inline: 'nearest',
                    });
                    this.input.blur();
                    this.sheet._container.focus();
                    this.isEditingCellSelect = false;
                }, 0);
            } else if (e.key === 'Escape') {
                this.isEditingCellSelect = false;
                this.input.blur();
                const row = this.sheet.selectionBoundRect.startRow;
                const col = this.sheet.selectionBoundRect.startCol;
                const ref = rowColToRef(row,col);
                this.input.value = ref;
                this.sheet._container.focus();
            } else {
                this.isEditingCellSelect = true;
            }
        };
    }
    emit(value: any) {
        this.tabCbs.forEach(fn => {
            fn(value);
        })
    }
}