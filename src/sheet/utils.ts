export const borderLeft = (1 << 1);
export const borderTop = (1 << 2);
export const borderRight = (1 << 3);
export const borderBottom = (1 << 4);

export function addBorder(curBorder: number | null, border: number) {
    if (!curBorder) return border;
    return curBorder | border;
}

export function removeBorder(curBorder: number | null, border: number) {
    if (!curBorder) return 0;
    return border ^ curBorder;
}
export function hasBorder(curBorder: number | null, border: number) {
    if (!curBorder) return false;
    return border === (border&curBorder);
}
export function hasBorderStr(curBorder: number | null, borderStr: string) {
    if (!curBorder) return false;
    let border: number;
    if (borderStr === 'left') border = borderLeft;
    else if (borderStr === 'top') border = borderTop;
    else if (borderStr === 'right') border = borderRight;
    else if (borderStr === 'bottom') border = borderBottom;
    else { return 0 };
    return border === (border&curBorder);
}
export function mkel(tag='div', className='', children?: string) {
    const el = document.createElement(tag);
    el.className = className;
    if (children) {
        el.innerHTML = children;
    }
    return el;
}

export const arrows = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);