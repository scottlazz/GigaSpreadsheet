import { copy, undo, paste, bold, italic, borders, merge, redo, growFont, shrinkFont, leftAlign, centerAlign, rightAlign } from "./icons";
import Dropdown from '../dropdown';
import tooltip from 'packages/tooltip';

export class Toolbar {
    container: HTMLDivElement;
    cb: Function | null;
    font: Dropdown;
    fontSize: Dropdown;
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'gigasheet-toolbar';
        this.container.innerHTML = `
            <div class="gigasheet-toolbar-buttons">
                <button class="gigasheet-toolbar-btn" data-tooltip="Undo">
                    <i class="gigasheet-icon">
                        ${undo}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Redo">
                    <i class="gigasheet-icon">
                        ${redo}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Copy">
                    <i class="gigasheet-icon">
                        ${copy}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Paste">
                    <i class="gigasheet-icon">
                        ${paste}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Bold">
                    <i class="gigasheet-icon">
                        ${bold}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Grow Font">
                    <i class="gigasheet-icon">
                        ${growFont}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Shrink Font">
                    <i class="gigasheet-icon">
                        ${shrinkFont}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Italic">
                    <i class="gigasheet-icon">
                        ${italic}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Borders">
                    <i class="gigasheet-icon">
                        ${borders}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Merge">
                    <i class="gigasheet-icon">
                        ${merge}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Left align">
                    <i class="gigasheet-icon">
                        ${leftAlign}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Center align">
                    <i class="gigasheet-icon">
                        ${centerAlign}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Right align">
                    <i class="gigasheet-icon">
                        ${rightAlign}
                    </i>
                </button>
            </div>`;
        this.font = new Dropdown('Font', [{value: 'arial', name: 'Arial'}, {value: 'calbri', name: 'Calbri'}]);
        this.container.children[0].appendChild(this.font.container);
        this.fontSize = new Dropdown('FontSize', [{value: '8', name: '8'}, {value: '9', name: '9'}, {value: '10', name: '10'}, {value: '11', name: '11'}, {value: '12', name: '12'}, {value: '13', name: '13'}, {value: '15', name: '15'}, {value: '18', name: '18'}, {value: '22', name: '22'}]);
        this.container.children[0].appendChild(this.fontSize.container);
        this.cb = null;
        this.addListeners();
    }
    addListeners() {
        const onmouseenter = (e: any) => {
            const text = e.target.getAttribute('data-tooltip');
            tooltip(e.target, text);
        }
        const onclick = (e: any) => {
            if (!this.cb) return;
            const button = e.target.closest('.gigasheet-toolbar-btn')
            const text = button.getAttribute('data-tooltip');
            this.cb(text);
        }
        for(let el of (this.container.querySelectorAll('.gigasheet-toolbar-btn') as any)) {
            el.onmouseenter = onmouseenter;
            el.addEventListener('click', onclick);
        }
    }
    onAction(fn: Function) {
        this.cb = fn;
    }
}

