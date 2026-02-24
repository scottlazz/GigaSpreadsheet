import Sheet from "..";
export default class HistoryManager {
    readonly MAX_HISTORY_SIZE: number;
    undoStack: any;
    redoStack: any;
    sheet: Sheet;
    changes: any[];
    constructor(sheet: Sheet);
    recordChanges(changes: any): void;
    flushChanges(): void;
    undo(): void;
    redo(): void;
}
