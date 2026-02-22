import { addBorder, hasBorder, hasBorderStr, addBorderStr, borderLeft, borderTop, borderRight, borderBottom } from '../src/sheet/utils';

describe('Border utilities', () => {
  describe('addBorder', () => {
    it('should add a border to null', () => {
      expect(addBorder(null, borderLeft)).toBe(borderLeft);
    });

    it('should add a border to existing borders', () => {
      const result = addBorder(borderLeft, borderTop);
      expect(result).toBe(borderLeft | borderTop);
    });
  });

  describe('hasBorder', () => {
    it('should return false for null border', () => {
      expect(hasBorder(null, borderLeft)).toBe(false);
    });

    it('should return true when border exists', () => {
      expect(hasBorder(borderLeft | borderTop, borderLeft)).toBe(true);
    });

    it('should return false when border does not exist', () => {
      expect(hasBorder(borderLeft, borderTop)).toBe(false);
    });
  });

  describe('hasBorderStr', () => {
    it('should return false for null border', () => {
      expect(hasBorderStr(null, 'left')).toBe(false);
    });

    it('should return true for numeric border with left', () => {
      expect(hasBorderStr(borderLeft, 'left')).toBe(true);
    });

    it('should return false for numeric border without left', () => {
      expect(hasBorderStr(borderTop, 'left')).toBe(false);
    });

    it('should handle string border format', () => {
      const borderStr = JSON.stringify({ left: true });
      expect(hasBorderStr(borderStr, 'left')).toBe(true);
    });

    it('should return false for invalid JSON string', () => {
      expect(hasBorderStr('invalid json', 'left')).toBe(false);
    });
  });

  describe('addBorderStr', () => {
    it('should return 0 for null border', () => {
      expect(addBorderStr(null, 'left')).toBe(0);
    });

    it('should add left border', () => {
      expect(addBorderStr(0, 'left')).toBe(borderLeft);
    });

    it('should add top border', () => {
      expect(addBorderStr(0, 'top')).toBe(borderTop);
    });

    it('should add right border', () => {
      expect(addBorderStr(0, 'right')).toBe(borderRight);
    });

    it('should add bottom border', () => {
      expect(addBorderStr(0, 'bottom')).toBe(borderBottom);
    });

    it('should return 0 for invalid border string', () => {
      expect(addBorderStr(0, 'invalid')).toBe(0);
    });
  });
});
