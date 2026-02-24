import Sheet from "src/sheet";
export declare class Block {
    count: number;
    blockContainer: HTMLDivElement;
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
    styleWidth?: number;
    styleHeight?: number;
    sheet: Sheet;
    subBlocks: any;
    constructor(data: any, sheet: Sheet);
    static createCanvas: (idx?: number | null) => HTMLCanvasElement;
    positionBlock(): void;
    init(): void;
    render(): void;
}
