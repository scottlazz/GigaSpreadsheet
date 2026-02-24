export declare class BottomBar {
    container: HTMLDivElement;
    tabCbs: Function[];
    menu: HTMLElement;
    active: string | number;
    constructor();
    addListeners(): void;
    setActive(id: string | number): void;
    emit(value: any): void;
    onTabClicked(fn: Function): void;
    removeActive(): void;
    addTab(name: string, id: number): void;
}
