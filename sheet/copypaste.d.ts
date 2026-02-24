import Sheet from ".";
export declare function parseXML(xml: string): string;
export declare function toXML(cells: any[], getMerge: Function): string;
export declare class CopyHandler {
    sheet: Sheet;
    constructor(sheet: Sheet);
    onCopy(e: ClipboardEvent): void;
}
export declare class PasteHandler {
    sheet: Sheet;
    constructor(sheet: Sheet);
    onPaste(e: ClipboardEvent): void;
    handlePastePlaintext(text: string): void;
    handlePasteData(text: string, e: any): void;
}
