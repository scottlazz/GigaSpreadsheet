import { BottomBar } from '../sheet/components/bottomBar';
import Sheet from '../sheet';
// import Sheet from "src/sheet";

export default class Giga {
    wrapper: HTMLElement;
    private _container: HTMLDivElement;
    sheetsContainer: any;
    // addSheetButton: HTMLButtonElement;
    activeGrids: Map<any, any>;
    curId: number;
    curActiveGridId: number;
    options: any;
    bottomBar: BottomBar | null;
    addSheetButton: any;
    // bottomBar: any;
    constructor(wrapperId: string|HTMLElement, options?: any) {
        this.bottomBar = null;
        this.curId = 1;
        this.curActiveGridId = 1;
        this.activeGrids = new Map();
        if (typeof wrapperId === 'string') {
            this.wrapper = document.getElementById(wrapperId) || document.createElement('div');
        } 
        else  {
             this.wrapper = wrapperId;
         }
        const _container = document.createElement('div');
        this._container = _container;
        _container.style.width = '100%';
        _container.style.height = '100%';
        _container.style.display = 'flex';
        _container.style.flexDirection = 'column';
        _container.innerHTML = `
            <div class="sheets-container" style="display:flex;flex:1;flex-direction:column;height:calc(100% - 40px);">
            </div>
        `;
        this.options = options || {};
        if (this.options.bottomBar) {
            this.bottomBar = new BottomBar();
            _container.appendChild(this.bottomBar.container);
            this.addSheetButton = _container.querySelector('.gigasheet-icon-img.add')!;
        }
        this.wrapper.appendChild(_container);
        this.sheetsContainer = _container.querySelector('.sheets-container');

        this.initEventListeners();
        this.initSheets(options);
    }

    initEventListeners() {
        if (this.bottomBar) {
            this.addSheetButton.onclick = (e: any) => {
                e.preventDefault();
                this.addGrid();
            }
            this.bottomBar.onTabClicked((tab: string) => {
                this.switchTab(tab);
            })
        }
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
            // initialCells: [{row: 1, col: 1, text: 'foo'}]
        };
    }

    addGrid(options?: any) {
        for(let child of this.sheetsContainer.children) {
            child.style.display = 'none';
        }
        this.activeGrids.set(String(this.curId++), new Sheet(
            this.sheetsContainer, options || this.getDefaultOptions()
        ));
        if (this.bottomBar) {
            this.bottomBar.addTab('Sheet', this.curId-1)
        }
    }

    initSheets(options?: []) {
        if (options == null || !(options.length > 0)) {
            this.addGrid();
        } else {
            for(let i = 0; i < options.length; i++) {
                this.addGrid(options[i]);
            }
        }
    }
}