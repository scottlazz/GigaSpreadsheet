import { mkel } from "../utils";

const menuItems = [
    { key: 'copy', title: 'Copy', label: 'Ctrl+C' },
    { key: 'cut', title: 'Cut', label: 'Ctrl+X' },
    { key: 'paste', title: 'Paste', label: 'Ctrl+V' },
    { key: 'paste-value', title: 'Paste values only', label: 'Ctrl+Shift+V' },
    { key: 'paste-format', title: 'Paste format only', label: 'Ctrl+Alt+V' },
    { key: 'divider' },
    { key: 'insert-row', title: 'Insert row' },
    { key: 'insert-column', title: 'Insert column' },
    { key: 'divider' },
    { key: 'merge', title: 'Merge' },
    { key: 'unmerge', title: 'Unmerge' },
    { key: 'divider' },
    { key: 'delete-row', title: 'Delete row' },
    { key: 'delete-column', title: 'Delete column' },
    { key: 'delete-cell-text', title: 'Delete cell text' },
    { key: 'clear', title: 'Clear Contents', label: '' },
    { key: 'divider' },
    { key: 'toggle-gridlines', title: 'Toggle Gridlines' },
];

function buildMenuItem(item: any) {
    if (item.key === 'divider') {
        return mkel('div', `gigasheet-item divider`);
    }
    const el = mkel('div', `gigasheet-item`, `
        ${item.title}
        <div class="label">${item.label||''}</div>
    `);
    el.setAttribute('data-key', item.key);
    return el;
}

function buildMenu(menuItems: any) {
    return menuItems.map((it: any) => buildMenuItem(it));
}

export default class ContextMenu {
    menuItems: any;
    container: any;
    clickCb: Function | undefined;
    constructor() {
        this.menuItems = buildMenu(menuItems);
        this.container = mkel('div', 'gigasheet-contextmenu');
        this.container.oncontextmenu = ((e:any)=> e.preventDefault());
        this.container.style.display = 'none';
        for (let child of this.menuItems) {
            this.container.appendChild(child);
        }
        this.container.onclick = (e: any) => {
            if (e.target.hasAttribute('data-key')) {
                const action = e.target.getAttribute('data-key');
                if (this.clickCb) this.clickCb(action);
                this.hide();
            }
        }
    }

    onClick(fn: Function) {
        this.clickCb = fn;
    }


    hide() {
        this.container.style.display = 'none';
    }

    setPosition(x: number, y: number, containerRect: any) {
        const {width, height} = containerRect;
        const ctxrect = this.container.getBoundingClientRect();
        const ctxwidth = ctxrect.width;
        const vhf = height / 2;
        let left = x;
        if (width - x <= ctxwidth) {
            left -= ctxwidth;
        }
        this.container.style.left = `${left}px`;
        if (y > vhf) {
            this.container.style.bottom = `${height-y}px`;
            this.container.style.maxHeight = `${y}px`;
            this.container.style.top = 'auto';
        } else {
            this.container.style.top = `${y}px`;
            this.container.style.maxHeight = `${height - y}px`;
            this.container.style.bottom = 'auto';
        }

        this.container.style.display = '';
    }
}
