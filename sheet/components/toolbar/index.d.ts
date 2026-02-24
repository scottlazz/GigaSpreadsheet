import Dropdown from '../dropdown';
export declare class Toolbar {
    container: HTMLDivElement;
    cb: Function | null;
    font: Dropdown;
    fontSize: Dropdown;
    borderButton: any;
    backgroundColorButton: any;
    borderDrawer: HTMLDivElement;
    constructor();
    set(attr: string, value: string): void;
    setActiveTextAlign(value: string): void;
    addListeners(): void;
    onAction(fn: Function): void;
}
