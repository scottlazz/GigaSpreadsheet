import ExpressionParser from '../src/packages/expressionparser';
import SparseGrid from '../src/packages/sparsegrid';

describe('ExpressionParser', () => {
  let parser: ExpressionParser;
  let mockData: SparseGrid;

  beforeEach(() => {
    mockData = new SparseGrid();
    parser = new ExpressionParser(mockData);
  });

  describe('tokenize', () => {
    it('should tokenize simple expressions', () => {
      const tokens = parser.tokenize('=A1+B2');
      expect(tokens).toEqual(['A1', '+', 'B2']);
    });

    it('should tokenize expressions with numbers', () => {
      const tokens = parser.tokenize('=1+2*3');
      expect(tokens).toEqual(['1', '+', '2', '*', '3']);
    });

    it('should tokenize function calls', () => {
      const tokens = parser.tokenize('=SUM(A1:A3)');
      expect(tokens).toEqual(['SUM', '(', 'A1', ':', 'A3', ')']);
    });

    it('should remove leading equals sign', () => {
      const tokens = parser.tokenize('=A1+1');
      expect(tokens).toEqual(['A1', '+', '1']);
    });
  });

  describe('parseCellReference', () => {
    it('should parse simple cell references', () => {
      expect(ExpressionParser.parseCellReference('A1')).toEqual({ row: 0, col: 0 });
      expect(ExpressionParser.parseCellReference('B2')).toEqual({ row: 1, col: 1 });
      expect(ExpressionParser.parseCellReference('Z1')).toEqual({ row: 0, col: 25 });
    });

    it('should parse multi-letter column references', () => {
      expect(ExpressionParser.parseCellReference('AA1')).toEqual({ row: 0, col: 26 });
      expect(ExpressionParser.parseCellReference('AB1')).toEqual({ row: 0, col: 27 });
    });

    it('should throw error for invalid references', () => {
      expect(() => ExpressionParser.parseCellReference('1A')).toThrow('Invalid cell reference: 1A');
      expect(() => ExpressionParser.parseCellReference('A')).toThrow('Invalid cell reference: A');
      expect(() => ExpressionParser.parseCellReference('1')).toThrow('Invalid cell reference: 1');
    });
  });

  describe('parse', () => {
    it('should parse simple arithmetic expressions', () => {
      const tokens = ['1', '+', '2'];
      const ast = parser.parse(tokens);
      expect(ast).toEqual({
        type: 'BinaryExpression',
        operator: '+',
        left: { type: 'Number', value: 1 },
        right: { type: 'Number', value: 2 }
      });
    });

    it('should parse cell references', () => {
      const tokens = ['A1'];
      const ast = parser.parse(tokens);
      expect(ast).toEqual({
        type: 'CellReference',
        value: 'A1'
      });
    });

    it('should parse range references', () => {
      const tokens = ['A1', ':', 'B2'];
      const ast = parser.parse(tokens);
      expect(ast).toEqual({
        type: 'RangeReference',
        value: 'A1:B2'
      });
    });

    it('should parse function calls', () => {
      const tokens = ['SUM', '(', 'A1', ':', 'A3', ')'];
      const ast = parser.parse(tokens);
      expect(ast).toEqual({
        type: 'Function',
        name: 'SUM',
        args: [{
          type: 'RangeReference',
          value: 'A1:A3'
        }]
      });
    });

    it('should handle operator precedence', () => {
      const tokens = ['1', '+', '2', '*', '3'];
      const ast = parser.parse(tokens);
      expect(ast.operator).toBe('+');
      expect(ast.right.operator).toBe('*');
    });
  });

  describe('evaluate', () => {
    beforeEach(() => {
      // Set up some test data
      mockData.set(0, 0, { text: '10' });
      mockData.set(0, 1, { text: '20' });
      mockData.set(1, 0, { text: '30' });
    });

    it('should evaluate numbers', () => {
      const ast = { type: 'Number', value: 42 };
      expect(parser.evaluate(ast)).toBe(42);
    });

    it('should evaluate cell references', () => {
      const ast = { type: 'CellReference', value: 'A1' };
      expect(parser.evaluate(ast)).toBe(10);
    });

    it('should evaluate binary expressions', () => {
      const ast = {
        type: 'BinaryExpression',
        operator: '+',
        left: { type: 'Number', value: 5 },
        right: { type: 'Number', value: 3 }
      };
      expect(parser.evaluate(ast)).toBe(8);
    });

    it('should evaluate range references', () => {
      const ast = { type: 'RangeReference', value: 'A1:A2' };
      expect(parser.evaluate(ast)).toEqual([10, 30]);
    });

    it('should evaluate SUM function', () => {
      const ast = {
        type: 'Function',
        name: 'SUM',
        args: [{ type: 'RangeReference', value: 'A1:A2' }]
      };
      expect(parser.evaluate(ast)).toBe(40);
    });

    it('should evaluate AVERAGE function', () => {
      const ast = {
        type: 'Function',
        name: 'AVERAGE',
        args: [{ type: 'RangeReference', value: 'A1:A2' }]
      };
      expect(parser.evaluate(ast)).toBe(20);
    });
  });

  describe('evaluateExpression', () => {
    beforeEach(() => {
      mockData.set(0, 0, { text: '10' });
      mockData.set(0, 1, { text: '20' });
    });

    it('should evaluate simple formulas', () => {
      expect(parser.evaluateExpression('=1+2', [0, 0])).toBe(3);
    });

    it('should evaluate cell references in formulas', () => {
      expect(parser.evaluateExpression('=A1+B1', [0, 2])).toBe(30);
    });

    it('should evaluate function calls', () => {
      expect(parser.evaluateExpression('=SUM(A1:B1)', [0, 2])).toBe(30);
    });

    it('should return literal values unchanged', () => {
      expect(parser.evaluateExpression('42', [0, 0])).toBe(42);
      expect(parser.evaluateExpression('hello', [0, 0])).toBe('hello');
    });
  });
});
