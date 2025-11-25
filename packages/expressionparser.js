import FinData from "./financial/FinData";
import { dependencyTree, reverseDependencyTree, tickerReg } from "./dependencytracker";

export default class ExpressionParser {
    constructor(data) {
        this.data = data; // Spreadsheet data
        this.finData = new FinData();
    }

    // Add a dependency relationship
    addDependency(source, target) {
        const sr = source[0], sc = source[1];
        const tr = target[0], tc = target[1];
        if (!dependencyTree[tr]) dependencyTree[tr] = {};
        if (!dependencyTree[tr][tc]) dependencyTree[tr][tc] = {};
        if (!dependencyTree[tr][tc][sr]) dependencyTree[tr][tc][sr] = {};
        dependencyTree[tr][tc][sr][sc] = true;

        if (!reverseDependencyTree[sr]) reverseDependencyTree[sr] = {};
        if (!reverseDependencyTree[sr][sc]) reverseDependencyTree[sr][sc] = {};
        if (!reverseDependencyTree[sr][sc][tr]) reverseDependencyTree[sr][sc][tr] = {};
        reverseDependencyTree[sr][sc][tr][tc] = true;
    }

    // Tokenize the input expression
    tokenize(expression) {
        // Remove leading '=' if present
        if (expression.startsWith('=')) {
            expression = expression.slice(1);
        }

        const tokens = [];
        const regex = /\s*(=>|[-+*/^()]|[A-Za-z_]\w*|\d*\.?\d+|\S)\s*/g;
        let match;
        while ((match = regex.exec(expression)) !== null) {
            tokens.push(match[1]);
        }
        return tokens;
    }

    static tokenizeWithIndex(expression) {
        // Remove leading '=' if present
        if (expression.startsWith('=')) {
            expression = expression.slice(1);
        }

        const tokens = [];
        const regex = /\s*(=>|[-+*/^()]|[A-Za-z_]\w*|\d*\.?\d+|\S)\s*/dg;
        let match;
        while ((match = regex.exec(expression)) !== null) {
            tokens.push([match[1], match.indices[1]]);
        }
        return tokens;
    }

    // Parse the tokens into an AST
    parse(tokens) {
        let index = 0;

        const parseExpression = () => {
            let left = parseTerm();
            while (index < tokens.length && (tokens[index] === '+' || tokens[index] === '-')) {
                const operator = tokens[index];
                index++;
                const right = parseTerm();
                left = { type: 'BinaryExpression', operator, left, right };
            }
            return left;
        };

        const parseTerm = () => {
            let left = parseFactor();
            while (index < tokens.length && (tokens[index] === '*' || tokens[index] === '/')) {
                const operator = tokens[index];
                index++;
                const right = parseFactor();
                left = { type: 'BinaryExpression', operator, left, right };
            }
            return left;
        };

        const parseFactor = () => {
            if (tokens[index] === '(') {
                index++;
                const expr = parseExpression();
                if (tokens[index] !== ')') {
                    throw new Error('Expected closing parenthesis');
                }
                index++;
                return expr;
            } else if (/^\d+$/.test(tokens[index])) {
                return { type: 'Number', value: parseFloat(tokens[index++]) };
            } else if (tokens[index] === ':') {
                return { type: 'RangeReference', value: tokens[index++] };
            } else if (/^[A-Za-z]+\d+$/.test(tokens[index])) {
                if (tokens[index + 1] === ':') {
                    return { type: 'RangeReference', value: `${tokens[index++]}${tokens[index++]}${tokens[index++]}` };
                }
                return { type: 'CellReference', value: tokens[index++] };
            } else if (/^[A-Za-z_]\w*$/.test(tokens[index])) {
                return { type: 'Function', name: tokens[index++], args: parseArguments() };
            } else {
                throw new Error(`Unexpected token: ${tokens[index]}`);
            }
        };

        const parseArguments = () => {
            const args = [];
            if (tokens[index] === '(') {
                index++;
                while (tokens[index] !== ')') {
                    args.push(parseExpression());
                    if (tokens[index] === ',') {
                        index++;
                    }
                }
                index++;
            }
            return args;
        };

        return parseExpression();
    }

    // Evaluate the AST
    evaluate(ast, source) {
        // if (source) {
        //     // Remove old dependencies before evaluating
        //     this.removeDependencies(source);
        // }
        switch (ast.type) {
            case 'Number':
                return ast.value;
            case 'CellReference':
                if (source) {
                    const { row, col } = this.parseCellReference(ast.value);
                    this.addDependency(source, [row, col]);
                }
                return this.getCellValue(ast.value);
            case 'RangeReference':
                if (source) {
                    const [startCell, endCell] = ast.value.split(':');
                    const start = this.parseCellReference(startCell);
                    const end = this.parseCellReference(endCell);

                    for (let row = start.row; row <= end.row; row++) {
                        for (let col = start.col; col <= end.col; col++) {
                            this.addDependency(source, [row, col]);
                        }
                    }
                }
                return this.getRangeValues(ast.value);
            case 'BinaryExpression':
                return this.evaluateBinaryExpression(ast, source);
            case 'Function':
                return this.evaluateFunction(ast, source);
            default:
                throw new Error(`Unknown AST node type: ${ast.type}`);
        }
    }

    // Evaluate binary expressions (e.g., +, -, *, /, ^)
    evaluateBinaryExpression(ast, source) {
        const left = this.evaluate(ast.left, source);
        const right = this.evaluate(ast.right, source);
        switch (ast.operator) {
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '*':
                return left * right;
            case '/':
                return left / right;
            case '^':
                return Math.pow(left, right);
            default:
                throw new Error(`Unknown operator: ${ast.operator}`);
        }
    }

    // Evaluate functions (e.g., SUM, AVERAGE)
    evaluateFunction(ast, source) {
        const args = ast.args.map(arg => this.evaluate(arg));
        switch (ast.name.toUpperCase()) {
            case 'SUM':
                return args.flat().reduce((sum, val) => sum + val, 0);
            case 'AVERAGE':
                const values = args.flat();
                return values.reduce((sum, val) => sum + val, 0) / values.length;
            case 'ERROR':
                return 'ERROR';
            case 'REFERROR':
                return 'REFERROR';
            default:
                // tickerReg[source[0]]
                console.log('subbing', ast.name)
                if (!tickerReg[ast.name]) tickerReg[ast.name] = {};
                tickerReg[ast.name][`${source[0]},${source[1]}`] = true;
                if (this.finData.get('YA', ast.name)) {
                    return this.finData.get('YA', ast.name).price;
                } else {
                    return '';
                }
                // throw new Error(`Unknown function: ${ast.name}`);
        }
    }

    getCellText(row, col) {
        return this.data.get(row, col)?.text ?? '';
    }

    // Get the value of a cell reference (e.g., A1, B2)
    getCellValue(cellRef) {
        const { row, col } = this.parseCellReference(cellRef);
        if (row < 0 || row > this.bottomRow || col < 0 || col > this.data.rightCol) {
            return '';
            throw new Error(`Invalid cell reference: ${cellRef}`);
        }
        const value = this.getCellText(row, col);

        // If the cell value is a formula (starts with '='), evaluate it recursively
        if (typeof value === 'string' && value.startsWith('=')) {
            return this.evaluateExpression(value, [row, col]);
        }

        // Otherwise, treat it as a literal value
        return typeof value === 'number' ? value : parseFloat(value) || 0;
    }

    // Get the values of a range reference (e.g., A1:B2)
    getRangeValues(rangeRef) {
        const [startCell, endCell] = rangeRef.split(':');
        const start = this.parseCellReference(startCell);
        const end = this.parseCellReference(endCell);

        const values = [];
        for (let row = start.row; row <= end.row; row++) {
            for (let col = start.col; col <= end.col; col++) {
                if (row < 0 || row >= this.data.bottomRow || col < 0 || col >= this.rightCol) {
                    throw new Error(`Invalid cell in range: ${rangeRef}`);
                }
                const value = this.getCellText(row, col);

                // If the cell value is a formula (starts with '='), evaluate it recursively
                if (typeof value === 'string' && value.startsWith('=')) {
                    values.push(this.evaluateExpression(value, [row,col]));
                } else {
                    values.push(typeof value === 'number' ? value : parseFloat(value) || 0);
                }
            }
        }

        return values;
    }

    // Parse a cell reference (e.g., A1 => { row: 0, col: 0 })
    parseCellReference(cellRef) {
        const colLetter = cellRef.match(/[A-Za-z]+/)?.[0];
        const rowNumber = cellRef.match(/\d+/)?.[0];

        if (!colLetter || !rowNumber) {
            throw new Error(`Invalid cell reference: ${cellRef}`);
        }

        const col = colLetter.split('').reduce((acc, char) => acc * 26 + (char.toUpperCase().charCodeAt(0) - 64), 0) - 1;
        const row = parseInt(rowNumber, 10) - 1;

        return { row, col };
    }

    static parseCellReference(cellRef) {
        const colLetter = cellRef.match(/[A-Za-z]+/)?.[0];
        const rowNumber = cellRef.match(/\d+/)?.[0];

        if (!colLetter || !rowNumber) {
            throw new Error(`Invalid cell reference: ${cellRef}`);
        }

        const col = colLetter.split('').reduce((acc, char) => acc * 26 + (char.toUpperCase().charCodeAt(0) - 64), 0) - 1;
        const row = parseInt(rowNumber, 10) - 1;

        return { row, col };
    }

    getAst(expression) {
        if (expression.startsWith('=')) {
            const tokens = this.tokenize(expression);
            return this.parse(tokens);
        }
        return null;
    }

    // Main function to parse and evaluate an expression
    evaluateExpression(expression, source) {
        if (typeof expression !== 'string') {
            return expression; // Return non-string values as-is
        }

        // If the expression starts with '=', parse and evaluate it
        if (expression.startsWith('=')) {
            const tokens = this.tokenize(expression);
            const ast = this.parse(tokens);
            return this.evaluate(ast, source);
        }

        // If the expression does not start with '=', treat it as a literal value
        return !isNaN(expression) && !Number.isNaN(parseFloat(expression)) ? parseFloat(expression) : expression;
    }
}