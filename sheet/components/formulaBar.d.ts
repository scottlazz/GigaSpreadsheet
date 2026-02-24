import Sheet from "..";
export declare class FormulaBar {
    container: HTMLDivElement;
    tabCbs: Function[];
    input: HTMLInputElement;
    textarea: HTMLTextAreaElement;
    active: string | number;
    sheet: Sheet;
    isEditing: boolean;
    isEditingCellSelect: boolean;
    constructor(sheet: Sheet);
    addEvents(): void;
    emit(value: any): void;
}
