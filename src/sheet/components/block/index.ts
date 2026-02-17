import Sheet from "src/sheet";
import { Rect } from "src/sheet/interfaces";

export class Block {
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
    constructor(data: any, sheet: Sheet) {
        this.count = data.count;
        this.blockContainer = data.blockContainer;
        this.startRow = data.startRow;
        this.endRow = data.endRow;
        this.startCol = data.startCol;
        this.endCol = data.endCol;
        this.sheet = sheet;
        this.subBlocks = [];
        this.positionBlock();
        this.init();
    }

    static createCanvas = (idx: number | null = null) => {
        // const canvas = this.pool.pop() || document.createElement('canvas');
        const canvas = document.createElement('canvas');
        canvas.className = 'canvas-block';
        // canvas.style.background = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`;
        return canvas;
    }

    positionBlock() {
        // Calculate horizontal position (left)
        // let left = this.rowNumberWidth; // Account for row numbers column
        // for (let col = 0; col < block.startCol; col++) {
        //     left += this.getColWidth(col);
        // }
        const left = this.sheet.metrics.getWidthOffset(this.startCol, true);

        // Calculate vertical position (top)

        const top = this.sheet.heightAccum[this.startRow];

        // Round positions in device pixels so the container aligns with integer
        // canvas pixel sizes and avoids sub-pixel gaps between blocks.
        const dpr = this.sheet.effectiveDevicePixelRatio();
        const leftDp = Math.round(left * dpr);
        const topDp = Math.round(top * dpr);
        const styleLeft = leftDp / dpr;
        const styleTop = topDp / dpr;

        this.blockContainer.style.left = `${styleLeft}px`;
        this.blockContainer.style.top = `${styleTop}px`;
        this.blockContainer.style.display = 'block';

        // block.left = left;
    }

    init() {
        const count = this.count;
        const startRow = this.startRow;
        const endRow = this.endRow;
        const startCol = this.startCol;
        const endCol = this.endCol;
        const fullH = count <= 2;
        const fullW = count <= 1;
        let colMid = Math.floor((startCol + endCol) / 2);
        let rowMid = Math.floor((startRow + endRow) / 2);
        for(let i = 0; i < count; i++) {
            let _startRow = i < 2 ? startRow : rowMid;
            let _startCol = i % 2 === 0 ? startCol : colMid;
            let _endRow = (i >= 2 || fullH) ? endRow : rowMid;
            let _endCol = (i % 2 === 1 || fullW) ? endCol : colMid;
            this.subBlocks.push(new SubBlock({ startRow: _startRow, startCol: _startCol, endRow: _endRow, endCol: _endCol }, this, i));
        }
    }
    render() {
        
    }
}
class SubBlock {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
    parentBlock: Block;
    styleWidth: number;
    styleHeight: number;
    canvas: any;
    index: number;
    sheet: Sheet;
    constructor(dims: Rect, block: Block, index: number) {
        this.startRow = dims.startRow;
        this.sheet = block.sheet;
        this.endRow = dims.endRow;
        this.startCol = dims.startCol;
        this.endCol = dims.endCol;
        this.parentBlock = block;
        this.index = index;
        this.canvas = Block.createCanvas(index);
        this.parentBlock.blockContainer.appendChild(this.canvas);
        this.calculateBlockDimensions();
        this.positionSubBlock();
        this.renderBlock(false);
    }
    positionSubBlock() {
        const i = this.index;
        if (i === 0) return;

        // Calculate vertical position (top)
        const dpr = this.parentBlock.sheet.effectiveDevicePixelRatio();
        if (i === 1 || i === 3) {
            const leftCss = Math.round(this.parentBlock.subBlocks[0].styleWidth * dpr) / dpr;
            this.canvas.style.left = `${leftCss}px`;
        }
        if (i >= 2) {
            const topCss = Math.round(this.parentBlock.subBlocks[0].styleHeight * dpr) / dpr;
            this.canvas.style.top = `${topCss}px`;
        }
    }
    calculateBlockDimensions() {
        let scaleFactor = this.parentBlock.sheet.effectiveDevicePixelRatio();
        // Compute integer canvas pixel sizes to avoid gaps between adjacent blocks
        const widthSum = this.parentBlock.sheet.metrics.getWidthBetweenColumns(this.startCol, this.endCol);
        let widthDp = Math.round(widthSum * scaleFactor);
        const styleWidth = widthDp / scaleFactor;

        // Calculate block height based on rows (in device pixels)
        let heightDp = Math.round(this.parentBlock.sheet.metrics.getHeightBetweenRows(this.startRow, this.endRow) * scaleFactor);
        const styleHeight = heightDp / scaleFactor;
        this.canvas.width = widthDp;
        this.canvas.height = heightDp;
        this.canvas.style.width = `${styleWidth}px`;
        this.canvas.style.height = `${styleHeight}px`;

        this.styleHeight = styleHeight;
        this.styleWidth = styleWidth;
    }
    setBlockCtx(ctx: any) {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333333';
        // const scaler = 88;
        // ctx.strokeStyle = `hsl(0,0%,88%)`;
        ctx.strokeStyle = '#dddddd';
        ctx.lineWidth = 1;
    }

    renderGridlines(ctx: any) {
        let y;
        let x = 0;
        if (this.sheet.gridlinesOn && this.sheet.quality() !== 'performance') {
            ctx.save();
            const dpr = this.sheet.effectiveDevicePixelRatio();
            for (let row = this.startRow; row < this.endRow; row++) {
                // Align stroke to half-pixel so 1px lines render sharply
                y = Math.round(this.sheet.metrics.getHeightBetweenRows(row, this.startRow) * dpr) + 0.5;
                ctx.beginPath();
                ctx.moveTo(0.5, y);
                ctx.lineTo(this.canvas.width - 0.5, y);
                ctx.stroke();
            }
            // draw col grid lines
            for (let col = this.startCol; col < this.endCol; col++) {
                const colWidth = this.sheet.metrics.getColWidth(col);
                // draw col gridlines
                const xCoord = Math.round(x * dpr) + 0.5;
                ctx.beginPath();
                ctx.moveTo(xCoord, 0.5);
                ctx.lineTo(xCoord, this.canvas.height - 0.5);
                ctx.stroke();
                x += colWidth;
            }
            ctx.restore();
        }
    }

    renderBlock(calcDimensions = false) {
        if (calcDimensions) {
            this.calculateBlockDimensions();
            this.positionSubBlock();
        }
        const ctx = this.canvas.getContext('2d');

        this.sheet.applyRenderingQuality(ctx);

        this.setBlockCtx(ctx);

        this.renderGridlines(ctx);

        // console.log(block.startCol, block.endCol)
        for (let col = this.startCol; col < this.endCol; col++) {
            for (let row = this.startRow; row < this.endRow; row++) {
                this.sheet.renderCell(row,col, true);
            }
        }
    }
}