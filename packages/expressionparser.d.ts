export default class ExpressionParser {
    data: any;
    constructor(data: any);
    addDependency(source: any, target: any): void;
    tokenize(expression: string): any[];
    static tokenizeWithIndex(expression: string): any[];
    parse(tokens: any): any;
    evaluate(ast: any, source?: any): any;
    evaluateBinaryExpression(ast: any, source: any): any;
    evaluateFunction(ast: any, source: any): any;
    getCellText(row: number, col: number): any;
    getCellValue(cellRef: any): any;
    getRangeValues(rangeRef: any): any[];
    parseCellReference(cellRef: any): {
        row: number;
        col: number;
    };
    static parseCellReference(cellRef: any): {
        row: number;
        col: number;
    };
    getAst(expression: string): any;
    evaluateExpression(expression: any, source: any): any;
}
