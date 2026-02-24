const isElement = (el) => typeof el === 'object' && el != null && el.nodeType === 1;
const canOverflow = (overflow, skipOverflowHiddenElements) => {
    if (skipOverflowHiddenElements && overflow === 'hidden') {
        return false;
    }
    return overflow !== 'visible' && overflow !== 'clip';
};
const getFrameElement = (el) => {
    if (!el.ownerDocument || !el.ownerDocument.defaultView) {
        return null;
    }
    try {
        return el.ownerDocument.defaultView.frameElement;
    }
    catch (e) {
        return null;
    }
};
const isHiddenByFrame = (el) => {
    const frame = getFrameElement(el);
    if (!frame) {
        return false;
    }
    return (frame.clientHeight < el.scrollHeight || frame.clientWidth < el.scrollWidth);
};
const isScrollable = (el, skipOverflowHiddenElements) => {
    if (el.clientHeight < el.scrollHeight || el.clientWidth < el.scrollWidth) {
        const style = getComputedStyle(el, null);
        return (canOverflow(style.overflowY, skipOverflowHiddenElements) ||
            canOverflow(style.overflowX, skipOverflowHiddenElements) ||
            isHiddenByFrame(el));
    }
    return false;
};
const alignNearest = (scrollingEdgeStart, scrollingEdgeEnd, scrollingSize, scrollingBorderStart, scrollingBorderEnd, elementEdgeStart, elementEdgeEnd, elementSize) => {
    if ((elementEdgeStart < scrollingEdgeStart &&
        elementEdgeEnd > scrollingEdgeEnd) ||
        (elementEdgeStart > scrollingEdgeStart && elementEdgeEnd < scrollingEdgeEnd)) {
        return 0;
    }
    if ((elementEdgeStart <= scrollingEdgeStart && elementSize <= scrollingSize) ||
        (elementEdgeEnd >= scrollingEdgeEnd && elementSize >= scrollingSize)) {
        return elementEdgeStart - scrollingEdgeStart - scrollingBorderStart;
    }
    if ((elementEdgeEnd > scrollingEdgeEnd && elementSize < scrollingSize) ||
        (elementEdgeStart < scrollingEdgeStart && elementSize > scrollingSize)) {
        return elementEdgeEnd - scrollingEdgeEnd + scrollingBorderEnd;
    }
    return 0;
};
const getParentElement = (element) => {
    const parent = element.parentElement;
    if (parent == null) {
        return element.getRootNode().host || null;
    }
    return parent;
};
const getScrollMargins = (target) => {
    const computedStyle = window.getComputedStyle(target);
    return {
        top: parseFloat(computedStyle.scrollMarginTop) || 0,
        right: parseFloat(computedStyle.scrollMarginRight) || 0,
        bottom: parseFloat(computedStyle.scrollMarginBottom) || 0,
        left: parseFloat(computedStyle.scrollMarginLeft) || 0,
    };
};
/** @public */
export const compute = (target, options) => {
    var _a, _b, _c, _d;
    if (typeof document === 'undefined') {
        return [];
    }
    const { scrollMode, block, inline, boundary, skipOverflowHiddenElements } = options;
    const checkBoundary = typeof boundary === 'function' ? boundary : (node) => node !== boundary;
    if (!isElement(target)) {
        throw new TypeError('Invalid target');
    }
    const scrollingElement = document.scrollingElement || document.documentElement;
    const frames = [];
    let cursor = target;
    while (isElement(cursor) && checkBoundary(cursor)) {
        cursor = getParentElement(cursor);
        if (cursor === scrollingElement) {
            frames.push(cursor);
            break;
        }
        if (cursor != null &&
            cursor === document.body &&
            isScrollable(cursor) &&
            !isScrollable(document.documentElement)) {
            continue;
        }
        if (cursor != null && isScrollable(cursor, skipOverflowHiddenElements)) {
            frames.push(cursor);
        }
    }
    const viewportWidth = (_b = (_a = window.visualViewport) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : innerWidth;
    const viewportHeight = (_d = (_c = window.visualViewport) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : innerHeight;
    const { scrollX, scrollY } = window;
    const { height: targetHeight, width: targetWidth, top: targetTop, right: targetRight, bottom: targetBottom, left: targetLeft, } = target.getBoundingClientRect();
    const { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft, } = getScrollMargins(target);
    let targetBlock = block === 'start' || block === 'nearest'
        ? targetTop - marginTop
        : block === 'end'
            ? targetBottom + marginBottom
            : targetTop + targetHeight / 2 - marginTop + marginBottom; // block === 'center
    let targetInline = inline === 'center'
        ? targetLeft + targetWidth / 2 - marginLeft + marginRight
        : inline === 'end'
            ? targetRight + marginRight
            : targetLeft - marginLeft; // inline === 'start || inline === 'nearest
    const computations = [];
    for (let index = 0; index < frames.length; index++) {
        const frame = frames[index];
        const { height, width, top, right, bottom, left } = frame.getBoundingClientRect();
        if (scrollMode === 'if-needed' &&
            targetTop >= 0 &&
            targetLeft >= 0 &&
            targetBottom <= viewportHeight &&
            targetRight <= viewportWidth &&
            ((frame === scrollingElement && !isScrollable(frame)) ||
                (targetTop >= top &&
                    targetBottom <= bottom &&
                    targetLeft >= left &&
                    targetRight <= right))) {
            return computations;
        }
        const frameStyle = getComputedStyle(frame);
        const borderLeft = parseInt(frameStyle.borderLeftWidth, 10);
        const borderTop = parseInt(frameStyle.borderTopWidth, 10);
        const borderRight = parseInt(frameStyle.borderRightWidth, 10);
        const borderBottom = parseInt(frameStyle.borderBottomWidth, 10);
        let blockScroll = 0;
        let inlineScroll = 0;
        const scrollbarWidth = 'offsetWidth' in frame
            ? frame.offsetWidth -
                frame.clientWidth -
                borderLeft -
                borderRight
            : 0;
        const scrollbarHeight = 'offsetHeight' in frame
            ? frame.offsetHeight -
                frame.clientHeight -
                borderTop -
                borderBottom
            : 0;
        const scaleX = 'offsetWidth' in frame
            ? frame.offsetWidth === 0
                ? 0
                : width / frame.offsetWidth
            : 0;
        const scaleY = 'offsetHeight' in frame
            ? frame.offsetHeight === 0
                ? 0
                : height / frame.offsetHeight
            : 0;
        if (scrollingElement === frame) {
            if (block === 'start') {
                blockScroll = targetBlock;
            }
            else if (block === 'end') {
                blockScroll = targetBlock - viewportHeight;
            }
            else if (block === 'nearest') {
                blockScroll = alignNearest(scrollY, scrollY + viewportHeight, viewportHeight, borderTop, borderBottom, scrollY + targetBlock, scrollY + targetBlock + targetHeight, targetHeight);
            }
            else {
                blockScroll = targetBlock - viewportHeight / 2;
            }
            if (inline === 'start') {
                inlineScroll = targetInline;
            }
            else if (inline === 'center') {
                inlineScroll = targetInline - viewportWidth / 2;
            }
            else if (inline === 'end') {
                inlineScroll = targetInline - viewportWidth;
            }
            else {
                inlineScroll = alignNearest(scrollX, scrollX + viewportWidth, viewportWidth, borderLeft, borderRight, scrollX + targetInline, scrollX + targetInline + targetWidth, targetWidth);
            }
            blockScroll = Math.max(0, blockScroll + scrollY);
            inlineScroll = Math.max(0, inlineScroll + scrollX);
        }
        else {
            if (block === 'start') {
                blockScroll = targetBlock - top - borderTop;
            }
            else if (block === 'end') {
                blockScroll = targetBlock - bottom + borderBottom + scrollbarHeight;
            }
            else if (block === 'nearest') {
                blockScroll = alignNearest(top, bottom, height, borderTop, borderBottom + scrollbarHeight, targetBlock, targetBlock + targetHeight, targetHeight);
            }
            else {
                blockScroll = targetBlock - (top + height / 2) + scrollbarHeight / 2;
            }
            if (inline === 'start') {
                inlineScroll = targetInline - left - borderLeft;
            }
            else if (inline === 'center') {
                inlineScroll = targetInline - (left + width / 2) + scrollbarWidth / 2;
            }
            else if (inline === 'end') {
                inlineScroll = targetInline - right + borderRight + scrollbarWidth;
            }
            else {
                inlineScroll = alignNearest(left, right, width, borderLeft, borderRight + scrollbarWidth, targetInline, targetInline + targetWidth, targetWidth);
            }
            const { scrollLeft, scrollTop } = frame;
            blockScroll =
                scaleY === 0
                    ? 0
                    : Math.max(0, Math.min(scrollTop + blockScroll / scaleY, frame.scrollHeight - height / scaleY + scrollbarHeight));
            inlineScroll =
                scaleX === 0
                    ? 0
                    : Math.max(0, Math.min(scrollLeft + inlineScroll / scaleX, frame.scrollWidth - width / scaleX + scrollbarWidth));
            targetBlock += scrollTop - blockScroll;
            targetInline += scrollLeft - inlineScroll;
        }
        computations.push({ el: frame, top: blockScroll, left: inlineScroll });
    }
    return computations;
};
const isStandardScrollBehavior = (options) => options === Object(options) && Object.keys(options).length !== 0;
const getOptions = (options) => {
    if (options === false) {
        return { block: 'end', inline: 'nearest' };
    }
    if (isStandardScrollBehavior(options)) {
        return options;
    }
    return { block: 'start', inline: 'nearest' };
};
export default function scrollIntoView(target, options) {
    const margins = getScrollMargins(target);
    const behavior = typeof options === 'boolean' ? undefined : options === null || options === void 0 ? void 0 : options.behavior;
    for (const { el, top, left } of compute(target, getOptions(options))) {
        const adjustedTop = top - margins.top + margins.bottom;
        const adjustedLeft = left - margins.left + margins.right;
        el.scroll({ top: adjustedTop, left: adjustedLeft, behavior });
    }
}
