import ExpressionParser from '../packages/expressionparser';

export function rowColToRef(row: number, col: number) {
    // Validate inputs
    if (row < 0 || col < 0 || !Number.isInteger(row) || !Number.isInteger(col)) {
        return '';
        // throw new Error('Row and column must be non-negative integers');
    }

    // Convert column index to letters (0 = A, 1 = B, ..., 25 = Z, 26 = AA, etc.)
    let colLetters = '';
    let remaining = col + 1; // Convert to 1-based for calculation

    while (remaining > 0) {
        const remainder = (remaining - 1) % 26;
        colLetters = String.fromCharCode(65 + remainder) + colLetters;
        remaining = Math.floor((remaining - 1) / 26);
    }

    // Convert row index to 1-based number
    const rowNumber = row + 1;

    return colLetters + rowNumber;
}

export function shiftTextRefs(text: string, dir: string) {
    const deltas: any = {
        up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1]
    }
    const delta = deltas[dir];
    text = text.slice(1); // strip =
    const tokens = ExpressionParser.tokenizeWithIndex(text);
    tokens.reverse();
    let str = '=';
    for (let i = 0; i < text.length; i++) {
        while (tokens.length > 0 && !/^[A-Za-z]+\d+$/.test(tokens[tokens.length - 1][0])) {
            tokens.pop();
        }
        const [token, indexes] = (tokens[tokens.length - 1] || ['', []]);
        if (i === indexes[0]) {
            const cell = ExpressionParser.parseCellReference(token);
            const newRef = rowColToRef(cell.row+delta[0], cell.col+delta[1]);
            if (!newRef) {
                str += 'REFERROR'
            } else {
                str += newRef;
            }
            tokens.pop();
            i = indexes[1] - 1;
        } else {
            str += text[i];
        }
    }
    return str;
}