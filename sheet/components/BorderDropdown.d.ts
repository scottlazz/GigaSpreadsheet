export default class ContextMenu {
    menuItems: any;
    container: any;
    clickCb: Function | undefined;
    constructor();
    onClick(fn: Function): void;
    hide(): void;
    setPosition(x: number, y: number, containerRect: any): void;
}
