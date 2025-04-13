// @ts-ignore
import { BottomBar } from 'src/sheet/components/bottomBar';
import Sheet from '../sheet';
// import Sheet from "src/sheet";

export default class Giga {
    wrapper: HTMLElement;
    private _container: HTMLDivElement;
    sheetsContainer: any;
    addSheetButton: HTMLButtonElement;
    activeGrids: Map<any, any>;
    curId: number;
    curActiveGridId: number;
    bottomBar: any;
    constructor(wrapperId: string, options?: any) {
        this.curId = 1;
        this.curActiveGridId = 1;
        this.activeGrids = new Map();
        this.wrapper = document.getElementById(wrapperId) || document.createElement('div');
        const _container = document.createElement('div');
        this._container = _container;
        _container.style.width = '100%';
        _container.style.height = '100%';
        _container.style.display = 'flex';
        _container.style.flexDirection = 'column';
        _container.innerHTML = `
            <div id="sheets-container" class="sheets-container" style="display:flex;flex:1;flex-direction:column;height:calc(100% - 40px);">
            </div>
        `;
        this.bottomBar = new BottomBar();
        _container.appendChild(this.bottomBar.container);
        this.wrapper.appendChild(_container);
        this.addSheetButton = _container.querySelector('.gigasheet-icon-img.add')!;
        this.sheetsContainer = _container.querySelector('.sheets-container');

        this.initEventListeners();
        this.initSheets(options);
    }

    initEventListeners() {
        this.addSheetButton.onclick = (e) => {
            e.preventDefault();
            this.addGrid();
        }
        this.bottomBar.onTabClicked((tab: string) => {
            this.switchTab(tab);
        })
    }

    switchTab(tab: string) {
        const grid = this.activeGrids.get(tab);
        if (!grid) return;
        for (let child of this.sheetsContainer.children) {
            child.style.display = 'none';
        }
        grid._container.style.display = 'flex';
    }

    getDefaultOptions () {
        return {
            gridlinesOn: true,
            initialCells: [{row: 1, col: 1, text: 'foo'}]
        };
    }

    addGrid(options?: any) {
        for(let child of this.sheetsContainer.children) {
            child.style.display = 'none';
        }
        this.activeGrids.set(String(this.curId++), new Sheet(
            this.sheetsContainer, options || this.getDefaultOptions()
        ));
        this.bottomBar.addTab('Sheet', this.curId-1)
    }

    initSheets(options?: []) {
        if (options == null || !(options.length > 0)) {
            this.addGrid();
        } else {
            for(let i = 0; i < options.length; i++) {
                this.addGrid(options);
            }
        }
    }
}