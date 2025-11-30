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
export function addBorderStr(curBorder: number | null, borderStr: string) {
    if (curBorder == null) return 0;
    if (borderStr === 'left') return curBorder | borderLeft;
    else if (borderStr === 'top') return curBorder | borderTop;
    else if (borderStr === 'right') return curBorder | borderRight;
    else if (borderStr === 'bottom') return curBorder | borderBottom;
    else { return 0 };
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

export const isNumeric = (num: any) => !isNaN(num) &&
    !Number.isNaN(parseFloat(num));


export function extractClassesFromStyle(styleElement: any) {
    if (!styleElement) return null;
    document.head.appendChild(styleElement);
    const sheet = styleElement.sheet;
    const classes: any = {};
    
    try {
        const rules = sheet.cssRules || sheet.rules;
        
        for (let rule of rules) {
            if (rule.type === CSSRule.STYLE_RULE) {
                const selector = rule.selectorText;
                if (selector.startsWith('.')) {
                    const className = selector.slice(1);
                    classes[className] = {
                        cssText: rule.style.cssText,
                        properties: Object.fromEntries(
                            Array.from(rule.style).map(prop => [
                                prop, 
                                rule.style.getPropertyValue(prop)
                            ])
                        )
                    };
                }
            }
        }
    } catch (e) {
        // console.warn('Error parsing CSS:', e);
    } finally {
        // document.head.removeChild(styleElement);
    }
    
    return classes;
}


export function rgbToHex(rgbString: string) {
    if (!rgbString) return '';
    if (rgbString.startsWith('#')) return rgbString;
  // Extract the R, G, B values from the string
  const match = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

  if (!match) {
    return rgbString; // Invalid RGB string format
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  // Convert each component to its hexadecimal representation
  // and ensure it's always two digits long by padding with a leading '0' if needed.
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const hexR = toHex(r);
  const hexG = toHex(g);
  const hexB = toHex(b);

  return `#${hexR}${hexG}${hexB}`;
}

// function replaceRgbWithHex(input: string): string {
//     if (!input) return input;
//     return input.replace(/rgba?\(\s*[^)]+\)/gi, (match) => {
//         try {
//             return rgbToHex(match) || match;
//         } catch {
//             return match;
//         }
//     });
// }