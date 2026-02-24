import { BottomBar } from '../sheet/components/bottomBar';
export default class Giga {
    wrapper: HTMLElement;
    private _container;
    sheetsContainer: any;
    activeGrids: Map<any, any>;
    curId: number;
    curActiveGridId: number;
    options: any;
    bottomBar: BottomBar | null;
    addSheetButton: any;
    constructor(wrapperId: string | HTMLElement, options?: any);
    initEventListeners(): void;
    switchTab(tab: string): void;
    getDefaultOptions(): {
        gridlinesOn: boolean;
    };
    addGrid(options?: any): void;
    initSheets(options?: []): void;
}
