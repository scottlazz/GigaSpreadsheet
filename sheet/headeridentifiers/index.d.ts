import Sheet from "..";
export default class HeaderIdentifiers {
    sheet: Sheet;
    headerContainer: HTMLElement;
    renderHeaderPadder: HTMLDivElement;
    renderHeaderElems: HTMLDivElement;
    constructor(sheet: Sheet);
    renderHeaders(): void;
}
