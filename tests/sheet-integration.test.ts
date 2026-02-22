import Sheet from '../src/sheet';

describe('Sheet Integration Tests', () => {
  let container: HTMLElement;
  let sheet: Sheet;

  beforeEach(() => {
    // Create a DOM container for the sheet
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    document.body.appendChild(container);

    // Initialize sheet
    sheet = new Sheet(container, {
      cellWidth: 64,
      cellHeight: 20,
      blockRows: 10,
      blockCols: 10,
      cellHeaders: true
    });
  });

  afterEach(() => {
    // Clean up
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('Sheet initialization', () => {
    it('should initialize with correct dimensions', () => {
      expect(sheet.cellWidth).toBe(64);
      expect(sheet.cellHeight).toBe(20);
      expect(sheet.blockRows).toBe(10);
      expect(sheet.blockCols).toBe(10);
    });

    it('should create DOM elements', () => {
      expect(container.querySelector('.grid-container')).toBeTruthy();
      expect(container.querySelector('.selection-layer')).toBeTruthy();
      expect(container.querySelector('.corner-cell')).toBeTruthy();
    });
  });

  describe('Selection operations', () => {
    it('should select cells', () => {
      sheet.selectCell({ row: 0, col: 0 });
      expect(sheet.selectionStart).toEqual({ row: 0, col: 0 });
      expect(sheet.selectionEnd).toEqual({ row: 0, col: 0 });
    });

    it('should get selected cells', () => {
      sheet.selectCell({ row: 0, col: 0 });
      const selectedCells = sheet.getSelectedCells();
      expect(selectedCells).toHaveLength(1);
      expect(selectedCells[0]).toHaveProperty('row', 0);
      expect(selectedCells[0]).toHaveProperty('col', 0);
    });
  });

  describe('Data manipulation', () => {
    it('should insert rows', () => {
      sheet.setText(0, 0, 'original');
      sheet.insertRow(0); // Insert row at the beginning

      // Original cell should now be at row 1
      expect(sheet.getCellText(1, 0)).toBe('original');
    });

    it('should delete rows', () => {
      sheet.setText(0, 0, 'to delete');
      sheet.setText(1, 0, 'to keep');

      sheet.deleteRow(0); // Delete first row

      // Second row should now be first
      expect(sheet.getCellText(0, 0)).toBe('to keep');
    });
  });

  describe('Formula evaluation', () => {
    it('should evaluate basic formulas', () => {
      sheet.setText(0, 0, '5');
      sheet.setText(0, 1, '10');
      sheet.setText(0, 2, '=A1+B1');

      // Check that the formula is stored
      expect(sheet.getCellText(0, 2)).toBe('=A1+B1');

      // Test evaluation directly
      const result = sheet.parser.evaluateExpression('=A1+B1', [0, 2]);
      expect(result).toBe(15);
    });

    it('should handle formula dependencies', () => {
      sheet.setText(0, 0, '5');
      sheet.setText(0, 1, '=A1*2');
      sheet.setText(0, 2, '=B1+5');

      // Check that formulas are stored
      expect(sheet.getCellText(0, 1)).toBe('=A1*2');
      expect(sheet.getCellText(0, 2)).toBe('=B1+5');

      // Test evaluation
      expect(sheet.parser.evaluateExpression('=A1*2', [0, 1])).toBe(10);
      expect(sheet.parser.evaluateExpression('=B1+5', [0, 2])).toBe(15);

      // Change the dependency
      sheet.setText(0, 0, '10');

      expect(sheet.parser.evaluateExpression('=A1*2', [0, 1])).toBe(20);
      expect(sheet.parser.evaluateExpression('=B1+5', [0, 2])).toBe(25);
    });
  });

  describe('Copy and paste operations', () => {
    it('should copy and paste cell values', () => {
      sheet.setText(0, 0, 'test value');
      sheet.selectCell({ row: 0, col: 0 });

      // Get selected cell data
      const selectedData = sheet.getSelectedCellDataSparse();
      expect(selectedData).toHaveLength(1);
      expect(selectedData[0].text).toBe('test value');

      // Paste to another cell using paste handler
      sheet.selectCell({ row: 1, col: 1 });

      // Create mock paste data
      const pasteData = {
        srcCell: { row: 0, col: 0 },
        configs: [{ row: 0, col: 0, text: 'test value', _id: null }],
        merges: []
      };

      sheet.pasteHandler.handlePasteData(JSON.stringify(pasteData), null as any);

      expect(sheet.getCellText(1, 1)).toBe('test value');
    });

    it('should copy and paste ranges', () => {
      sheet.setText(0, 0, 'A1');
      sheet.setText(0, 1, 'B1');
      sheet.setText(1, 0, 'A2');
      sheet.setText(1, 1, 'B2');

      // Select range
      sheet.selectCell({ row: 0, col: 0 });
      sheet.selectCell({ row: 1, col: 1, continuation: true });

      // Get selected data
      const selectedData = sheet.getSelectedCellDataSparse();
      expect(selectedData).toHaveLength(4);

      // Paste to another location
      sheet.selectCell({ row: 2, col: 2 });

      const pasteData = {
        srcCell: { row: 0, col: 0 },
        configs: [
          { row: 0, col: 0, text: 'A1', _id: null },
          { row: 0, col: 1, text: 'B1', _id: null },
          { row: 1, col: 0, text: 'A2', _id: null },
          { row: 1, col: 1, text: 'B2', _id: null }
        ],
        merges: []
      };

      sheet.pasteHandler.handlePasteData(JSON.stringify(pasteData), null as any);

      expect(sheet.getCellText(2, 2)).toBe('A1');
      expect(sheet.getCellText(2, 3)).toBe('B1');
      expect(sheet.getCellText(3, 2)).toBe('A2');
      expect(sheet.getCellText(3, 3)).toBe('B2');
    });
  });

  describe('Complex operations', () => {
    it('should handle merged cells', () => {
      sheet.selectCell({ row: 0, col: 0 });
      sheet.selectCell({ row: 0, col: 1, continuation: true });

      sheet.setText(0, 0, 'merged content');
      sheet.mergeSelectedCells();

      expect(sheet.mergedCells).toHaveLength(1);
      expect(sheet.mergedCells[0]).toEqual({ startRow: 0, startCol: 0, endRow: 0, endCol: 1 });
    });

    it('should handle column operations', () => {
      sheet.selectCell({ row: 0, col: 0 });
      sheet.setText(0, 0, 'col test');
      sheet.insertCol(0);

      // Original content should shift right
      expect(sheet.getCellText(0, 1)).toBe('col test');
    });

    it('should handle undo/redo of complex operations', () => {
      sheet.setText(0, 0, 'original');
      sheet.setText(0, 0, 'modified');

      sheet.historyManager.undo();
      expect(sheet.getCellText(0, 0)).toBe('original');

      sheet.historyManager.redo();
      expect(sheet.getCellText(0, 0)).toBe('modified');
    });
  });
});