import Sheet from "..";

export default class State {
    isEditable: boolean;
    constructor(sheet: Sheet) {
        this.isEditable = true;
    }
}