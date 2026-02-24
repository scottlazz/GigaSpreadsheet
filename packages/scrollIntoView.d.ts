export type ScrollMode = 'always' | 'if-needed';
/** @public */
export interface Options {
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
    scrollMode?: ScrollMode;
    boundary?: Element | ((parent: Element) => boolean) | null;
    skipOverflowHiddenElements?: boolean;
}
/** @public */
export interface ScrollAction {
    el: Element;
    top: number;
    left: number;
}
/** @public */
export declare const compute: (target: Element, options: Options) => ScrollAction[];
export default function scrollIntoView<T = unknown>(target: Element, options?: any): T | void;
