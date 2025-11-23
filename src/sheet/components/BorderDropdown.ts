import { mkel } from "../utils";

export default class ContextMenu {
    menuItems: any;
    container: any;
    clickCb: Function | undefined;
    constructor() {
        this.container = mkel('div', 'gigasheet-contextmenu');
        this.container.oncontextmenu = ((e: any) => e.preventDefault());
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
        const { width, height } = containerRect;
        const ctxrect = this.container.getBoundingClientRect();
        const ctxwidth = ctxrect.width;
        const vhf = height / 2;
        let left = x;
        if (width - x <= ctxwidth) {
            left -= ctxwidth;
        }
        this.container.style.left = `${left}px`;
        if (y > vhf) {
            this.container.style.bottom = `${height - y}px`;
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
