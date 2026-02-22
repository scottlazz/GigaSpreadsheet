import SparseGrid from '../src/packages/sparsegrid';

describe('SparseGrid', () => {
  let grid: SparseGrid;

  beforeEach(() => {
    grid = new SparseGrid();
  });

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      expect(grid.totalRows).toBe(0);
      expect(grid.totalColumns).toBe(0);
      expect(grid.totalValues).toBe(0);
      expect(grid.topRow).toBeNull();
      expect(grid.bottomRow).toBeNull();
      expect(grid.leftCol).toBeNull();
      expect(grid.rightCol).toBeNull();
    });
  });

  describe('set and get', () => {
    it('should set and get a cell value', () => {
      const cell = { value: 'test' };
      grid.set(0, 0, cell);

      expect(grid.get(0, 0)).toEqual({ ...cell, _id: expect.any(Number) });
      expect(grid.has(0, 0)).toBe(true);
    });

    it('should return default cell object for empty cells', () => {
      const result = grid.get(0, 0);
      expect(result).toEqual({ row: 0, col: 0 });
    });

    it('should throw error for non-integer coordinates', () => {
      expect(() => grid.set(0.5, 0, {})).toThrow('Coordinates must be integers');
      expect(() => grid.set(0, 0.5, {})).toThrow('Coordinates must be integers');
    });
  });

  describe('boundaries', () => {
    it('should update boundaries when setting cells', () => {
      grid.set(1, 2, { value: 'a' });
      grid.set(3, 4, { value: 'b' });

      expect(grid.topRow).toBe(1);
      expect(grid.bottomRow).toBe(3);
      expect(grid.leftCol).toBe(2);
      expect(grid.rightCol).toBe(4);
    });

    it('should recalculate boundaries after deletion', () => {
      grid.set(1, 2, { value: 'a' });
      grid.set(3, 4, { value: 'b' });
      grid.delete(1, 2);

      expect(grid.topRow).toBe(3);
      expect(grid.bottomRow).toBe(3);
      expect(grid.leftCol).toBe(4);
      expect(grid.rightCol).toBe(4);
    });
  });

  describe('deletion', () => {
    it('should delete existing cells', () => {
      grid.set(0, 0, { value: 'test' });
      expect(grid.has(0, 0)).toBe(true);

      const result = grid.delete(0, 0);
      expect(result).toBe(true);
      expect(grid.has(0, 0)).toBe(false);
    });

    it('should return false for non-existing cells', () => {
      const result = grid.delete(0, 0);
      expect(result).toBe(false);
    });

    it('should clean up empty rows', () => {
      grid.set(0, 0, { value: 'test' });
      grid.set(0, 1, { value: 'test2' });
      grid.delete(0, 0);
      grid.delete(0, 1);

      expect(grid.has(0)).toBe(false);
      expect(grid.totalRows).toBe(0);
    });
  });

  describe('row operations', () => {
    it('should add and delete rows', () => {
      grid.set(0, 0, { value: 'a' });
      grid.set(1, 0, { value: 'b' });

      grid.addRow(1, [{ value: 'c' }]);
      expect(grid.get(1, 0).value).toBe('c');
      expect(grid.get(2, 0).value).toBe('b');

      const deletedRow = grid.deleteRow(1);
      expect(deletedRow[0].value).toBe('c');
    });
  });

  describe('column operations', () => {
    it('should add and delete columns', () => {
      grid.set(0, 0, { value: 'a' });
      grid.set(0, 1, { value: 'b' });

      grid.addCol(1, [{ value: 'c' }]);
      expect(grid.get(0, 1).value).toBe('c');
      expect(grid.get(0, 2).value).toBe('b');

      const deletedCol = grid.deleteCol(1);
      expect(deletedCol[0].value).toBe('c');
    });
  });

  describe('serialization', () => {
    it('should save and restore state', () => {
      grid.set(0, 0, { value: 'test' });
      grid.set(1, 1, { value: 'test2' });

      const saved = grid.save();
      const newGrid = new SparseGrid();
      newGrid.restore(saved);

      expect(newGrid.get(0, 0).value).toBe('test');
      expect(newGrid.get(1, 1).value).toBe('test2');
      expect(newGrid.totalValues).toBe(2);
    });
  });

  describe('iteration', () => {
    it('should iterate over all cells', () => {
      grid.set(0, 0, { value: 'a' });
      grid.set(0, 1, { value: 'b' });
      grid.set(1, 0, { value: 'c' });

      const cells: any[] = [];
      grid.forEach((cell, row, col) => {
        cells.push({ cell, row: Number(row), col: Number(col) });
      });

      expect(cells).toHaveLength(3);
      expect(cells.map(c => c.cell.value)).toEqual(expect.arrayContaining(['a', 'b', 'c']));
    });
  });

  describe('range queries', () => {
    it('should get cells in range', () => {
      grid.set(0, 0, { value: 'a' });
      grid.set(0, 1, { value: 'b' });
      grid.set(1, 0, { value: 'c' });
      grid.set(1, 1, { value: 'd' });
      grid.set(2, 2, { value: 'e' });

      const cells = grid.getCells(0, 0, 1, 1);
      expect(cells).toHaveLength(4);
      expect(cells.map(c => c.value.value)).toEqual(['a', 'b', 'c', 'd']);
    });

    it('should get all cells', () => {
      grid.set(0, 0, { value: 'a' });
      grid.set(1, 1, { value: 'b' });

      const cells = grid.getAllCells();
      expect(cells).toHaveLength(2);
      expect(cells.map(c => c.value)).toEqual(['a', 'b']);
    });
  });
});
