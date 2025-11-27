// import Giga from "./giga";
import Sheet from "./sheet";
import { fininit } from "./sampledata";

import {GoldenLayout} from 'golden-layout';
import 'golden-layout/dist/css/goldenlayout-base.css';
import goldenConfig from "./goldenConfig";
// import { FormulaBar } from "./sheet/components/formulaBar";

document.addEventListener("DOMContentLoaded", (event) => {
    const container = document.getElementById('grid-wrapper');
    if (!container) {
        console.error('No element with id "grid-wrapper" found');
        return;
    }

    const config = {
        content: [
            {
                type: 'row',
                content: [
                    {
                        type: 'component',
                        componentName: 'giga',
                        title: 'GigaSpreadsheet'
                    },
                    {
                        type: 'component',
                        componentName: 'giga',
                        title: 'GigaSpreadsheet'
                    }
                ]
            }
        ]
    };

    const LayoutClass: any = (GoldenLayout as any) || GoldenLayout;
    const layout: any = new LayoutClass(goldenConfig, container);

    layout.registerComponent('giga', (containerComp: any, componentState: any) => {
        const mount = document.createElement('div');
        const id = 'giga-' + Date.now();
        mount.id = id;
        mount.style.width = '100%';
        mount.style.height = '100%';

        const maybeEl = (containerComp.getElement && containerComp.getElement()) || containerComp.element || containerComp;
        if (maybeEl && (maybeEl as any).appendChild) {
            (maybeEl as any).appendChild(mount);
        } else if (maybeEl && (maybeEl as any).append) {
            (maybeEl as any).append(mount);
        } else if ((containerComp as any).appendChild) {
            (containerComp as any).appendChild(mount);
        }

        new Sheet(mount as any,
            Object.assign({}, fininit, {toolbar: false, cellHeaders: false, formulaBar: false})
        );

        if (containerComp && containerComp.on) {
            containerComp.on('destroy', () => {
                const node = document.getElementById(id);
                if (node && node.parentNode) node.parentNode.removeChild(node);
            });
        }
    });

    layout.init();

    // Make GoldenLayout respond to container size changes and browser zoom (ctrl+/ctrl-)
    // Use ResizeObserver to detect container size changes.
    try {
        const ro = new ResizeObserver(() => {
            if (!layout) return;
            // Call known update methods if available, otherwise fall back to dispatching window resize
            if (typeof layout.updateSize === 'function') {
                layout.updateSize();
            } else if (typeof layout.updateDimensions === 'function') {
                layout.updateDimensions();
            } else {
                window.dispatchEvent(new Event('resize'));
            }
        });
        ro.observe(container);

        // Watch for devicePixelRatio changes (some browsers don't fire resize on zoom)
        let lastDPR = window.devicePixelRatio;
        const dprInterval = window.setInterval(() => {
            if (window.devicePixelRatio !== lastDPR) {
                lastDPR = window.devicePixelRatio;
                if (typeof layout.updateSize === 'function') {
                    layout.updateSize();
                } else {
                    window.dispatchEvent(new Event('resize'));
                }
            }
        }, 200);

        // Clean up on unload
        window.addEventListener('beforeunload', () => {
            try { ro.disconnect(); } catch (e) {}
            try { window.clearInterval(dprInterval); } catch (e) {}
        });
    } catch (e) {
        // ResizeObserver may not be available in very old envs; fallback to window resize
        window.addEventListener('resize', () => {
            if (typeof layout.updateSize === 'function') layout.updateSize();
        });
    }
});
