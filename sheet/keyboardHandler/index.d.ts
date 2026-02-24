import Sheet from "..";
export default class KeyboardHandler {
    sheet: Sheet;
    constructor(sheet: any);
    onKeyDown(e: KeyboardEvent): Promise<void>;
    handleArrowKeyDown(e: any): void;
}
