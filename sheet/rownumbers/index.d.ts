import Sheet from "..";
export default class RowNumbers {
    sheet: Sheet;
    rowNumberContainer: HTMLElement;
    renderRowNumberElems: HTMLDivElement;
    renderRowNumberPadder: HTMLDivElement;
    constructor(sheet: Sheet);
    createRowNumber(label: string): HTMLDivElement;
    renderRowNumbers(): void;
}
