// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"eZFTg":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "9eacdeebc9112ede";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"9Fk10":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _giga = require("./giga");
var _gigaDefault = parcelHelpers.interopDefault(_giga);
document.addEventListener("DOMContentLoaded", (event)=>{
    const grid = new (0, _gigaDefault.default)('grid-wrapper');
});

},{"./giga":"bR8l7","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bR8l7":[function(require,module,exports,__globalThis) {
// @ts-ignore
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _bottomBar = require("src/sheet/components/bottomBar");
var _sheet = require("../sheet");
var _sheetDefault = parcelHelpers.interopDefault(_sheet);
class Giga {
    constructor(wrapperId, options){
        this.curId = 1;
        this.curActiveGridId = 1;
        this.activeGrids = new Map();
        this.wrapper = document.getElementById(wrapperId) || document.createElement('div');
        const _container = document.createElement('div');
        this._container = _container;
        _container.style.width = '100%';
        _container.style.height = '100%';
        _container.style.display = 'flex';
        _container.style.flexDirection = 'column';
        _container.innerHTML = `
            <div id="sheets-container" class="sheets-container" style="display:flex;flex:1;flex-direction:column;height:calc(100% - 40px);">
            </div>
        `;
        this.bottomBar = new (0, _bottomBar.BottomBar)();
        _container.appendChild(this.bottomBar.container);
        this.wrapper.appendChild(_container);
        this.addSheetButton = _container.querySelector('.gigasheet-icon-img.add');
        this.sheetsContainer = _container.querySelector('.sheets-container');
        this.initEventListeners();
        this.initSheets(options);
    }
    initEventListeners() {
        this.addSheetButton.onclick = (e)=>{
            e.preventDefault();
            this.addGrid();
        };
        this.bottomBar.onTabClicked((tab)=>{
            this.switchTab(tab);
        });
    }
    switchTab(tab) {
        const grid = this.activeGrids.get(tab);
        if (!grid) return;
        for (let child of this.sheetsContainer.children)child.style.display = 'none';
        grid._container.style.display = 'flex';
    }
    getDefaultOptions() {
        return {
            gridlinesOn: true
        };
    }
    addGrid(options) {
        for (let child of this.sheetsContainer.children)child.style.display = 'none';
        this.activeGrids.set(String(this.curId++), new (0, _sheetDefault.default)(this.sheetsContainer, options || this.getDefaultOptions()));
        this.bottomBar.addTab('Sheet', this.curId - 1);
    }
    initSheets(options) {
        if (options == null || !(options.length > 0)) this.addGrid();
        else for(let i = 0; i < options.length; i++)this.addGrid(options);
    }
}
exports.default = Giga;

},{"src/sheet/components/bottomBar":"1c6wl","../sheet":"cIFaS","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"1c6wl":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "BottomBar", ()=>BottomBar);
class BottomBar {
    constructor(){
        this.container = document.createElement('div');
        this.container.className = 'gigasheet-bottombar';
        this.container.innerHTML = `
            <div class="gigasheet-contextmenu" style="width: 160px; display: none; left: 271px; bottom: 41px;">
                <div class="gigasheet-item">Delete</div>
            </div>
            <ul class="gigasheet-menu">
                <li class="">
                    <div class="gigasheet-icon">
                        <div class="gigasheet-icon-img add"></div>
                    </div><span class="">
                        <div class="gigasheet-dropdown top-left">
                            <div class="gigasheet-dropdown-header">
                                <div class="gigasheet-icon">
                                    <div class="gigasheet-icon-img ellipsis"></div>
                                </div>
                            </div>
                            <div class="gigasheet-dropdown-content" style="width: auto; display: none;">
                                <div class="gigasheet-item" style="width: 150px; font-weight: normal;">Sheet1</div>
                            </div>
                        </div>
                    </span>
                </li>
            </ul>
        `;
        this.menu = this.container.querySelector('.gigasheet-menu');
        this.active = 1;
        this.tabCbs = [];
        this.addListeners();
    }
    addListeners() {
        this.menu.addEventListener('click', (e)=>{
            if (e.target.hasAttribute('data-tabid')) {
                if (e.target.getAttribute('data-tabid') === String(this.active)) return;
                this.setActive(e.target.getAttribute('data-tabid'));
            }
        });
    }
    setActive(id) {
        const el = this.container.querySelector(`[data-tabid='${id}']`);
        if (!el) return;
        this.removeActive();
        this.active = id;
        el.classList.add('active');
        this.emit(id);
    }
    emit(value) {
        this.tabCbs.forEach((fn)=>{
            fn(value);
        });
    }
    onTabClicked(fn) {
        this.tabCbs.push(fn);
    }
    removeActive() {
        const tabContainer = this.container.querySelector('.gigasheet-menu');
        for (let tab of tabContainer.children)tab.classList.remove('active');
    }
    addTab(name, id) {
        const container = this.container;
        this.active = id;
        const tabContainer = container.querySelector('.gigasheet-menu');
        this.removeActive();
        if (tabContainer.lastElementChild) tabContainer.lastElementChild.insertAdjacentHTML('afterend', `<li data-tabid="${id}" class="active">Sheet${id}</div>`);
        else tabContainer.innerHTML = '<li data-tabid="1" class="active gigasheet-bottom-tab">Sheet1</li>';
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"jnFvT":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"cIFaS":[function(require,module,exports,__globalThis) {
// @ts-ignore
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _sparsegrid = require("packages/sparsegrid");
var _sparsegridDefault = parcelHelpers.interopDefault(_sparsegrid);
// @ts-ignore
var _expressionparser = require("packages/expressionparser");
var _expressionparserDefault = parcelHelpers.interopDefault(_expressionparser);
// @ts-ignore
var _format = require("./windows/format");
// @ts-ignore
var _linechartJs = require("./graphs/linechart.js");
// @ts-ignore
var _index = require("packages/financial/index");
var _indexDefault = parcelHelpers.interopDefault(_index);
// @ts-ignore
var _dependencytracker = require("packages/dependencytracker");
var _utils = require("./utils");
var _shiftops = require("./shiftops");
var _templates = require("./templates");
var _contextmenu = require("./components/contextmenu");
var _contextmenuDefault = parcelHelpers.interopDefault(_contextmenu);
class Sheet {
    constructor(wrapper, options, state){
        this.wrapper = wrapper || document.createElement('div');
        const _container = document.createElement('div');
        this._container = _container;
        _container.style.width = '100%';
        _container.style.height = '100%';
        _container.style.display = 'flex';
        _container.style.flexDirection = 'column';
        // _container.style.maxHeight = 'calc(100vh - 40px)';
        _container.innerHTML = `
        ${0, _templates.header}
        <div id="grid-container" class="grid-container">
            <div id="corner-cell" class="corner-cell"></div>
            <div id="header-container" class="header-container"></div>
            <div id="row-number-container" class="row-number-container"></div>
            <div id="selection-layer" class="selection-layer"></div>
        </div>
        `;
        this.container = _container.querySelector('.grid-container');
        this.wrapper.appendChild(_container);
        this.ctxmenu = new (0, _contextmenuDefault.default)();
        _container.append(this.ctxmenu.container);
        // this.container.style.minHeight = '100%';
        this.container.style.width = '100%';
        // this.container.style.height = '100%';
        this.container.style.position = 'relative';
        this.container.style.overflow = 'auto';
        this.container.scrollLeft = 0;
        this.container.scrollTop = 0;
        this.headerContainer = _container.querySelector('.header-container');
        this.rowNumberContainer = _container.querySelector('.row-number-container');
        this.cornerCell = _container.querySelector('.corner-cell');
        this.selectionLayer = _container.querySelector('.selection-layer');
        this.mergeButton = _container.querySelector('.merge-button');
        this.formatButton = _container.querySelector('.format-button');
        this.lastDevicePixelRatio = window.devicePixelRatio;
        this.lastBlockCanvases = this.blockCanvases();
        // const rect = this.container.getBoundingClientRect();
        // this.cornerCell.style.top = `${rect.y}px`;
        // Configuration
        this.cellWidth = options.cellWidth ?? 64;
        this.cellHeight = options.cellHeight ?? 20;
        this.blockRows = options.blockRows ?? 28; // Max rows per canvas block
        this.blockCols = options.blockCols ?? 30; // Max cols per canvas block
        this.paddingBlocks = options.paddingBlocks ?? 1; // Extra blocks to render around visible area
        this.padding = options.padding || 1; // number of adjacent blocks to render
        this.MAX_HISTORY_SIZE = 100;
        this.rowNumberWidth = 42;
        this.headerRowHeight = this.cellHeight || 30;
        // this.headerContainer.style.height = `${this.headerRowHeight}px`;
        this.headerContainer.style.lineHeight = `${this.headerRowHeight}px`;
        this.selectionLayer.style.top = `${this.headerRowHeight}px`;
        this.selectionLayer.style.left = `${this.rowNumberWidth}px`;
        this.rowNumberContainer.style.width = `${this.rowNumberWidth}px`;
        this.rowNumberContainer.style.lineHeight = `${this.headerRowHeight}px`;
        this.cornerCell.style.width = `${this.rowNumberWidth}px`;
        this.cornerCell.style.height = `${this.headerRowHeight}px`;
        this.cornerCell.style.marginTop = `-${this.headerRowHeight + 1}px`; // -1 for border
        if (options.subscribeFinance) this.subscribeFinance();
        // State
        this.mergedCells = options.mergedCells || [];
        this.heightOverrides = this.buildOverrides(options.heightOverrides);
        this.widthOverrides = this.buildOverrides(options.widthOverrides);
        this.gridlinesOn = options.gridlinesOn ?? true;
        this.activeBlocks = new Map(); // Track active canvas blocks
        // window.activeBlocks = this.activeBlocks;
        // window.renderBlock = this.renderBlock.bind(this);
        this.undoStack = [];
        this.redoStack = [];
        this.elRegistry = {};
        this.heightAccum = [];
        this.widthAccum = [];
        this.isResizing = false;
        this.resizeStart = null;
        this.resizeInitialSize = null;
        this.busy = false;
        // Selection state
        this.selectedCell = null;
        this.isSelecting = false;
        this.selectionStart = null;
        this.selectionEnd = null;
        this.selectionHandle = null;
        this.draggingHeader = null;
        this.selectedCols = new Set();
        this.selectedRows = new Set();
        // Metrics
        this.visibleStartRow = 0;
        this.visibleEndRow = 0;
        this.visibleStartCol = 0;
        this.visibleEndCol = 0;
        // Initialize
        this.initEventListeners();
        this.createSelectionHandle();
        this.addNewSelection();
        // Add edit input element
        this.editInput = document.createElement('input');
        this.editInput.className = 'cell-edit-input';
        this.editInput.style.position = 'absolute';
        this.editInput.style.display = 'none';
        this.container.appendChild(this.editInput);
        this.initRender();
        this.data = null;
        this.parser = null;
        // if (!this.restoreSave()) {
        this.setData(new (0, _sparsegridDefault.default)(), options.initialCells);
    // }
    }
    initRender() {
        this.updateGridDimensions();
        this.renderHeaders();
        this.renderRowNumbers();
        this.updateVisibleGrid();
    }
    buildOverrides(overrides) {
        if (!overrides) return [];
        const _overrides = [];
        for(let key in overrides)_overrides[key] = overrides[key];
        return _overrides;
    }
    subscribeFinance() {
        const f = new (0, _indexDefault.default)();
        f.listenYA([
            "API",
            "^GSPC",
            "^DJI",
            "^IXIC",
            "^RUT",
            "CL=F",
            "GC=F",
            "NVDA",
            "GME",
            "RKT",
            "GAP",
            "BLD",
            "IBP"
        ]);
        f.onTick((data)=>{
            const cells = (0, _dependencytracker.tickerReg)[data.id] || {};
            for(let key in cells){
                const [row, col] = key.split(',');
                this.renderCell(row, col);
            }
            console.log('gigasheet::ontick', data);
        });
    }
    initEventListeners() {
        this.container.addEventListener('scroll', ()=>{
            requestAnimationFrame(()=>this.handleScroll());
        });
        const resizeObserver = new ResizeObserver(()=>{
            this.updateGridDimensions();
            this.updateVisibleGrid();
            this.updateSelection();
            this.updateRenderingQuality();
        // this.contextMenu.style.width = `${130 * this.scaler()}px`;
        // this.contextMenu.style.fontSize = `${14 * this.scaler()}px`;
        });
        resizeObserver.observe(this.container);
        // Selection event listeners
        this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        // Edit event listeners
        this.container.addEventListener('dblclick', this.handleCellDblClick.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        // Copy selected cells to clipboard
        document.addEventListener('copy', (e)=>{
            if (this.editingCell) return;
            if (!this.selectionBoundRect) return;
            const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
            let clipboardData = '';
            for(let row = startRow; row <= endRow; row++){
                for(let col = startCol; col <= endCol; col++){
                    const value = this.getCellText(row, col);
                    clipboardData += value;
                    if (col < endCol) clipboardData += '\t';
                }
                if (row < endRow) clipboardData += '\n';
            }
            e.clipboardData.setData('text/plain', clipboardData);
            e.preventDefault();
        });
        // Show context menu on right-click
        this.container.addEventListener('contextmenu', (e)=>{
            if (e.target.closest('.row-number-container')) return;
            if (e.target.closest('.header-container')) return;
            if (e.target.closest('.corner-cell')) return;
            if (e.target.closest('.cell-edit-input')) return;
            e.preventDefault(); // Prevent the default browser context menu
        });
        this._container.querySelector('.align-button-group')?.addEventListener('click', (e)=>{
            // console.log('clicked align buttons', e.target?.getAttribute('data-align'))
            const textAlign = e.target?.getAttribute('data-align');
            const selectedCells = this.getSelectedCells();
            this.setCells(selectedCells, 'textAlign', textAlign);
        });
        this._container.querySelector('.quick-text-actions-buttons')?.addEventListener('click', async (e)=>{
            // console.log('clicked align buttons', e.target?.getAttribute('data-align'))
            const action = e.target?.getAttribute('data-action');
            if (action === 'copy') document.execCommand('copy');
            else if (action === 'paste') {
                const clipboardText = await navigator.clipboard.readText();
                this.handlePaste(clipboardText);
            } else if (action === 'cut') {
                document.execCommand('copy');
                this.clearSelectedCells();
            }
        });
        document.addEventListener('paste', (e)=>{
            if (this.editingCell) return;
            this.handlePaste(e.clipboardData.getData('text/plain'));
            e.preventDefault();
        });
        this.mergeButton.onclick = (e)=>{
            e.preventDefault();
            this.mergeSelectedCells();
        };
        this.formatButton.onclick = (e)=>{
            e.preventDefault();
            this.openFormatMenu();
        };
        this.ctxmenu.onClick(async (action)=>{
            if (action === 'copy') document.execCommand('copy');
            else if (action === 'cut') {
                document.execCommand('copy');
                this.clearSelectedCells();
            } else if (action === 'paste') {
                if (this.editingCell) return;
                const clipboardText = await navigator.clipboard.readText();
                this.handlePaste(clipboardText);
            } else if (action === 'insert-row') this.insertRow();
            else if (action === 'insert-column') this.insertCol();
            else if (action === 'delete-row') this.deleteRow();
            else if (action === 'delete-column') this.deleteCol();
            else if (action === 'clear') this.clearSelectedCells();
            else if (action === 'toggle-gridlines') {
                this.toggleGridlines();
                this.forceRerender();
            } else if (action === 'merge') this.mergeSelectedCells();
            else if (action === 'unmerge') this.unmergeSelectedCells();
        });
    }
    showContextMenu(x, y, row, col) {
        const rect = this.container.getBoundingClientRect();
        this.ctxmenu.setPosition(x, y, rect);
        if (!this.rowColInBounds(row, col, this.selectionBoundRect)) this.selectCell({
            row,
            col
        });
    }
    deleteRow(row = null, record = true) {
        row = row != null ? row : this.selectionStart?.row;
        if (row == null) return;
        const cellsNeedingShift = (0, _dependencytracker.shiftDependenciesUp)(row);
        for (let [row, col] of cellsNeedingShift){
            const newText = (0, _shiftops.shiftTextRefs)(this.getCellText(row, col), 'up');
            this.setText(parseInt(row), parseInt(col), newText);
        }
        const rowData = this.data.deleteRow(row);
        this.mergedCells.forEach((merge)=>{
            if (merge.startRow >= row) {
                merge.startRow--;
                merge.endRow--;
            }
        });
        const heightOverride = this.heightOverrides[row];
        delete this.heightOverrides[row];
        this.shiftHeightOverrides(row, -1);
        this.updateHeightAccum();
        this.renderRowNumbers();
        record && this.recordChanges([
            {
                changeKind: 'deleteEntireRow',
                row,
                rowData,
                heightOverride
            }
        ]);
        this.forceRerender();
        this.selectionBoundRect = this.getBoundingRectCells(this.selectionBoundRect.startRow, this.selectionBoundRect.startCol, this.selectionBoundRect.endRow, this.selectionBoundRect.endCol);
        this.updateSelection();
    }
    deleteCol(col = null, record = true) {
        col = col != null ? col : this.selectionStart?.col;
        if (col == null) return;
        const cellsNeedingShift = (0, _dependencytracker.shiftDependenciesLeft)(col);
        for (let [row, col] of cellsNeedingShift){
            const newText = (0, _shiftops.shiftTextRefs)(this.getCellText(row, col), 'left');
            this.setText(parseInt(row), parseInt(col), newText);
        }
        const colData = this.data.deleteCol(col);
        this.mergedCells.forEach((merge)=>{
            if (merge.startCol >= col) {
                merge.startCol--;
                merge.endCol--;
            }
        });
        const widthOverride = this.widthOverrides[col];
        delete this.widthOverrides[col];
        this.shiftWidthOverrides(col, -1);
        this.updateWidthAccum();
        this.renderHeaders();
        record && this.recordChanges([
            {
                changeKind: 'deleteEntireCol',
                col,
                colData,
                widthOverride
            }
        ]);
        this.forceRerender();
        this.selectionBoundRect = this.getBoundingRectCells(this.selectionBoundRect.startRow, this.selectionBoundRect.startCol, this.selectionBoundRect.endRow, this.selectionBoundRect.endCol);
        this.updateSelection();
    }
    shiftHeightOverrides(pivot, amount = 1) {
        if (amount === -1) this.heightOverrides.splice(pivot, 1);
        else if (amount === 1) {
            this.heightOverrides.splice(pivot, 0, undefined);
            delete this.heightOverrides[pivot];
        }
    }
    shiftWidthOverrides(pivot, amount = 1) {
        if (amount === -1) this.widthOverrides.splice(pivot, 1);
        else if (amount === 1) {
            this.widthOverrides.splice(pivot, 0, undefined);
            delete this.widthOverrides[pivot];
        }
    }
    insertRow(row = null, data = null, record = true, heightOverride = null) {
        row = row != null ? row : this.selectionStart?.row;
        if (row == null) return;
        const cellsNeedingShift = (0, _dependencytracker.shiftDependenciesDown)(row);
        for (let [row, col] of cellsNeedingShift){
            const newText = (0, _shiftops.shiftTextRefs)(this.getCellText(row, col), 'down');
            this.setText(parseInt(row), parseInt(col), newText);
        }
        this.data.addRow(row, data);
        this.mergedCells.forEach((merge)=>{
            if (merge.startRow >= row) {
                merge.startRow++;
                merge.endRow++;
            }
        });
        this.shiftHeightOverrides(row, 1);
        if (heightOverride != null) this.heightOverrides[row] = heightOverride;
        this.updateHeightAccum();
        this.renderRowNumbers();
        record && this.recordChanges([
            {
                changeKind: 'insertEntireRow',
                row
            }
        ]);
        this.forceRerender();
        this.selectionBoundRect = this.getBoundingRectCells(this.selectionBoundRect.startRow, this.selectionBoundRect.startCol, this.selectionBoundRect.endRow, this.selectionBoundRect.endCol);
        this.updateSelection();
    }
    insertCol(col = null, data = null, record = true, widthOverride = null) {
        col = col != null ? col : this.selectionStart?.col;
        if (col == null) return;
        const cellsNeedingShift = (0, _dependencytracker.shiftDependenciesRight)(col);
        for (let [row, col] of cellsNeedingShift){
            const newText = (0, _shiftops.shiftTextRefs)(this.getCellText(row, col), 'right');
            this.setText(parseInt(row), parseInt(col), newText);
        }
        this.data.addCol(col, data);
        this.mergedCells.forEach((merge)=>{
            if (merge.startCol >= col) {
                merge.startCol++;
                merge.endCol++;
            }
        });
        this.shiftWidthOverrides(col, 1);
        if (widthOverride != null) this.widthOverrides[col] = widthOverride;
        this.updateWidthAccum();
        this.renderHeaders();
        record && this.recordChanges([
            {
                changeKind: 'insertEntireCol',
                col
            }
        ]);
        this.forceRerender();
        this.selectionBoundRect = this.getBoundingRectCells(this.selectionBoundRect.startRow, this.selectionBoundRect.startCol, this.selectionBoundRect.endRow, this.selectionBoundRect.endCol);
        this.updateSelection();
    }
    toggleGridlines() {
        this.gridlinesOn = !this.gridlinesOn;
        this.forceRerender();
    }
    scaler() {
        return devicePixelRatio < 1 ? (1 + (1 - devicePixelRatio)) * (1 + (1 - devicePixelRatio)) : 1;
    }
    // Modify the clearSelectedCells function to record changes
    clearSelectedCells() {
        if (!this.selectionBoundRect) return;
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
        const changes = [];
        const deletions = [];
        for(let row = startRow; row <= endRow; row++)for(let col = startCol; col <= endCol; col++){
            const obj = {
                row,
                col,
                previousValue: this.getCellText(row, col),
                newValue: '',
                changeKind: 'valchange'
            };
            this.clearElRegistry(row, col);
            deletions.push([
                row,
                col
            ]);
            changes.push(obj);
        }
        this.data.deleteCells(deletions);
        this.recordChanges(changes);
        for (let [row, col] of deletions)this.renderCell(row, col);
    }
    getColumnName(columnNumber) {
        let columnName = '';
        while(columnNumber >= 0){
            const remainder = columnNumber % 26;
            columnName = String.fromCharCode(65 + remainder) + columnName;
            columnNumber = Math.floor(columnNumber / 26) - 1;
            if (columnNumber < 0) break;
        }
        return columnName;
    }
    handlePaste(text) {
        if (!this.selectionBoundRect) return;
        const { startRow, startCol } = this.selectionBoundRect;
        const clipboardData = text;
        const rowsData = clipboardData.split('\n');
        const changes = []; // To record changes for undo/redo
        for(let i = 0; i < rowsData.length; i++){
            const rowData = rowsData[i].split('\t');
            for(let j = 0; j < rowData.length; j++){
                const row = startRow + i;
                const col = startCol + j;
                // if (row <= this.totalRowBounds && col <= this.totalColBounds) {
                changes.push({
                    row,
                    col,
                    previousValue: this.getCellText(row, col),
                    newValue: rowData[j],
                    changeKind: 'valchange'
                });
                this.setText(row, col, rowData[j]);
                this.renderCell(row, col);
            // }
            }
        }
        // Record the changes in the undo stack
        if (changes.length > 0) this.recordChanges(changes);
    }
    // Function to record a change in the history
    recordChanges(changes) {
        // Clear redo stack when a new change is made
        this.redoStack = [];
        // Add the change to the undo stack
        this.undoStack.push(changes);
        // Limit the size of the undo stack
        if (this.undoStack.length > this.MAX_HISTORY_SIZE) this.undoStack.shift(); // Remove the oldest change
    }
    setWidthOverride(col, width) {
        if (width == null) delete this.widthOverrides[col];
        else this.widthOverrides[col] = width;
    }
    setHeightOverride(row, height) {
        if (height == null) delete this.heightOverrides[row];
        else this.heightOverrides[row] = height;
    }
    // Function to undo the last change
    undo() {
        if (this.undoStack.length === 0) return; // Nothing to undo
        const changes = this.undoStack.pop(); // Get the last change
        const redoChanges = [];
        const updatedCells = [];
        let rerender = false;
        for (const change of changes){
            const { row, col, previousValue, changeKind } = change;
            if (changeKind === 'merge') {
                this.unmergeSelectedCells(change.bounds, false);
                rerender = true;
                redoChanges.push({
                    changeKind: 'unmerge',
                    bounds: change.bounds
                });
            } else if (changeKind === 'unmerge') {
                this.mergeSelectedCells(change.bounds, false);
                rerender = true;
                redoChanges.push({
                    changeKind: 'merge',
                    bounds: change.bounds
                });
            } else if (changeKind === 'deleteEntireRow') {
                this.insertRow(change.row, change.rowData, false, change.heightOverride);
                rerender = true;
                // this.data.addRow(change.row, change.rowData);
                redoChanges.push({
                    changeKind: 'deleteEntireRow',
                    row: change.row,
                    rowData: change.rowData,
                    heightOverride: change.heightOverride
                });
            } else if (changeKind === 'deleteEntireCol') {
                this.insertCol(change.col, change.colData, false, change.widthOverride);
                rerender = true;
                redoChanges.push({
                    changeKind: 'deleteEntireCol',
                    col: change.col,
                    colData: change.colData,
                    widthOverride: change.widthOverride
                });
            } else if (changeKind === 'insertEntireRow') {
                this.deleteRow(change.row, false);
                rerender = true;
                redoChanges.push({
                    changeKind: 'insertEntireRow',
                    row: change.row
                });
            } else if (changeKind === 'insertEntireCol') {
                this.deleteCol(change.col, false);
                rerender = true;
                redoChanges.push({
                    changeKind: 'insertEntireCol',
                    col: change.col
                });
            } else if (changeKind === 'widthOverrideUpdate') {
                const prev = this.widthOverrides[change.col];
                this.setWidthOverride(change.col, change.value);
                this.updateWidthAccum();
                this.renderHeaders();
                rerender = true;
                redoChanges.push({
                    changeKind: 'widthOverrideUpdate',
                    col: change.col,
                    value: prev
                });
            } else if (changeKind === 'heightOverrideUpdate') {
                const prev = this.heightOverrides[change.row];
                this.setHeightOverride(change.row, change.value);
                this.updateHeightAccum();
                this.renderRowNumbers();
                rerender = true;
                redoChanges.push({
                    changeKind: 'heightOverrideUpdate',
                    row: change.row,
                    value: prev
                });
            } else if (changeKind === 'valchange') {
                // Record the current value for redo
                redoChanges.push({
                    row,
                    col,
                    previousValue: this.getCellText(row, col),
                    newValue: previousValue,
                    changeKind: 'valchange'
                });
                // Revert the cell to its previous value
                this.setCell(row, col, 'text', previousValue);
                updatedCells.push([
                    row,
                    col
                ]);
            } else console.log('UNHANDLED UNDO:', changeKind);
        }
        this.redoStack.push(redoChanges);
        if (rerender) this.forceRerender();
        else this.rerenderCells(updatedCells);
        this.updateSelection();
    }
    rerenderCells(arr = []) {
        for (let [row, col] of arr)this.renderCell(row, col);
        this.rerenderMerges(arr);
    }
    rerenderMerges(arr = []) {
        const mergeSet = new Set();
        for (let [row, col] of arr){
            const merge = this.getMerge(row, col);
            if (!merge) continue;
            mergeSet.add(merge);
            for (let block of this.getBlocksInMerge(merge))this.renderCell(merge.startRow, merge.startCol, block);
        }
    }
    // Function to redo the last undone change
    redo() {
        if (this.redoStack.length === 0) return; // Nothing to redo
        const changes = this.redoStack.pop(); // Get the last undone change
        const undoChanges = [];
        const updatedCells = [];
        let rerender = false;
        for (const change of changes){
            const { row, col, newValue, previousValue, changeKind } = change;
            if (changeKind === 'unmerge') {
                this.mergeSelectedCells(change.bounds, false);
                rerender = true;
                undoChanges.push({
                    changeKind: 'merge',
                    bounds: change.bounds
                });
            } else if (changeKind === 'merge') {
                this.unmergeSelectedCells(change.bounds, false);
                rerender = true;
                undoChanges.push({
                    changeKind: 'unmerge',
                    bounds: change.bounds
                });
            } else if (changeKind === 'deleteEntireRow') {
                this.deleteRow(change.row, false);
                rerender = true;
                undoChanges.push({
                    changeKind: 'deleteEntireRow',
                    row: change.row,
                    rowData: change.rowData,
                    heightOverride: change.heightOverride
                });
            } else if (changeKind === 'deleteEntireCol') {
                this.deleteCol(change.col, false);
                rerender = true;
                undoChanges.push({
                    changeKind: 'deleteEntireCol',
                    col: change.col,
                    colData: change.colData,
                    widthOverride: change.widthOverride
                });
            } else if (changeKind === 'insertEntireRow') {
                this.insertRow(change.row, null, false);
                rerender = true;
                undoChanges.push({
                    changeKind: 'insertEntireRow',
                    row: change.row
                });
            } else if (changeKind === 'insertEntireCol') {
                this.insertCol(change.col, null, false);
                rerender = true;
                undoChanges.push({
                    changeKind: 'insertEntireCol',
                    col: change.col
                });
            } else if (changeKind === 'widthOverrideUpdate') {
                const prev = this.widthOverrides[change.col];
                this.setWidthOverride(change.col, change.value);
                this.updateWidthAccum();
                this.renderHeaders();
                rerender = true;
                undoChanges.push({
                    changeKind: 'widthOverrideUpdate',
                    col: change.col,
                    value: prev
                });
            } else if (changeKind === 'heightOverrideUpdate') {
                const prev = this.heightOverrides[change.row];
                this.setHeightOverride(change.row, change.value);
                this.updateHeightAccum();
                this.renderRowNumbers();
                rerender = true;
                undoChanges.push({
                    changeKind: 'heightOverrideUpdate',
                    row: change.row,
                    value: prev
                });
            } else if (changeKind === 'valchange') {
                // Record the current value for undo
                undoChanges.push({
                    row,
                    col,
                    previousValue: this.getCellText(row, col),
                    newValue,
                    changeKind: 'valchange'
                });
                // Apply the new value to the cell
                this.setCell(row, col, 'text', previousValue);
                updatedCells.push([
                    row,
                    col
                ]);
            } else console.log('UNHANDLED REDO:', changeKind);
        }
        this.undoStack.push(undoChanges);
        if (rerender) this.forceRerender();
        else this.rerenderCells(updatedCells);
        this.updateSelection();
    }
    rowColInBounds(row, col, bounds) {
        if (bounds == null) return false;
        return row <= bounds.endRow && row >= bounds.startRow && col <= bounds.endCol && col >= bounds.startCol;
    }
    // Function to hide the context menu
    hideContextMenu() {
        this.ctxmenu.hide();
    }
    handleCellDblClick(e) {
        if (e.target === this.editInput) return;
        const { row, col } = this.getCellFromEvent(e);
        if (row === -1 || col === -1) return;
        this.startCellEdit(row, col);
    }
    openFormatMenu() {
        const { win, addListener } = (0, _format.launchFormatMenu)();
        addListener((type, value)=>{
            const selectedCells = this.getSelectedCells();
            this.setCells(selectedCells, type, value);
        });
    }
    forceRerender() {
        this.updateVisibleGrid(true);
    }
    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        if (key === 'f2' && this.selectionStart) {
            e.preventDefault();
            if (this.editingCell) return;
            this.startCellEdit(this.selectionStart.row, this.selectionStart.col);
        } else if (key === 'f3') {
            if (this.editingCell) return;
            this.openFormatMenu();
            e.preventDefault();
        } else if (key === 'escape' && this.editInput.style.display !== 'none') this.cancelCellEdit();
        else if (key === 'delete') {
            if (this.editingCell) return;
            this.clearSelectedCells();
        } else if (key === 'x' && e.ctrlKey) {
            if (this.editingCell) return;
            document.execCommand('copy');
            this.clearSelectedCells();
        } else if (key === 's' && e.ctrlKey) {
            if (this.editingCell) return;
            const data = this.data.save();
            const save = {
                mergedCells: this.mergedCells,
                heightOverrides: this.heightOverrides,
                widthOverrides: this.widthOverrides,
                gridlinesOn: this.gridlinesOn,
                data
            };
            // localStorage.setItem('data-save', data)
            localStorage.setItem('sheet-state', JSON.stringify(save));
            e.preventDefault();
        } else if (key === 'l' && e.ctrlKey) {
            if (this.editingCell) return;
            this.restoreSave();
            e.preventDefault();
        } else if (e.ctrlKey || e.metaKey) {
            if (this.editingCell) return;
            if (key === 'y' || e.shiftKey && key === 'z') {
                e.preventDefault(); // Prevent default behavior
                this.redo();
            } else if (key === 'z') {
                e.preventDefault(); // Prevent default behavior (e.g., browser undo)
                this.undo();
            }
        } else if (key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright' || key === 'enter') {
            if (!this.selectionEnd || this.editingCell) return;
            e.preventDefault();
            this.handleArrowKeyDown(e);
        } else if (this.selectionStart && e.key?.length === 1) {
            if (this.editingCell) return;
            this.startCellEdit(this.selectionStart.row, this.selectionStart.col, e.key);
        }
    }
    restoreSave() {
        let save = localStorage.getItem('sheet-state');
        if (save) {
            try {
                save = JSON.parse(save);
                if (!save) return false;
            } catch  {
                return false;
            }
            this.widthOverrides = save.widthOverrides;
            this.heightOverrides = save.heightOverrides;
            this.mergedCells = save.mergedCells;
            this.gridlinesOn = save.gridlinesOn;
            const g = new (0, _sparsegridDefault.default)();
            g.restore(save.data);
            this.setData(g);
            this.updateSelection();
            return true;
        }
        return false;
    }
    handleArrowKeyDown(e) {
        if (!this.selectionEnd || !this.selectionStart) return;
        const deltas = {
            'ArrowUp': [
                -1,
                0
            ],
            'ArrowDown': [
                1,
                0
            ],
            'ArrowLeft': [
                0,
                -1
            ],
            'ArrowRight': [
                0,
                1
            ],
            'Enter': e.shiftKey ? [
                -1,
                0
            ] : [
                1,
                0
            ]
        };
        const curMerge = this.getMerge(this.selectionEnd.row, this.selectionEnd.col);
        let row = this.selectionEnd.row + deltas[e.key][0];
        let col = this.selectionEnd.col + deltas[e.key][1];
        const merge = this.getMerge(row, col);
        if (e.shiftKey) {
            // TODO: do in less bruteforce way
            const prevRect = JSON.stringify(this.selectionBoundRect);
            if (e.key === 'ArrowUp' || e.key === 'Enter' && e.shiftKey) {
                let curRect;
                while(row > 0){
                    curRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    row--;
                }
            } else if (e.key === 'ArrowDown' || e.key === 'Enter' && !e.shiftKey) {
                let curRect;
                while(row < this.getTotalRows()){
                    curRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    row++;
                }
            } else if (e.key === 'ArrowLeft') {
                let curRect;
                while(col > 0){
                    curRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    col--;
                }
            } else if (e.key === 'ArrowRight') {
                let curRect;
                while(col < this.getTotalCols()){
                    curRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    col++;
                }
            }
        } else if (merge && merge === curMerge) {
            if (e.key === 'ArrowUp') row = merge.startRow - 1;
            else if (e.key === 'ArrowDown' || e.key === 'Enter') row = merge.endRow + 1;
            else if (e.key === 'ArrowLeft') col = merge.startCol - 1;
            else if (e.key === 'ArrowRight') col = merge.endCol + 1;
        }
        row = Math.max(0, row);
        row = Math.min(row, this.totalRowBounds - 1);
        col = Math.max(0, col);
        col = Math.min(col, this.totalColBounds - 1);
        if (e.shiftKey && e.key !== 'Enter') this.selectionEnd = {
            row,
            col
        };
        this.selectCell({
            row,
            col,
            continuation: e.shiftKey && e.key !== 'Enter'
        });
    }
    inVisibleBounds(row, col) {
        const { row: visStartRow, col: visStartCol } = this.getTopLeftBounds();
        const { row: visEndRow, col: visEndCol } = this.getBottomRightBounds();
        return row >= visStartCol && row <= visEndRow && col >= visStartCol && col <= visEndCol;
    }
    scrollTo(row, col, delta) {
        if (row < 0 || row >= this.totalRows || col < 0 || col >= this.totalCols) return;
        const merge = this.getMerge(row, col);
        let left, top, width, height, value;
        if (merge) {
            left = this.getWidthOffset(merge.startCol, true);
            top = this.getHeightOffset(merge.startRow, true);
            width = this.getMergeWidth(merge);
            height = this.getMergeHeight(merge);
            value = this.getCellText(merge.startRow, merge.startCol);
        } else {
            left = this.getWidthOffset(col, true);
            top = this.getHeightOffset(row, true);
            width = this.getCellWidth(row, col);
            height = this.rowHeight(row);
            value = this.getCellText(row, col);
        }
        if (delta === 'ArrowUp') this.container.scrollTo({
            top: top - 100,
            behavior: 'smooth'
        });
        else if (delta === 'ArrowDown') this.container.scrollTo({
            // top: top + 100,
            top,
            behavior: 'smooth'
        });
        else if (delta == 'ArrowLeft') this.container.scrollTo({
            // left: left - 100,
            left,
            behavior: 'smooth'
        });
        else if (delta === 'ArrowRight') this.container.scrollTo({
            // left: left + width,
            left: left - this.container.clientWidth - width,
            behavior: 'smooth'
        });
    }
    getSelectedCells() {
        if (!this.selectionBoundRect) return [];
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
        const cells = this.data.getCellsForce(startRow, startCol, endRow, endCol).filter((cell)=>this.isValid(cell.row, cell.col));
        return cells;
    }
    isValid(row, col) {
        const merge = this.getMerge(row, col);
        if (!merge) return true;
        return merge.startRow == row && merge.startCol == col;
    }
    getTotalRows() {
        return this.totalRows;
    }
    getTotalCols() {
        return this.totalCols;
    }
    get totalRows() {
        return Math.max(this.data?.rowCount || 0, this.blockRows) + this.blockRows * this.padding;
    }
    get totalCols() {
        return Math.max(this.data?.colCount || 0, this.blockCols) + this.blockCols * this.padding;
    }
    getMerge(row, col) {
        // Check if the cell is part of a merged range
        return this.mergedCells.find((merged)=>row >= merged.startRow && row <= merged.endRow && col >= merged.startCol && col <= merged.endCol);
    }
    getMergeWidth(merge) {
        return this.getWidthBetweenColumns(merge.startCol, merge.endCol + 1);
    }
    getMergeHeight(merge) {
        return this.getHeightBetweenRows(merge.startRow, merge.endRow + 1);
    }
    startCellEdit(row, col, startingValue) {
        if (row < 0 || row > this.totalRowBounds || col < 0 || col > this.totalColBounds) return;
        const merge = this.getMerge(row, col);
        let left, top, width, height, value;
        if (merge) {
            left = this.getWidthOffset(merge.startCol, true);
            top = this.getHeightOffset(merge.startRow, true);
            width = this.getMergeWidth(merge);
            height = this.getMergeHeight(merge);
            value = startingValue != null ? '' : this.getCellText(merge.startRow, merge.startCol);
            row = merge.startRow, col = merge.startCol;
        } else {
            left = this.getWidthOffset(col, true);
            top = this.getHeightOffset(row, true);
            width = this.getCellWidth(row, col);
            height = this.rowHeight(row);
            value = startingValue != null ? '' : this.getCellText(row, col);
        }
        // Set up edit input
        this.editInput.value = value;
        this.editInput.style.left = `${left}px`;
        this.editInput.style.top = `${top}px`;
        this.editInput.style.minWidth = `${width}px`;
        this.editInput.style.width = value.length + 1 + "ch";
        this.editInput.style.height = `${height}px`;
        this.editInput.style.display = 'block';
        this.editInput.focus();
        // Store edit state
        this.editingCell = {
            row,
            col
        };
        this.editInput.onblur = this.finishCellEdit.bind(this);
        this.editInput.onkeydown = (e)=>{
            if (e.key === 'Enter') this.finishCellEdit();
            else this.editInput.style.width = this.editInput.value.length + 1 + "ch";
        };
    }
    setText(row, col, text) {
        this.setCell(row, col, 'text', text);
    // this.data?.setCellProperty(row, col, 'text', text);
    }
    setCell(row, col, field, value) {
        const cell = this.getCell(row, col);
        if (!cell) return;
        cell[field] = value;
        if (!this.data.has(row, col)) this.data.set(row, col, cell);
    }
    setCells(cells, field, value) {
        for (let cell of cells){
            this.setCell(cell.row, cell.col, field, value);
            this.renderCell(cell.row, cell.col);
        }
        if (field === 'cellType') {
            console.log('forcing rerender');
            this.forceRerender();
        }
    }
    // mergeInCell(row: number, col: number, data: any) {
    //     const cell = this.getCell(row, col);
    //     if (!cell) return;
    //     Object.assign(cell, data);
    // }
    finishCellEdit() {
        if (!this.editingCell) return;
        const { row, col } = this.editingCell;
        if (this.editInput.value === this.getCellText(row, col)) {
            this.cancelCellEdit();
            return;
        }
        this.recordChanges([
            {
                row,
                col,
                previousValue: this.getCellText(row, col),
                newValue: this.editInput.value,
                changeKind: 'valchange'
            }
        ]);
        this.setText(row, col, this.editInput.value);
        // Hide input and redraw cell
        this.cancelCellEdit();
        const merge = this.getMerge(row, col);
        if (merge) for (let block of this.getBlocksInMerge(merge))this.renderCell(merge.startRow, merge.startCol, block);
        else this.renderCell(row, col);
    }
    getBlocksInMerge(merge) {
        const blockSet = new Set();
        for(let i = merge.startRow; i <= merge.endRow; i++)for(let j = merge.startCol; j <= merge.endCol; j++){
            const block = this.getBlockOrSubBlock(i, j);
            if (!block) continue;
            if (blockSet.has(block)) continue;
            blockSet.add(block);
        }
        return blockSet;
    }
    cancelCellEdit() {
        this.editInput.style.display = 'none';
        this.editingCell = null;
        this.editInput.onblur = null;
        this.editInput.onkeydown = null;
    }
    updateRenderingQuality() {
        if (this.lastBlockCanvases !== this.blockCanvases()) {
            console.log("RESIZE");
            this.lastBlockCanvases = this.blockCanvases();
            this.forceRerender();
        } else if (Math.abs(window.devicePixelRatio - this.lastDevicePixelRatio) > 0.00) {
            // Only update if scale changed significantly
            this.lastDevicePixelRatio = window.devicePixelRatio;
            console.log('update render quality');
            requestAnimationFrame(()=>{
                if (this.busy) return;
                const createTimeout = ()=>setTimeout(()=>{
                        this.busy = true;
                        this.activeBlocks.forEach((block)=>{
                            if (block.subBlocks.length < 2) this.renderBlock(block, true);
                            else block.subBlocks.forEach((subBlock)=>{
                                this.renderBlock(subBlock, true);
                            });
                        });
                        this.busy = false;
                        this.rqtimeout = null;
                    }, 200);
                if (this.rqtimeout) clearTimeout(this.rqtimeout);
                this.rqtimeout = createTimeout();
            });
        }
    }
    createSelectionHandle() {
        this.selectionHandle = document.createElement('div');
        this.selectionHandle.className = 'selection-handle bottom-right';
        this.selectionHandle.style.display = 'none';
        this.selectionLayer.appendChild(this.selectionHandle);
        // Add drag event for the handle
        this.selectionHandle.addEventListener('mousedown', (e)=>{
            e.stopPropagation();
            if (!this.selectedCell) return;
            this.isResizing = true;
            this.resizeStart = {
                x: e.clientX,
                y: e.clientY
            };
            this.resizeInitialSize = {
                width: this.selectedCell.offsetWidth,
                height: this.selectedCell.offsetHeight
            };
        });
    }
    handleMouseDown(e) {
        if (e.target.closest('.header-cell') || e.target.closest('.row-number-container') || e.target.closest('.corner-cell')) {
            this.hideContextMenu();
            return;
        }
        if (e.target === this.container) return;
        if (e.target === this.editInput) return;
        if (this.draggingHeader) return;
        if (e.target !== this.ctxmenu.container && !this.ctxmenu.container.contains(e.target)) this.hideContextMenu();
        if (e.button === 2) {
            const x = e.clientX;
            const y = e.clientY;
            const { row, col } = this.getCellFromEvent(e);
            this.showContextMenu(x, y, row, col);
            return;
        }
        if (e.button !== 0) return;
        this.handleSelectionMouseDown(e);
    }
    handleSelectionMouseDown(e) {
        const { row, col } = this.getCellFromEvent(e);
        if (e.ctrlKey && this.selectionStart) {
            this.selectionStart = null;
            this.selectionEnd = null;
            this.selectionBoundRect = null;
            this.isSelecting = true;
            this.addNewSelection();
            this.selectCell({
                row,
                col
            });
        } else if (e.shiftKey && this.selectionStart) {
            this.isSelecting = true;
            this.selectCell({
                row,
                col,
                continuation: true
            }); // kill old selections start new
        } else {
            this.isSelecting = true;
            this.selectCell({
                row,
                col,
                clear: true
            });
        }
    }
    selectCell({ row, col, continuation = false, clear = false }) {
        if (row === -1 || col === -1) return;
        if (clear) {
            this.selectionLayer.innerHTML = '';
            this.addNewSelection();
        }
        if (!this.activeSelection) this.addNewSelection();
        if (!continuation) this.selectionStart = {
            row,
            col
        };
        this.selectionEnd = {
            row,
            col
        };
        if (!this.selectionStart) return;
        this.selectionBoundRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
        this.updateSelection();
    // this.forceRerender(); // debug purposes, remove
    }
    getCellsInRange(startRow, startCol, endRow, endCol) {
        const cells = [];
        for(let i = startRow; i <= endRow; i++)for(let j = startCol; j <= endCol; j++)cells.push(this.getCell(i, j));
        return cells;
    }
    getMergesInRange({ startRow, startCol, endRow, endCol }) {
        const merges = new Set();
        for(let i = startRow; i <= endRow; i++)for(let j = startCol; j <= endCol; j++){
            const merge = this.getMerge(i, j);
            if (merge) merges.add(merge);
        }
        return [
            ...merges.values()
        ];
    }
    normalizeCoordinates({ startRow, startCol, endRow, endCol }) {
        const _startRow = Math.min(startRow, endRow);
        const _endRow = Math.max(startRow, endRow);
        const _startCol = Math.min(startCol, endCol);
        const _endCol = Math.max(startCol, endCol);
        return {
            startRow: _startRow,
            startCol: _startCol,
            endRow: _endRow,
            endCol: _endCol
        };
    }
    getBoundingRectCells(startRow, startCol, endRow, endCol) {
        ({ startRow, startCol, endRow, endCol } = this.normalizeCoordinates({
            startRow,
            startCol,
            endRow,
            endCol
        }));
        const merges = this.getMergesInRange({
            startRow,
            startCol,
            endRow,
            endCol
        });
        if (merges.length === 0) return {
            startRow,
            startCol,
            endRow,
            endCol
        };
        for (const merge of merges){
            startRow = Math.min(startRow, merge.startRow);
            startCol = Math.min(startCol, merge.startCol);
            endRow = Math.max(endRow, merge.endRow);
            endCol = Math.max(endCol, merge.endCol);
        }
        return {
            startRow,
            startCol,
            endRow,
            endCol
        };
    }
    handleMouseMove(e) {
        if (this.draggingHeader) {
            const scrollLeft = this.container.scrollLeft;
            this.draggingHeader.el.style.left = `${scrollLeft + e.clientX - 8}px`;
        } else if (this.draggingRow) {
            const scrollTop = this.container.scrollTop;
            const rect = this.container.getBoundingClientRect();
            this.draggingRow.el.style.top = `${scrollTop + e.clientY - this.headerRowHeight - rect.y - 5}px`;
        } else if (this.isSelecting) {
            const { row, col } = this.getCellFromEvent(e);
            if (row !== -1 && col !== -1) {
                this.selectionEnd = {
                    row,
                    col
                };
                if (!this.selectionStart) return;
                this.selectionBoundRect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                this.updateSelection();
            }
        } else if (this.isResizing) {
            const dx = e.clientX - this.resizeStart.x;
            const dy = e.clientY - this.resizeStart.y;
            const newWidth = Math.max(this.cellWidth, this.resizeInitialSize.width + dx);
            const newHeight = Math.max(this.cellHeight, this.resizeInitialSize.height + dy);
            if (!this.selectedCell) return;
            this.selectedCell.style.width = `${newWidth}px`;
            this.selectedCell.style.height = `${newHeight}px`;
            // Position the handle
            this.positionSelectionHandle();
        }
    }
    handleMouseUp(e) {
        if (this.isSelecting) {
            this.isSelecting = false;
            const { row, col } = this.getCellFromEvent(e);
            if (row !== -1 && col !== -1) {
                if (!this.selectionStart) return;
                this.selectionEnd = {
                    row,
                    col
                };
                const rect = this.getBoundingRectCells(this.selectionStart.row, this.selectionStart.col, row, col);
                this.updateSelection();
            }
        } else if (this.isResizing) this.isResizing = false;
        else if (this.draggingHeader) {
            const draggingHeader = this.draggingHeader;
            const col = this.draggingHeader.col;
            this.draggingHeader = null;
            const scrollLeft = this.container.scrollLeft;
            const diff = scrollLeft + e.clientX - this.getWidthOffset(col + 1, true);
            const prevOverride = this.widthOverrides[col];
            const change = this.widthOverrides[col] ? this.widthOverrides[col] + diff : this.getCellWidth(col) + diff;
            if (change <= 1) {
                draggingHeader.el.style.left = draggingHeader.origLeft;
                return;
            }
            this.setWidthOverride(col, change);
            this.recordChanges([
                {
                    changeKind: 'widthOverrideUpdate',
                    col,
                    value: prevOverride
                }
            ]);
            this.updateWidthAccum();
            this.renderHeaders();
            this.forceRerender();
            this.updateSelection();
            e.stopPropagation();
        } else if (this.draggingRow) {
            const draggingRow = this.draggingRow;
            const row = this.draggingRow.row;
            this.draggingRow = null;
            const scrollTop = this.container.scrollTop;
            const rect = this.container.getBoundingClientRect();
            const diff = scrollTop + e.clientY - rect.y - this.getHeightOffset(row + 1, true);
            const prevOverride = this.heightOverrides[row];
            const change = this.heightOverrides[row] ? this.heightOverrides[row] + diff : this.getCellHeight(row) + diff;
            if (change <= 1) {
                draggingRow.el.style.top = draggingRow.origTop;
                return;
            }
            this.setHeightOverride(row, change);
            this.recordChanges([
                {
                    changeKind: 'heightOverrideUpdate',
                    row,
                    value: prevOverride
                }
            ]);
            this.updateHeightAccum();
            this.renderRowNumbers();
            this.forceRerender();
            this.updateSelection();
            e.stopPropagation();
        }
    }
    getColWidth(col) {
        return this.widthOverrides[col] ?? this.cellWidth;
    }
    getTopLeftBounds() {
        const rect = this.container.getBoundingClientRect();
        const scrollLeft = this.container.scrollLeft;
        const scrollTop = this.container.scrollTop;
        // Adjust for header and row numbers
        const x = Math.max(0, this.rowNumberWidth + 8 - scrollLeft) - rect.left + scrollLeft - this.rowNumberWidth; // 50 for row numbers
        const y = this.headerRowHeight + 8 - rect.top + scrollTop - this.headerRowHeight;
        if (x < 0 || y < 0) return {
            row: -1,
            col: -1
        };
        // Find column
        let col = this.bsearch(this.widthAccum, x + this.rowNumberWidth) - 1;
        // Find row
        const row = this.bsearch(this.heightAccum, y + this.headerRowHeight) - 1;
        return {
            row: Math.min(row, this.totalRowBounds - 1),
            col: Math.min(col, this.totalColBounds - 1)
        };
    }
    getBottomRightBounds() {
        const rect = this.container.getBoundingClientRect();
        const scrollLeft = this.container.scrollLeft;
        const scrollTop = this.container.scrollTop;
        // Adjust for header and row numbers
        const x = rect.right - rect.left + scrollLeft - (this.rowNumberWidth + 8);
        const y = rect.bottom - rect.top + scrollTop - this.headerRowHeight;
        if (x < 0 || y < 0) return {
            row: -1,
            col: -1
        };
        // Find column
        let col = this.bsearch(this.widthAccum, x + this.rowNumberWidth) - 1;
        // Find row
        const row = this.bsearch(this.heightAccum, y + this.headerRowHeight) - 1;
        return {
            row: Math.min(row, this.totalRowBounds - 1),
            col: Math.min(col, this.totalColBounds - 1)
        };
    }
    bsearch(arr, target) {
        function condition(i) {
            return target < arr[i];
        }
        let left = 0;
        let right = arr.length - 1;
        while(left < right){
            let mid = Math.floor(left + (right - left) / 2);
            if (condition(mid)) right = mid;
            else left = mid + 1;
        }
        return left;
    }
    getCellFromEvent(e) {
        const rect = this.container.getBoundingClientRect();
        const scrollLeft = this.container.scrollLeft;
        const scrollTop = this.container.scrollTop;
        // Adjust for header and row numbers
        const x = e.clientX - rect.left + scrollLeft - this.rowNumberWidth;
        const y = e.clientY - rect.top + scrollTop - this.headerRowHeight; // 30 for header
        if (x < 0 || y < 0) return {
            row: -1,
            col: -1
        };
        let col = this.bsearch(this.widthAccum, x + this.rowNumberWidth) - 1;
        let row = this.bsearch(this.heightAccum, y + this.headerRowHeight) - 1;
        return {
            row: Math.min(row, this.totalRowBounds - 1),
            col: Math.min(col, this.totalColBounds - 1)
        };
    }
    mergeSelectedCells(bounds = null, recordChanges = true) {
        if (!this.selectionStart || !this.selectionEnd) return;
        let sr = this.selectionStart.row, sc = this.selectionStart.col, er = this.selectionEnd.row, ec = this.selectionEnd.col;
        if (bounds) sr = bounds.startRow, sc = bounds.startCol, er = bounds.endRow, ec = bounds.endCol;
        // Normalize selection coordinates
        const startRow = Math.min(sr, er);
        const endRow = Math.max(sr, er);
        const startCol = Math.min(sc, ec);
        const endCol = Math.max(sc, ec);
        // Check if the selected range overlaps with existing merged cells
        for (const merged of this.mergedCells)if (startRow <= merged.endRow && endRow >= merged.startRow && startCol <= merged.endCol && endCol >= merged.startCol) {
            alert('Cannot merge cells that overlap with existing merged cells.');
            return;
        }
        // Add the merged range to the list
        this.mergedCells.push({
            startRow,
            endRow,
            startCol,
            endCol
        });
        recordChanges && this.recordChanges([
            {
                changeKind: 'merge',
                bounds: {
                    startRow,
                    endRow,
                    startCol,
                    endCol
                }
            }
        ]);
        recordChanges && this.forceRerender();
    }
    unmergeSelectedCells(bounds = null, recordChanges = true) {
        if (!this.selectionStart || !this.selectionEnd) return;
        let sr = this.selectionStart.row, sc = this.selectionStart.col, er = this.selectionEnd.row, ec = this.selectionEnd.col;
        if (bounds) sr = bounds.startRow, sc = bounds.startCol, er = bounds.endRow, ec = bounds.endCol;
        // Normalize selection coordinates
        const startRow = Math.min(sr, er);
        const endRow = Math.max(sr, er);
        const startCol = Math.min(sc, ec);
        const endCol = Math.max(sc, ec);
        let merged;
        for(let i = 0; i < this.mergedCells.length; i++){
            merged = this.mergedCells[i];
            if (startRow <= merged.endRow && endRow >= merged.startRow && startCol <= merged.endCol && endCol >= merged.startCol) this.mergedCells.splice(i, 1);
        }
        if (!merged) return;
        recordChanges && this.recordChanges([
            {
                changeKind: 'unmerge',
                bounds: {
                    startRow: merged.startRow,
                    endRow: merged.endRow,
                    startCol: merged.startCol,
                    endCol: merged.endCol
                }
            }
        ]);
        recordChanges && this.forceRerender();
    }
    addNewSelection() {
        const newSelection = document.createElement('div');
        this.selectionLayer.appendChild(newSelection);
        this.activeSelection = newSelection;
        return newSelection;
    }
    updateSelection() {
        if (!this.activeSelection) return;
        // Clear previous selection
        this.activeSelection.innerHTML = '';
        if (!this.selectionHandle) return;
        this.selectionHandle.style.display = 'none';
        if (!this.selectionBoundRect) return;
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
        let left = this.getWidthOffset(startCol);
        let width = this.getWidthBetweenColumns(startCol, endCol + 1);
        const top = this.getHeightOffset(startRow); // Below header
        const height = this.getHeightBetweenRows(startRow, endRow + 1);
        // Create selection element
        this.selectedCell = document.createElement('div');
        this.selectedCell.className = 'selected-cell';
        this.selectedCell.style.left = `${left}px`;
        this.selectedCell.style.top = `${top}px`;
        this.selectedCell.style.width = `${width + 1}px`;
        this.selectedCell.style.height = `${height + 1}px`;
        this.activeSelection.appendChild(this.selectedCell);
        // Add resize handle
        this.positionSelectionHandle();
        this.selectionHandle.style.display = 'block';
        for (let col of this.selectedCols)if (col < startCol || col > endCol) {
            this.selectedCols.delete(col);
            const el = this.headerContainer.querySelector(`[data-hccol='${col}']`);
            if (!el) continue;
            el.classList.remove('col-selected');
            const handle = el.nextSibling;
            if (handle) handle.classList.remove('handle-col-selected');
        }
        for(let i = startCol; i <= endCol; i++){
            if (i in this.selectedCols) continue;
            this.selectedCols.add(i);
            const el = this.headerContainer.querySelector(`[data-hccol='${i}']`);
            if (!el) continue;
            el.classList.add('col-selected');
            const handle = el.nextSibling;
            if (handle) handle.classList.add('handle-col-selected');
        }
        for (let row of this.selectedRows)if (row < startRow || row > endRow) {
            this.selectedRows.delete(row);
            const el = this.rowNumberContainer.querySelector(`[data-rnrow='${row}']`);
            if (!el) continue;
            el.classList.remove('row-selected');
            const handle = el.nextSibling;
            if (handle) handle.classList.remove('handle-row-selected');
        }
        for(let i = startRow; i <= endRow; i++){
            if (i in this.selectedRows) continue;
            this.selectedRows.add(i);
            const el = this.rowNumberContainer.querySelector(`[data-rnrow='${i}']`);
            if (!el) continue;
            el.classList.add('row-selected');
            const handle = el.nextSibling;
            if (handle) handle.classList.add('handle-row-selected');
        }
    }
    positionSelectionHandle() {
        if (!this.selectedCell || !this.selectionHandle) return;
        const rect = this.selectedCell.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        this.selectionHandle.style.left = `${rect.right - containerRect.left - 3}px`;
        this.selectionHandle.style.top = `${rect.bottom - containerRect.top - 3}px`;
    }
    setData(data = null, initialData = null) {
        data = data || new (0, _sparsegridDefault.default)();
        if (initialData) initialData.forEach((cell)=>{
            data.set(cell.row, cell.col, cell);
        });
        // for (let i = 0; i < 2000; i++) {
        //     for (let j = 0; j < 2000; j++) {
        //         data.set(i, j, { text: (Math.random() * 1000).toFixed(2), _id: uuid() })
        //     }
        // }
        this.parser = new (0, _expressionparserDefault.default)(data);
        this.data = data;
        this.updateGridDimensions();
        this.renderHeaders();
        this.renderRowNumbers();
        this.updateVisibleGrid(true);
    }
    renderHeaders() {
        this.headerContainer.innerHTML = `<div class="header-cell" style="width:${this.rowNumberWidth}px;"></div>`;
        this.headerContainer.onmousedown = (e)=>{
            if (e.button !== 0) return;
            if (e.target.getAttribute('data-col') != null) this.draggingHeader = {
                origLeft: e.target.style.left,
                el: e.target,
                col: parseInt(e.target.getAttribute('data-col'))
            };
        };
        // Calculate total width needed for columns
        let totalWidth = this.rowNumberWidth;
        for(let col = 0; col <= this.totalColBounds; col++){
            const width = this.getColWidth(col);
            totalWidth += width;
            const headerCell = document.createElement('div');
            headerCell.className = 'header-cell';
            headerCell.setAttribute('data-hccol', col);
            headerCell.textContent = this.getColumnName(col);
            headerCell.style.width = `${width}px`;
            const headerHandle = document.createElement('div');
            headerHandle.className = 'header-handle';
            headerHandle.style.height = `${this.headerRowHeight}px`;
            headerHandle.setAttribute('data-col', col);
            headerHandle.style.left = `${totalWidth - 8}px`;
            this.headerContainer.appendChild(headerCell);
            this.headerContainer.appendChild(headerHandle);
        }
        this.headerContainer.style.width = `${totalWidth + 10}px`;
    }
    createRowNumber(label) {
        const el = document.createElement('div');
        el.className = 'row-number';
        // el.textContent = label;
        el.innerHTML = `<div>${label}</div>`;
        return el;
    }
    renderRowNumbers() {
        this.rowNumberContainer.innerHTML = '';
        this.rowNumberContainer.onmousedown = (e)=>{
            if (e.button !== 0) return;
            if (e.target.getAttribute('data-row') != null) this.draggingRow = {
                origTop: e.target.style.top,
                el: e.target,
                row: parseInt(e.target.getAttribute('data-row'))
            };
        };
        // Create or reuse row numbers for visible rows
        // let totalHeight = 0;
        let totalHeight = 0;
        for(let row = 0; row <= this.totalRowBounds; row++){
            // if (row >= this.totalRows) break;
            const rowNumberEl = this.createRowNumber(row + 1);
            // rowNumberEl.textContent = row + 1;
            totalHeight += this.rowHeight(row);
            rowNumberEl.style.height = `${this.rowHeight(row)}px`;
            rowNumberEl.style.lineHeight = `${this.rowHeight(row)}px`;
            rowNumberEl.setAttribute('data-rnrow', row);
            this.rowNumberContainer.appendChild(rowNumberEl);
            const rowNumberHandle = document.createElement('div');
            rowNumberHandle.className = 'row-handle';
            rowNumberHandle.setAttribute('data-row', row);
            rowNumberHandle.style.top = `${totalHeight - 5}px`;
            this.rowNumberContainer.appendChild(rowNumberHandle);
        }
        // this.totalHeight = totalHeight;
        this.rowNumberContainer.style.height = `${totalHeight + 20}px`; // extra pixels fixes slight alignment issue on scroll
    }
    get totalRowBounds() {
        return this.heightAccum?.length || this.blockRows;
    }
    get totalColBounds() {
        return this.widthAccum?.length || this.blockCols;
    }
    get totalYBounds() {
        return this.heightAccum[this.heightAccum.length - 1];
    }
    get totalXBounds() {
        return this.widthAccum[this.widthAccum.length - 1];
    }
    updateHeightAccum() {
        let prevRowBounds = this.totalRowBounds;
        const oldHeight = this.heightAccum.length;
        this.heightAccum = [
            this.headerRowHeight
        ];
        let heightSum = this.headerRowHeight;
        const updateVisHeight = this.container.clientHeight + this.container.scrollTop >= this.container.scrollHeight - 150;
        for(let row = 0; row < oldHeight - 1 || row % this.blockRows !== 0 || row < this.totalRows || updateVisHeight && row < prevRowBounds + this.blockRows; row++)this.heightAccum.push(heightSum += this.heightOverrides[row] ?? this.cellHeight);
    }
    updateWidthAccum() {
        let prevColBounds = this.totalColBounds;
        const oldWidth = this.widthAccum.length;
        this.widthAccum = [
            this.rowNumberWidth
        ];
        let widthSum = this.rowNumberWidth;
        const updateVisWidth = this.container.clientWidth + this.container.scrollLeft >= this.container.scrollWidth - 150;
        for(let col = 0; col < oldWidth - 1 || col % this.blockCols !== 0 || col < this.totalCols || updateVisWidth && col < prevColBounds + this.blockCols; col++)this.widthAccum.push(widthSum += this.getColWidth(col));
    }
    updateGridDimensions() {
        this.updateHeightAccum();
        this.updateWidthAccum();
    }
    handleScroll() {
        const updateVisHeight = this.container.clientHeight + this.container.scrollTop >= this.container.scrollHeight - 150;
        const updateVisWidth = this.container.clientWidth + this.container.scrollLeft >= this.container.scrollWidth - 150;
        if (updateVisHeight || updateVisWidth) {
            console.log('SCROLL UPDATE VIS HEIGHT OR WIDTH');
            this.updateGridDimensions();
            this.renderRowNumbers();
            this.renderHeaders();
            this.forceRerender();
        } else this.updateVisibleGrid();
        this.updateSelection();
    }
    calculateVisibleRange() {
        const { row: visStartRow, col: visStartCol } = this.getTopLeftBounds();
        const { row: visEndRow, col: visEndCol } = this.getBottomRightBounds();
        this.visibleStartRow = visStartRow;
        this.visibleStartCol = visStartCol;
        this.visibleEndRow = visEndRow;
        this.visibleEndCol = visEndCol;
    }
    updateVisibleGrid(force = false) {
        const padding = this.padding;
        const maxBlockRows = Math.floor(this.totalRowBounds / this.blockRows);
        const maxBlockCols = Math.floor(this.totalColBounds / this.blockCols);
        this.calculateVisibleRange();
        // Determine which blocks we need to render
        const neededBlocks = new Set();
        const startBlockRow = Math.max(0, Math.floor(this.visibleStartRow / this.blockRows) - padding);
        const endBlockRow = Math.min(maxBlockRows, Math.floor((this.visibleEndRow - 1) / this.blockRows));
        const startBlockCol = Math.max(0, Math.floor(this.visibleStartCol / this.blockCols) - padding);
        const endBlockCol = Math.min(maxBlockCols, Math.floor((this.visibleEndCol - 1) / this.blockCols));
        // console.log('visible blocks', [startBlockRow, startBlockCol], 'through', [endBlockRow, endBlockCol])
        for(let blockRow = startBlockRow; blockRow <= endBlockRow; blockRow++)for(let blockCol = startBlockCol; blockCol <= endBlockCol; blockCol++)neededBlocks.add(`${blockRow},${blockCol}`);
        // Remove blocks that are no longer needed
        const toRemove = [];
        this.activeBlocks.forEach((block, key)=>{
            if (force || !neededBlocks.has(key)) {
                toRemove.push(key);
                this.releaseBlock(block);
            }
        });
        toRemove.forEach((key)=>this.activeBlocks.delete(key));
        // this.updatePlaceholders();
        // TODO: when zoom is >= 170%, subdivide blocks
        requestAnimationFrame(()=>{
            // Add new blocks that are needed
            neededBlocks.forEach((key)=>{
                if (!this.activeBlocks.has(key)) {
                    const [blockRow, blockCol] = key.split(',').map(Number);
                    const block = this.createBlock(blockRow, blockCol);
                } else {
                    // Ensure existing blocks are properly positioned
                    const block = this.activeBlocks.get(key);
                    this.positionBlock(block);
                }
            });
        });
    }
    blockCanvases() {
        if (devicePixelRatio >= 1.875) return 4;
        if (devicePixelRatio > 1.7) return 2;
        else return 1;
    }
    positionBlock(block) {
        // Calculate horizontal position (left)
        let left = this.rowNumberWidth; // Account for row numbers column
        for(let col = 0; col < block.startCol; col++)left += this.getColWidth(col);
        // Calculate vertical position (top)
        const top = this.heightAccum[block.startRow];
        block.blockContainer.style.left = `${left}px`;
        block.blockContainer.style.top = `${top}px`;
        block.blockContainer.style.display = 'block';
    // block.left = left;
    }
    positionSubBlock(block, i) {
        if (i === 0) return;
        // Calculate vertical position (top)
        if (i === 1 || i === 3) block.canvas.style.left = `${block.parentBlock.subBlocks[0].styleWidth}px`;
        if (i >= 2) block.canvas.style.top = `${block.parentBlock.subBlocks[0].styleHeight}px`;
    }
    createBlock(blockRow, blockCol) {
        // Calculate block boundaries
        const startRow = blockRow * this.blockRows;
        const endRow = Math.min(startRow + this.blockRows);
        const startCol = blockCol * this.blockCols;
        const endCol = Math.min(startCol + this.blockCols);
        const blockContainer = document.createElement('div');
        blockContainer.id = `${blockRow},${blockCol}`;
        blockContainer.className = 'canvas-block-container';
        const createCanvas = (idx = null)=>{
            // const canvas = this.pool.pop() || document.createElement('canvas');
            const canvas = document.createElement('canvas');
            canvas.className = 'canvas-block';
            canvas.id = `canvas-${blockRow},${blockCol}${idx != null ? '__' + idx : ''}`;
            return canvas;
        };
        const block = {
            startRow,
            endRow,
            startCol,
            endCol,
            blockRow,
            blockCol,
            blockContainer,
            canvas: null,
            subBlocks: []
        };
        const key = `${blockRow},${blockCol}`;
        this.activeBlocks.set(key, block);
        // const subBlockTemplate = () => {
        //     return { startRow, startCol, endRow, endCol, canvas: createCanvas(), parentBlock: block, isSubBlock: true, index: 0 };
        // }
        this.calculateBlockDimensionsContainer(block);
        this.positionBlock(block);
        // Add to DOM if not already present
        if (!blockContainer.parentNode) this.container.appendChild(blockContainer);
        if (this.blockCanvases() === 1) {
            block.canvas = createCanvas();
            blockContainer.appendChild(block.canvas);
            this.calculateBlockDimensions(block);
            this.renderBlock(block);
        } else {
            if (this.blockCanvases() === 2) block.subBlocks.push({
                startRow,
                startCol,
                endRow,
                endCol: Math.floor((startCol + endCol) / 2),
                canvas: createCanvas(0),
                parentBlock: block,
                isSubBlock: true,
                index: 0
            }, {
                startRow,
                startCol: Math.floor((startCol + endCol) / 2),
                endRow,
                endCol,
                canvas: createCanvas(1),
                parentBlock: block,
                isSubBlock: true,
                index: 1
            });
            else block.subBlocks.push({
                startRow,
                startCol,
                endRow: Math.floor((startRow + endRow) / 2),
                endCol: Math.floor((startCol + endCol) / 2),
                canvas: createCanvas(0),
                parentBlock: block,
                isSubBlock: true,
                index: 0
            }, {
                startRow,
                startCol: Math.floor((startCol + endCol) / 2),
                endRow: Math.floor((startRow + endRow) / 2),
                endCol,
                canvas: createCanvas(1),
                parentBlock: block,
                isSubBlock: true,
                index: 1
            }, {
                startRow: Math.floor((startRow + endRow) / 2),
                startCol,
                endRow,
                endCol: Math.floor((startCol + endCol) / 2),
                canvas: createCanvas(2),
                parentBlock: block,
                isSubBlock: true,
                index: 2
            }, {
                startRow: Math.floor((startRow + endRow) / 2),
                startCol: Math.floor((startCol + endCol) / 2),
                endRow,
                endCol,
                canvas: createCanvas(3),
                parentBlock: block,
                isSubBlock: true,
                index: 3
            });
            for(let i = 0; i < this.blockCanvases(); i++){
                blockContainer.appendChild(block.subBlocks[i].canvas);
                this.calculateBlockDimensions(block.subBlocks[i]);
                this.positionSubBlock(block.subBlocks[i], i);
                this.renderBlock(block.subBlocks[i]);
            }
        }
        return block;
    }
    calculateBlockDimensions(block) {
        let scaleFactor = this.effectiveDevicePixelRatio();
        block.width = 0;
        let styleWidth = 0;
        for(let col = block.startCol; col < block.endCol; col++)block.width += this.getColWidth(col) * scaleFactor;
        block.width = Math.round(block.width);
        styleWidth = block.width / scaleFactor;
        // Calculate block height based on rows
        block.height = (this.heightAccum[block.endRow] - this.heightAccum[block.startRow]) * scaleFactor;
        block.height = Math.round(block.height);
        let styleHeight = block.height / scaleFactor;
        // Set canvas dimensions
        block.canvas.width = block.width;
        block.canvas.height = block.height;
        block.canvas.style.width = `${styleWidth}px`;
        block.canvas.style.height = `${styleHeight}px`;
        const ctx = block.canvas.getContext('2d', {
            alpha: false
        });
        block.styleHeight = styleHeight;
        block.styleWidth = styleWidth;
        ctx.scale(1, 1);
    }
    calculateBlockDimensionsContainer(block) {
        const scaleFactor = this.effectiveDevicePixelRatio();
        // Calculate block width based on columns
        block.width = 0;
        for(let col = block.startCol; col < block.endCol; col++)block.width += this.getColWidth(col) * scaleFactor;
        block.width = Math.round(block.width);
        block.width = block.width / scaleFactor;
        // Calculate block height based on rows
        block.height = (this.heightAccum[block.endRow] - this.heightAccum[block.startRow]) * scaleFactor;
        block.height = Math.round(block.height);
        block.height = block.height / scaleFactor;
        // block.height = (block.endRow - block.startRow) * this.cellHeight;
        block.blockContainer.style.width = `${block.width}px`;
        block.blockContainer.style.height = `${block.height}px`;
        block.styleWidth = block.width;
        block.styleHeight = block.height;
    }
    effectiveDevicePixelRatio() {
        return devicePixelRatio;
    }
    blockKey(block) {
        return `${block.blockRow},${block.blockCol}`;
    }
    rowHeight(row) {
        return this.heightOverrides[row] ?? this.cellHeight;
    }
    leftBlock(block) {
        if (block.isSubBlock) {
            if (block.index === 0) {
                const leftBlock = this.getBlock(block.parentBlock.blockRow, block.parentBlock.blockCol - 1);
                if (!leftBlock) return;
                return leftBlock.subBlocks?.[1];
            } else if (block.index === 1) return block.parentBlock.subBlocks?.[0];
            else if (block.index === 2) {
                const leftBlock = this.getBlock(block.parentBlock.blockRow, block.parentBlock.blockCol - 1);
                if (!leftBlock) return;
                return leftBlock.subBlocks?.[leftBlock.subBlocks?.length - 1];
            } else if (block.index === 3) return block.parentBlock.subBlocks?.[2];
            return null;
        } else return this.getBlock(block.blockRow, block.blockCol - 1);
    }
    blockFromRc(row, col) {
        const blockRow = Math.floor(row / 34);
        const blockCol = Math.floor(col / 34);
        const block = this.getBlock(blockRow, blockCol);
        if (!block) return null; // todo: left block might be pruned because not in view
        if (block.subBlocks.length === 0) return block;
        for (let subBlock of block.subBlocks){
            if (row >= subBlock.startRow && row <= subBlock.endRow && col >= subBlock.startCol && col <= subBlock.endCol) return subBlock;
        }
        return null;
    }
    getKey(row, col) {
        return `${row},${col}`;
    }
    getWidthHeight(row, col) {
        const merged = this.getMerge(row, col);
        let width, height;
        if (merged) width = this.getWidthBetweenColumns(merged.startCol, merged.endCol + 1), height = this.getHeightBetweenRows(merged.startRow, merged.endRow + 1);
        else width = this.getCellWidth(row, col), height = this.getHeight(row, col);
        return {
            width,
            height
        };
    }
    // getBlock(blockRow: number, blockCol: number) {
    //     return this.activeBlocks.get(this.blockKey({ blockRow, blockCol }));
    // }
    getBlock(row, col) {
        const blockRow = Math.floor(row / this.blockRows);
        const blockCol = Math.floor(col / this.blockCols);
        const key = this.getKey(blockRow, blockCol);
        if (this.activeBlocks.has(key)) return this.activeBlocks.get(key);
        return null;
    }
    getBlockOrSubBlock(row, col) {
        const parentBlock = this.getBlock(row, col);
        if (!parentBlock) return null;
        if (parentBlock.subBlocks.length === 0) return parentBlock;
        if (parentBlock.subBlocks.length === 2) {
            let ncol = col % this.blockCols;
            const subBlockCols = Math.floor(this.blockCols / 2);
            let idx = ncol >= subBlockCols ? 1 : 0;
            return parentBlock.subBlocks[idx];
        }
        if (parentBlock.subBlocks.length === 4) {
            let ncol = col % this.blockCols;
            const subBlockCols = Math.floor(this.blockCols / 2);
            let right = ncol >= subBlockCols;
            let nrow = row % this.blockRows;
            const subBlockRows = Math.floor(this.blockRows / 2);
            let bottom = nrow >= subBlockRows;
            let i = 0;
            if (!right && !bottom) i = 0;
            else if (right && !bottom) i = 1;
            else if (!right && bottom) i = 2;
            else if (right && bottom) i = 3;
            return parentBlock.subBlocks[i];
        }
        return null;
    }
    getCellCoordsContainer(row, col) {
        const merge = this.getMerge(row, col);
        let left, top, width, height, value;
        if (merge) {
            left = this.getWidthOffset(merge.startCol, true);
            top = this.getHeightOffset(merge.startRow, true);
            width = this.getMergeWidth(merge);
            height = this.getMergeHeight(merge);
            row = merge.startRow, col = merge.startCol;
        } else {
            left = this.getWidthOffset(col, true);
            top = this.getHeightOffset(row, true);
            width = this.getCellWidth(row, col);
            height = this.rowHeight(row);
        }
        return {
            left,
            top,
            width,
            height,
            row,
            col
        };
    }
    getCellCoordsCanvas(row, col) {
        const block = this.getBlockOrSubBlock(row, col);
        // if (!block) return null;
        const merge = this.getMerge(row, col);
        let left, top, width, height;
        if (merge) {
            left = this.getWidthBetweenColumns(block.startCol, merge.startCol);
            top = this.getHeightBetweenRows(block.startRow, merge.startRow);
            width = this.getMergeWidth(merge);
            height = this.getMergeHeight(merge);
            row = merge.startRow, col = merge.startCol;
        } else {
            left = this.getWidthBetweenColumns(block.startCol, col);
            top = this.getHeightBetweenRows(block.startRow, row);
            width = this.getCellWidth(row, col);
            height = this.rowHeight(row);
        }
        return {
            left,
            top,
            width,
            height,
            row,
            col
        };
    }
    renderBorders(ctx, row, col) {
        if (!this.getCell(row, col)?.border) return;
        const border = this.getCell(row, col)?.border;
        ctx.save();
        ctx.strokeStyle = 'red';
        // left border
        if ((0, _utils.hasBorderStr)(border, 'left')) {
            ctx.beginPath();
            ctx.moveTo(this.getWidthOffset(col) * devicePixelRatio, this.getHeightOffset(row) * devicePixelRatio);
            ctx.lineTo(this.getWidthOffset(col) * devicePixelRatio, (this.getHeightOffset(row) + this.getCellHeight(row)) * devicePixelRatio);
            ctx.stroke();
        }
        // top border
        if ((0, _utils.hasBorderStr)(border, 'top')) {
            ctx.beginPath();
            ctx.moveTo(this.getWidthOffset(col) * devicePixelRatio, this.getHeightOffset(row) * devicePixelRatio);
            ctx.lineTo((this.getWidthOffset(col) + this.getCellWidth(col)) * devicePixelRatio, this.getHeightOffset(row) * devicePixelRatio);
            ctx.stroke();
        }
        // right border
        if ((0, _utils.hasBorderStr)(border, 'right')) {
            ctx.beginPath();
            ctx.moveTo((this.getWidthOffset(col) + this.getCellWidth(col)) * devicePixelRatio, this.getHeightOffset(row) * devicePixelRatio);
            ctx.lineTo((this.getWidthOffset(col) + this.getCellWidth(col)) * devicePixelRatio, (this.getHeightOffset(row) + this.getCellHeight(row)) * devicePixelRatio);
            ctx.stroke();
        }
        // bottom border
        if ((0, _utils.hasBorderStr)(border, 'bottom')) {
            ctx.beginPath();
            ctx.moveTo(this.getWidthOffset(col) * devicePixelRatio, (this.getHeightOffset(row) + this.getCellHeight(row)) * devicePixelRatio);
            ctx.lineTo((this.getWidthOffset(col) + this.getCellWidth(col)) * devicePixelRatio, (this.getHeightOffset(row) + this.getCellHeight(row)) * devicePixelRatio);
            ctx.stroke();
        }
        ctx.restore();
    }
    renderCell(row, col, srcblock, ctx) {
        // if (this.getMerge(row, col)) {
        //     // this.forceRerender();
        //     return;
        // }
        if (!ctx) {
            let block = srcblock;
            if (!block) block = this.getBlockOrSubBlock(row, col);
            if (block) ctx = block.canvas.getContext('2d', {
                alpha: false
            });
        }
        let { left, top, width, height } = this.getCellCoordsCanvas(row, col);
        if (ctx) ctx.fillStyle = '#ffffff';
        if (!srcblock || this.rowColInBounds(row, col, srcblock)) // console.log('inbounds::', row,col)
        ctx && ctx.fillRect((left + 1) * devicePixelRatio, (top + 1) * devicePixelRatio, (width - 2) * devicePixelRatio, (height - 2) * devicePixelRatio);
        else {
            const ssr = srcblock.startRow, sec = srcblock.endCol;
            const merge = this.getMerge(row, col);
            if (!merge) return;
            row = merge.startRow, col = merge.startCol;
            const _width = this.getWidthBetweenColumns(srcblock.startCol, merge.endCol + 1);
            const _height = this.getHeightBetweenRows(srcblock.startRow, merge.endRow + 1);
            left = _width - width;
            top = _height - height;
            ctx && ctx.fillRect((left + 1) * devicePixelRatio, (top + 1) * devicePixelRatio, (width - 2) * devicePixelRatio, (height - 2) * devicePixelRatio);
        }
        if (ctx) ctx.fillStyle = '#333333';
        this.renderBorders(ctx, row, col);
        if (this.getCell(row, col).cellType === 'button') {
            const button = this.getButton(row, col).el;
            ({ left, top, width, height } = this.getCellCoordsContainer(row, col));
            this.positionElement(button, left, top, width, height);
        } else if (this.getCell(row, col).cellType === 'linechart') {
            const lineChart = this.getLineChart(row, col)?.el;
            ({ left, top, width, height } = this.getCellCoordsContainer(row, col));
            this.positionElement(lineChart, left, top, width, height);
        } else {
            this.clearElRegistry(row, col);
            this.renderCellText(ctx, left, top, width, row, col);
            if ((0, _dependencytracker.dependencyTree)[row]?.[col]) {
                for(let childRow in (0, _dependencytracker.dependencyTree)[row][col])for(let childCol in (0, _dependencytracker.dependencyTree)[row][col][childRow])this.renderCell(childRow, childCol);
            }
        }
    }
    scalerZoom() {
        return devicePixelRatio;
    }
    renderBlock(block, calcDimensions = false) {
        if (calcDimensions) this.calculateBlockDimensions(block);
        const ctx = block.canvas.getContext('2d', {
            alpha: false
        });
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, block.canvas.width, block.canvas.height);
        // Set rendering quality based on zoom
        this.applyRenderingQuality(ctx);
        // Draw cells
        let x = 0;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333333';
        const scaler = 88;
        ctx.strokeStyle = `hsl(0,0%,${scaler}%)`;
        ctx.lineWidth = 1;
        ctx.font = this.getFontString();
        ctx.translate(0.5, 0.5); // thick gridlines fix
        // draw row gridlines
        let y;
        if (this.gridlinesOn && this.quality() !== 'performance') for(let row = block.startRow; row < block.endRow; row++){
            y = Math.round((this.heightAccum[row] - this.heightAccum[block.startRow]) * devicePixelRatio);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(block.canvas.width, y);
            ctx.stroke();
        }
        // draw col grid lines
        if (this.gridlinesOn && this.quality() !== 'performance') for(let col = block.startCol; col < block.endCol; col++){
            const colWidth = this.getColWidth(col);
            // draw col gridlines
            ctx.beginPath();
            ctx.moveTo(Math.round(x * devicePixelRatio), 0);
            ctx.lineTo(Math.round(x * devicePixelRatio), block.canvas.height);
            ctx.stroke();
            x += colWidth;
        }
        x = 0;
        const seenMerges = new Set();
        for(let col = block.startCol; col < block.endCol; col++){
            const colWidth = this.getColWidth(col);
            for(let row = block.startRow; row < block.endRow; row++){
                if (!this.getCell(row, col)) continue;
                // Check if the cell is part of a merged range
                const merged = this.getMerge(row, col);
                if (merged) continue;
                const y = this.heightAccum[row] - this.heightAccum[block.startRow];
                // Skip rendering if the cell is part of a merged range (except the top-left cell)
                const renderWidth = colWidth;
                if (this.getCell(row, col).cellType === 'button') {
                    if (!merged) {
                        const button = this.getButton(row, col).el;
                        this.positionElement(button, this.widthAccum[col], this.heightAccum[row], renderWidth, this.rowHeight(row));
                    }
                } else if (this.getCell(row, col).cellType === 'linechart') {
                    const lineChart = this.getLineChart(row, col)?.el;
                    this.positionElement(lineChart, this.widthAccum[col], this.heightAccum[row], renderWidth, this.rowHeight(row));
                } else {
                    this.renderBorders(ctx, row, col);
                    this.renderCellText(ctx, x, y, renderWidth, row, col);
                }
            }
            x += colWidth;
        }
        this.renderMergesOnBlock(block, ctx);
    }
    renderMergesOnBlock(block, ctx) {
        const merges = this.getMergesInRange(block);
        for (let merge of merges){
            const row = merge.startRow, col = merge.startCol;
            this.renderCell(row, col, block, ctx);
        }
    }
    clearElRegistry(row, col) {
        const _id = this.getCellId(row, col);
        if (this.elRegistry[_id]) this.elRegistry[_id].el.parentNode?.removeChild(this.elRegistry[_id].el);
    }
    isSelectStart(row, col) {
        if (!this.selectionStart) return;
        return this.selectionStart.row === row && this.selectionStart.col === col;
    }
    isSelectEnd(row, col) {
        if (!this.selectionEnd) return;
        return this.selectionEnd.row === row && this.selectionEnd.col === col;
    }
    positionElement(el, x, y, width, height, append = true) {
        el.style.top = `${y}px`;
        el.style.left = `${x}px`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        append && this.container.appendChild(el);
    }
    getCellId(row, col) {
        return this.getCell(row, col)?._id;
    }
    getButton(row, col) {
        const _id = this.getCellId(row, col);
        if (this.elRegistry[_id] && this.elRegistry[_id].type === 'button') return this.elRegistry[_id];
        else if (this.elRegistry[_id] && this.elRegistry.type !== 'button') this.elRegistry[_id].el.parentNode?.removeChild(this.elRegistry[_id].el);
        const button = document.createElement('button');
        button.textContent = this.getCellText(row, col);
        button.onclick = (e)=>e.stopPropagation();
        button.ondblclick = (e)=>e.stopPropagation();
        button.style.zIndex = 1;
        button.style.position = 'absolute';
        button.style.overflow = 'hidden';
        button.style.userSelect = 'none';
        this.elRegistry[_id] = {
            type: 'button',
            el: button
        };
        return this.elRegistry[_id];
    }
    getLineChart(row, col) {
        const _id = this.getCellId(row, col);
        if (this.elRegistry[_id] && this.elRegistry[_id].type === 'lineChart') {
            const data = this.elRegistry[_id].data;
            const { width, height } = this.getWidthHeight(row, col);
            this.elRegistry[_id].lineChart.render(data, width, height);
            return this.elRegistry[_id];
        } else if (this.elRegistry[_id] && this.elRegistry[_id].type !== 'lineChart') this.elRegistry[_id].el.parentNode?.removeChild(this.elRegistry[_id].el);
        const data = [
            [
                "10",
                "2023-01-01"
            ],
            [
                "15",
                "2023-01-02"
            ],
            [
                "12",
                "2023-01-03"
            ],
            [
                "20",
                "2023-01-04"
            ],
            [
                "18",
                "2023-01-05"
            ],
            [
                "25",
                "2023-01-06"
            ],
            [
                "22",
                "2023-01-07"
            ]
        ];
        const wrapper = document.createElement('div');
        // wrapper.appendChild(lineChart.container);
        wrapper.onclick = (e)=>e.stopPropagation();
        wrapper.ondblclick = (e)=>e.stopPropagation();
        wrapper.style.zIndex = 1;
        wrapper.style.position = 'absolute';
        wrapper.style.overflow = 'hidden';
        wrapper.style.height = '100%';
        wrapper.style.width = '100%';
        const { width, height } = this.getWidthHeight(row, col);
        const lineChart = (0, _linechartJs.createLineChart)(data, wrapper, width, height);
        this.elRegistry[_id] = {
            el: wrapper,
            lineChart,
            data,
            type: 'lineChart'
        };
        return this.elRegistry[_id];
    }
    getWidthOffset(col, withStickyLeftBar = false) {
        return this.widthAccum[col] - (withStickyLeftBar ? 0 : this.rowNumberWidth);
    }
    getHeightOffset(row, withStickyHeader = false) {
        return this.heightAccum[row] - (withStickyHeader ? 0 : this.headerRowHeight);
    }
    getCellWidth(a, b = null) {
        let col = a;
        if (typeof b === 'number') col = b;
        return this.getColWidth(col);
    }
    getCellHeight(row, col = null) {
        return this.rowHeight(row);
    }
    getHeight(row, col = null) {
        return this.rowHeight(row);
    }
    getWidthBetweenColumns(col1, col2) {
        let accumulatedWidth = 0;
        for(let _col = col1; _col < col2; _col++){
            const colWidth = this.getColWidth(_col);
            accumulatedWidth += colWidth;
        }
        return accumulatedWidth;
    }
    getHeightBetweenRows(startRow, endRow) {
        if (endRow < startRow) {
            let tmp = endRow;
            endRow = startRow;
            startRow = tmp;
        }
        return this.heightAccum[endRow] - this.heightAccum[startRow];
    }
    quality() {
        const devicePixelRatio1 = window.devicePixelRatio;
        if (devicePixelRatio1 < 0.5) return 'performance';
        else if (devicePixelRatio1 < 1) return 'balance';
        else return 'max';
    }
    applyRenderingQuality(ctx) {
        switch(this.quality()){
            case 'performance':
                ctx.textRendering = 'optimizeSpeed';
                ctx.imageSmoothingEnabled = false;
                break;
            case 'balance':
                ctx.textRendering = 'geometricPrecision';
                ctx.imageSmoothingEnabled = true;
                break;
            case 'max':
            default:
                ctx.textRendering = 'geometricPrecision';
                ctx.imageSmoothingEnabled = true;
        }
    }
    getCell(row, col) {
        if (!this.data) return {
            row,
            col
        };
        return this.data.get(row, col);
    }
    getCellText(row, col) {
        return this.getCell(row, col)?.text || '';
    }
    getCellTextAlign(row, col) {
        return this.getCell(row, col)?.textAlign;
    }
    renderCellText(ctx, x, y, width, row, col, _text = '') {
        const value = this.getCellText(row, col);
        let text = value !== undefined && value !== null ? String(value) : '';
        if (_text !== '') text = _text;
        // if (text === '') return;
        try {
            (0, _dependencytracker.removeDependents)(row, col);
            text = this.parser.evaluateExpression(text, [
                row,
                col
            ]);
        } catch (e) {
            console.warn(e);
            text;
        }
        if (text === '') return;
        ctx.save(); // Save the current state
        if (this.getCellColor(row, col)) ctx.fillStyle = this.getCellColor(row, col);
        if (this.getCell(row, col)?.fontSize != null) ctx.font = this.getFontString(row, col);
        if (this.getCell(row, col)?.textBaseline != null) ctx.textBaseline = this.getCell(row, col).textBaseline;
        ctx.beginPath();
        if (this.getCellTextAlign(row, col)) ctx.textAlign = this.getCellTextAlign(row, col);
        ctx.rect(x * devicePixelRatio, y * devicePixelRatio, width * devicePixelRatio, this.rowHeight(row) * devicePixelRatio); // Adjust y position based on your text baseline
        ctx.clip();
        ctx.fillText(text, (x + 4) * devicePixelRatio, (y + this.rowHeight(row) / 2) * devicePixelRatio);
        ctx.restore(); // Restore the state to remove clipping
    }
    getCellColor(row, col) {
        return this.getCell(row, col)?.color ?? '';
    }
    getAbbreviatedText(text) {
        if (text.length > 8) return text.substring(0, 5) + '...';
        return text;
    }
    getFontString(row = null, col = null) {
        let fontSize = 12 * devicePixelRatio;
        if (row != null && col != null && this.getCell(row, col).fontSize != null) fontSize = this.getCell(row, col).fontSize;
        let fontString = `${fontSize}px Arial`;
        if (this.quality() === 'max' && devicePixelRatio >= 1) // Only use subpixel rendering when not zoomed out
        fontString += ', sans-serif';
        return fontString;
    }
    releaseBlock(block) {
        if (block.subBlocks.length > 1) while(block.subBlocks.length > 1)block.subBlocks.pop();
        block.blockContainer.innerHTML = '';
        block.blockContainer.parentNode.removeChild(block.blockContainer);
    }
}
exports.default = Sheet;

},{"packages/sparsegrid":"72weS","packages/expressionparser":"8OaEa","./windows/format":"7E84C","./graphs/linechart.js":"5HFoS","packages/financial/index":"kDraw","packages/dependencytracker":"91xLf","./utils":"8uhD9","./shiftops":"j0IU6","./templates":"6k5Dl","./components/contextmenu":"gI5GS","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"72weS":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
function createUuid() {
    let _id = 1;
    return function() {
        return _id++;
    };
}
const uuid = createUuid();
class SparseGrid {
    constructor(){
        this._data = []; // {row: {col: value}}
        this._colCounts = []; // {col: count}
        this._topRow = Infinity;
        this._bottomRow = -Infinity;
        this._leftCol = Infinity;
        this._rightCol = -Infinity;
        this._totalValues = 0;
        this._totalRows = 0; // Track distinct rows with data
        this._totalCols = 0; // Track distinct columns with data
        this._valueCount = 0;
    }
    save() {
        const state = {
            // Store data as arrays for compactness
            d: Object.keys(this._data).map((row)=>[
                    Number(row),
                    Object.keys(this._data[row]).map((col)=>[
                            col === 'count' ? col : Number(col),
                            this._data[row][col]
                        ])
                ]),
            // Store counts as arrays for compactness
            cc: Object.entries(this._colCounts).map(([col, count])=>[
                    Number(col),
                    count
                ]),
            // Store boundaries
            tr: this._topRow,
            br: this._bottomRow,
            lc: this._leftCol,
            rc: this._rightCol,
            // Store totals
            tv: this._totalValues,
            trow: this._totalRows,
            tcol: this._totalCols
        };
        return JSON.stringify(state);
    }
    restore(json) {
        const state = JSON.parse(json);
        // Clear current state
        this.clear();
        // Rebuild data structure
        state.d.forEach(([row, cols])=>{
            this._data[row] = [];
            cols.forEach(([col, value])=>{
                this._data[row][col] = value;
            });
        });
        state.cc.forEach(([col, count])=>{
            this._colCounts[col] = count;
        });
        // Restore boundaries and totals
        this._topRow = state.tr;
        this._bottomRow = state.br;
        this._leftCol = state.lc;
        this._rightCol = state.rc;
        this._totalValues = state.tv;
        this._totalRows = state.trow;
        this._totalCols = state.tcol;
        return this;
    }
    // Set a value at a specific row and column
    setCellProperty(row, col, property, value) {
        const cell = this.get(row, col);
        if (!cell._id) cell._id = uuid();
        cell[property] = value;
        this.set(row, col, cell);
    }
    setRowSize(row, size) {
        if (!this._data[row]) return;
        this._data[row].size = size;
    }
    incrementRowSize(row) {
        if (!this._data[row]) return;
        this._data[row].size++;
    }
    decrementRowSize(row) {
        if (!this._data[row]) return;
        this._data[row].size--;
    }
    set(row, col, value) {
        if (!Number.isInteger(row) || !Number.isInteger(col)) throw new Error('Coordinates must be integers');
        const isNewRow = !this._data[row];
        const isNewCell = isNewRow || !Object.hasOwn(this._data[row], col);
        const isNewCol = isNewCell && !this._colCounts[col];
        if (isNewRow) {
            this._data[row] = [];
            this.setRowSize(row, 0);
            this._totalRows++;
            // Update row boundaries
            if (row < this._topRow) this._topRow = row;
            if (row > this._bottomRow) this._bottomRow = row;
        }
        if (isNewCell) {
            this.incrementRowSize(row);
            this._totalValues++;
            if (isNewCol) {
                this._colCounts[col] = 0;
                this._totalCols++;
            }
            this._colCounts[col]++;
            // Update column boundaries
            if (col < this._leftCol) this._leftCol = col;
            if (col > this._rightCol) this._rightCol = col;
        }
        this._data[row][col] = value;
        if (!value._id) value._id = uuid();
        return isNewCell;
    }
    decrementColSize(col) {
        this._colCounts[col]--;
        if (this._colCounts[col] <= 0) delete this._colCounts[col];
    }
    incrementColSize(col) {
        if (!this._colCounts[col]) this._colCounts[col] = 0;
        this._colCounts[col]++;
    }
    deleteRow(row) {
        const rowObj = this._data[row];
        if (rowObj) {
            for(let col in rowObj)this.decrementColSize(col);
            this._totalRows--;
        }
        this._data.splice(row, 1);
        this._recalculateBoundaries();
        return rowObj;
    }
    addRow(row, data = []) {
        data = data || [];
        for(let col in data)this.incrementColSize(col);
        if (data.length > 0) this._totalRows++;
        this._data.splice(row, 0, data);
        this._recalculateBoundaries();
        return null;
    }
    addCol(col, data = []) {
        data = data || [];
        for(let row in this._data){
            if (row === 'count') continue;
            this._data[row].splice(col, 0, undefined);
            delete this._data[row][col];
            if (row in data) {
                this._data[row][col] = data[row];
                this.incrementRowSize(row);
            }
        }
        if (data.length > 0) this._totalCols++;
        this._recalculateBoundaries();
        return null;
    }
    getCol(col) {
        const colData = [];
        for(let row in this._data){
            if (row === 'count') continue;
            if (col in this._data[row]) colData[row] = this._data[row][col];
        }
        return colData;
    }
    deleteCol(col) {
        const colData = this.getCol(col);
        const colCount = this._colCounts[col];
        colData.size = colCount;
        if (this._colCounts[col]) this._totalCols--;
        for(let row in this._data){
            if (row === 'count') continue;
            if (this.has(row, col)) this.decrementColSize(col);
            this._data[row].splice(col, 1);
        }
        this._colCounts.splice(col, 1); // shift colcounts
        this._recalculateBoundaries();
        return colData;
    }
    delete(row, col) {
        if (!this.has(row, col)) return false;
        delete this._data[row][col];
        this.decrementRowSize(row);
        this._colCounts[col]--;
        this._totalValues--;
        // Check if row became empty
        if (this._data[row].size === 0) {
            delete this._data[row];
            this._totalRows--;
        }
        // Check if column became empty
        if (this._colCounts[col] === 0) {
            delete this._colCounts[col];
            this._totalCols--;
        }
        let boundariesChanged = false;
        if (row === this._topRow || row === this._bottomRow) boundariesChanged = true;
        if (col === this._leftCol || col === this._rightCol) boundariesChanged = true;
        if (boundariesChanged) this._recalculateBoundaries();
        return true;
    }
    _recalculateBoundaries() {
        if (this.totalRows === 0) {
            this._topRow = Infinity;
            this._bottomRow = -Infinity;
            this._leftCol = Infinity;
            this._rightCol = -Infinity;
            return;
        }
        let minRow = Infinity;
        let maxRow = -Infinity;
        let minCol = Infinity;
        let maxCol = -Infinity;
        for(let row in this._data){
            row = parseInt(row);
            if (row < minRow) minRow = row;
            if (row > maxRow) maxRow = row;
            for(let col in this._data[row]){
                col = parseInt(col);
                if (col < minCol) minCol = col;
                if (col > maxCol) maxCol = col;
            }
        }
        this._topRow = minRow;
        this._bottomRow = maxRow;
        this._leftCol = minCol;
        this._rightCol = maxCol;
    }
    get(row, col) {
        if (!this._data[row] || !Object.hasOwn(this._data[row], col)) return {
            row,
            col
        };
        return this._data[row][col];
    }
    has(row, col = null) {
        if (col == null) return Object.hasOwn(this._data, row);
        return Object.hasOwn(this._data, row) && Object.hasOwn(this._data[row], col);
    }
    deleteCells(coordinates) {
        let deletedCount = 0;
        let boundaryChanged = false;
        const affectedRows = {};
        // First pass: perform deletions
        for (const [row, col] of coordinates){
            if (!Number.isInteger(row) || !Number.isInteger(col)) continue;
            if (this.has(row, col)) {
                delete this._data[row][col];
                this.decrementRowSize(row);
                this._colCounts[col]--;
                deletedCount++;
                affectedRows[row] = true;
                if (col === this._leftCol || col === this._rightCol) boundaryChanged = true;
            }
        }
        // Second pass: clean empty rows
        for(const row in affectedRows)if (this._data[row].size === 0) {
            delete this._data[row];
            const numRow = Number(row);
            if (numRow === this._topRow || numRow === this._bottomRow) boundaryChanged = true;
        }
        this._totalValues -= deletedCount;
        if (boundaryChanged) this._recalculateBoundaries();
        return deletedCount;
    }
    // Get count of cells in a specific row
    getRowCount(row) {
        return this._data[row].size || 0;
    }
    // Get all non-empty rows with their counts
    getRowCounts() {
        return Object.fromEntries(Object.entries(this._data).map(([row, data])=>[
                Number(row),
                data.size
            ]));
    }
    deleteCellsArea(startRow, startCol, endRow, endCol) {
        const [minRow, maxRow] = [
            Math.min(startRow, endRow),
            Math.max(startRow, endRow)
        ];
        const [minCol, maxCol] = [
            Math.min(startCol, endCol),
            Math.max(startCol, endCol)
        ];
        let deletedCount = 0;
        let boundariesChanged = false;
        // We need to collect rows first to avoid modifying while iterating
        const rowsToProcess = [];
        for(const row in this._rows)if (row >= minRow && row <= maxRow) rowsToProcess.push(row);
        for (const row of rowsToProcess){
            const rowArr = this._rows[row];
            // Collect columns to delete
            const colsToDelete = [];
            for(const col in rowArr)if (col >= minCol && col <= maxCol) colsToDelete.push(col);
            // Delete the collected columns
            for (const col of colsToDelete){
                delete rowArr[col];
                this.decrementRowSize(row);
                this._colCounts[col]--;
                deletedCount++;
                if (col == this._leftCol || col == this._rightCol) boundariesChanged = true;
            }
            // Clean empty rows
            if (this._data[row].size === 0) {
                delete this._data[row];
                this._totalRows--;
                boundariesChanged = true;
            }
        }
        this._valueCount -= deletedCount;
        if (boundariesChanged) this._recalculateBoundaries();
        return deletedCount;
    }
    getCells(startRow, startCol, endRow, endCol) {
        const cells = [];
        const [minRow, maxRow] = [
            Math.min(startRow, endRow),
            Math.max(startRow, endRow)
        ];
        const [minCol, maxCol] = [
            Math.min(startCol, endCol),
            Math.max(startCol, endCol)
        ];
        // Get and sort rows in range
        const rows = Object.keys(this._data).map(Number).filter((row)=>row >= minRow && row <= maxRow);
        for (const row of rows){
            // Get and sort columns in range
            const cols = Object.keys(this._data[row]).map(Number).filter((col)=>col >= minCol && col <= maxCol);
            for (const col of cols)cells.push({
                row,
                col,
                value: this._data[row][col]
            });
        }
        return cells;
    }
    getCellsForce(startRow, startCol, endRow, endCol) {
        const cells = [];
        for(let row = startRow; row <= endRow; row++)for(let col = startCol; col <= endCol; col++)cells.push({
            row,
            col
        });
        return cells;
    }
    // Accessors
    get topRow() {
        return this._topRow === Infinity ? null : this._topRow;
    }
    get bottomRow() {
        return this._bottomRow === -Infinity ? null : this._bottomRow;
    }
    get leftCol() {
        return this._leftCol === Infinity ? null : this._leftCol;
    }
    get rightCol() {
        return this._rightCol === -Infinity ? null : this._rightCol;
    }
    get totalRows() {
        return this._totalRows;
    }
    get totalColumns() {
        return this._totalCols;
    }
    get totalValues() {
        return this._totalValues;
    }
    get rowCount() {
        return this._topRow !== Infinity && this._bottomRow !== -Infinity ? this._bottomRow - this._topRow + 1 : 0;
    }
    get colCount() {
        return this._leftCol !== Infinity && this._rightCol !== -Infinity ? this._rightCol - this._leftCol + 1 : 0;
    }
    get valueCount() {
        return this._valueCount;
    }
    get allDimensions() {
        return {
            topRow: this.topRow,
            bottomRow: this.bottomRow,
            leftCol: this.leftCol,
            rightCol: this.rightCol,
            rowCount: this.rowCount,
            colCount: this.colCount,
            totalValues: this.totalValues
        };
    }
    clear() {
        this._data = [];
        this._topRow = Infinity;
        this._bottomRow = -Infinity;
        this._leftCol = Infinity;
        this._rightCol = -Infinity;
        this._valueCount = 0;
    }
    forEach(callback) {
        let counter = 0;
        for(let row in this._data){
            if (row === 'count') continue;
            for(let col in this._data[row])callback(this._data[row][col], row, col, counter++);
        }
    }
}
exports.default = SparseGrid;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"8OaEa":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _finData = require("./financial/FinData");
var _finDataDefault = parcelHelpers.interopDefault(_finData);
var _dependencytracker = require("./dependencytracker");
class ExpressionParser {
    constructor(data){
        this.data = data; // Spreadsheet data
        this.finData = new (0, _finDataDefault.default)();
    }
    // Add a dependency relationship
    addDependency(source, target) {
        const sr = source[0], sc = source[1];
        const tr = target[0], tc = target[1];
        if (!(0, _dependencytracker.dependencyTree)[tr]) (0, _dependencytracker.dependencyTree)[tr] = {};
        if (!(0, _dependencytracker.dependencyTree)[tr][tc]) (0, _dependencytracker.dependencyTree)[tr][tc] = {};
        if (!(0, _dependencytracker.dependencyTree)[tr][tc][sr]) (0, _dependencytracker.dependencyTree)[tr][tc][sr] = {};
        (0, _dependencytracker.dependencyTree)[tr][tc][sr][sc] = true;
        if (!(0, _dependencytracker.reverseDependencyTree)[sr]) (0, _dependencytracker.reverseDependencyTree)[sr] = {};
        if (!(0, _dependencytracker.reverseDependencyTree)[sr][sc]) (0, _dependencytracker.reverseDependencyTree)[sr][sc] = {};
        if (!(0, _dependencytracker.reverseDependencyTree)[sr][sc][tr]) (0, _dependencytracker.reverseDependencyTree)[sr][sc][tr] = {};
        (0, _dependencytracker.reverseDependencyTree)[sr][sc][tr][tc] = true;
    }
    // Tokenize the input expression
    tokenize(expression) {
        // Remove leading '=' if present
        if (expression.startsWith('=')) expression = expression.slice(1);
        const tokens = [];
        const regex = /\s*(=>|[-+*/^()]|[A-Za-z_]\w*|\d*\.?\d+|\S)\s*/g;
        let match;
        while((match = regex.exec(expression)) !== null)tokens.push(match[1]);
        return tokens;
    }
    static tokenizeWithIndex(expression) {
        // Remove leading '=' if present
        if (expression.startsWith('=')) expression = expression.slice(1);
        const tokens = [];
        const regex = /\s*(=>|[-+*/^()]|[A-Za-z_]\w*|\d*\.?\d+|\S)\s*/dg;
        let match;
        while((match = regex.exec(expression)) !== null)tokens.push([
            match[1],
            match.indices[1]
        ]);
        return tokens;
    }
    // Parse the tokens into an AST
    parse(tokens) {
        let index = 0;
        const parseExpression = ()=>{
            let left = parseTerm();
            while(index < tokens.length && (tokens[index] === '+' || tokens[index] === '-')){
                const operator = tokens[index];
                index++;
                const right = parseTerm();
                left = {
                    type: 'BinaryExpression',
                    operator,
                    left,
                    right
                };
            }
            return left;
        };
        const parseTerm = ()=>{
            let left = parseFactor();
            while(index < tokens.length && (tokens[index] === '*' || tokens[index] === '/')){
                const operator = tokens[index];
                index++;
                const right = parseFactor();
                left = {
                    type: 'BinaryExpression',
                    operator,
                    left,
                    right
                };
            }
            return left;
        };
        const parseFactor = ()=>{
            if (tokens[index] === '(') {
                index++;
                const expr = parseExpression();
                if (tokens[index] !== ')') throw new Error('Expected closing parenthesis');
                index++;
                return expr;
            } else if (/^\d+$/.test(tokens[index])) return {
                type: 'Number',
                value: parseFloat(tokens[index++])
            };
            else if (tokens[index] === ':') return {
                type: 'RangeReference',
                value: tokens[index++]
            };
            else if (/^[A-Za-z]+\d+$/.test(tokens[index])) {
                if (tokens[index + 1] === ':') return {
                    type: 'RangeReference',
                    value: `${tokens[index++]}${tokens[index++]}${tokens[index++]}`
                };
                return {
                    type: 'CellReference',
                    value: tokens[index++]
                };
            } else if (/^[A-Za-z_]\w*$/.test(tokens[index])) return {
                type: 'Function',
                name: tokens[index++],
                args: parseArguments()
            };
            else throw new Error(`Unexpected token: ${tokens[index]}`);
        };
        const parseArguments = ()=>{
            const args = [];
            if (tokens[index] === '(') {
                index++;
                while(tokens[index] !== ')'){
                    args.push(parseExpression());
                    if (tokens[index] === ',') index++;
                }
                index++;
            }
            return args;
        };
        return parseExpression();
    }
    // Evaluate the AST
    evaluate(ast, source) {
        // if (source) {
        //     // Remove old dependencies before evaluating
        //     this.removeDependencies(source);
        // }
        switch(ast.type){
            case 'Number':
                return ast.value;
            case 'CellReference':
                if (source) {
                    const { row, col } = this.parseCellReference(ast.value);
                    this.addDependency(source, [
                        row,
                        col
                    ]);
                }
                return this.getCellValue(ast.value);
            case 'RangeReference':
                if (source) {
                    const [startCell, endCell] = ast.value.split(':');
                    const start = this.parseCellReference(startCell);
                    const end = this.parseCellReference(endCell);
                    for(let row = start.row; row <= end.row; row++)for(let col = start.col; col <= end.col; col++)this.addDependency(source, [
                        row,
                        col
                    ]);
                }
                return this.getRangeValues(ast.value);
            case 'BinaryExpression':
                return this.evaluateBinaryExpression(ast, source);
            case 'Function':
                return this.evaluateFunction(ast, source);
            default:
                throw new Error(`Unknown AST node type: ${ast.type}`);
        }
    }
    // Evaluate binary expressions (e.g., +, -, *, /, ^)
    evaluateBinaryExpression(ast, source) {
        const left = this.evaluate(ast.left, source);
        const right = this.evaluate(ast.right, source);
        switch(ast.operator){
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '*':
                return left * right;
            case '/':
                return left / right;
            case '^':
                return Math.pow(left, right);
            default:
                throw new Error(`Unknown operator: ${ast.operator}`);
        }
    }
    // Evaluate functions (e.g., SUM, AVERAGE)
    evaluateFunction(ast, source) {
        const args = ast.args.map((arg)=>this.evaluate(arg));
        switch(ast.name.toUpperCase()){
            case 'SUM':
                return args.flat().reduce((sum, val)=>sum + val, 0);
            case 'AVERAGE':
                const values = args.flat();
                return values.reduce((sum, val)=>sum + val, 0) / values.length;
            case 'ERROR':
                return 'ERROR';
            case 'REFERROR':
                return 'REFERROR';
            default:
                // tickerReg[source[0]]
                console.log('subbing', ast.name);
                if (!(0, _dependencytracker.tickerReg)[ast.name]) (0, _dependencytracker.tickerReg)[ast.name] = {};
                (0, _dependencytracker.tickerReg)[ast.name][`${source[0]},${source[1]}`] = true;
                if (this.finData.get('YA', ast.name)) return this.finData.get('YA', ast.name).price;
                else return '';
        }
    }
    getCellText(row, col) {
        return this.data.get(row, col)?.text ?? '';
    }
    // Get the value of a cell reference (e.g., A1, B2)
    getCellValue(cellRef) {
        const { row, col } = this.parseCellReference(cellRef);
        if (row < 0 || row > this.bottomRow || col < 0 || col > this.data.rightCol) return '';
        const value = this.getCellText(row, col);
        // If the cell value is a formula (starts with '='), evaluate it recursively
        if (typeof value === 'string' && value.startsWith('=')) return this.evaluateExpression(value, [
            row,
            col
        ]);
        // Otherwise, treat it as a literal value
        return typeof value === 'number' ? value : parseFloat(value) || 0;
    }
    // Get the values of a range reference (e.g., A1:B2)
    getRangeValues(rangeRef) {
        const [startCell, endCell] = rangeRef.split(':');
        const start = this.parseCellReference(startCell);
        const end = this.parseCellReference(endCell);
        const values = [];
        for(let row = start.row; row <= end.row; row++)for(let col = start.col; col <= end.col; col++){
            if (row < 0 || row >= this.data.bottomRow || col < 0 || col >= this.rightCol) throw new Error(`Invalid cell in range: ${rangeRef}`);
            const value = this.getCellText(row, col);
            // If the cell value is a formula (starts with '='), evaluate it recursively
            if (typeof value === 'string' && value.startsWith('=')) values.push(this.evaluateExpression(value, [
                row,
                col
            ]));
            else values.push(typeof value === 'number' ? value : parseFloat(value) || 0);
        }
        return values;
    }
    // Parse a cell reference (e.g., A1 => { row: 0, col: 0 })
    parseCellReference(cellRef) {
        const colLetter = cellRef.match(/[A-Za-z]+/)?.[0];
        const rowNumber = cellRef.match(/\d+/)?.[0];
        if (!colLetter || !rowNumber) throw new Error(`Invalid cell reference: ${cellRef}`);
        const col = colLetter.split('').reduce((acc, char)=>acc * 26 + (char.toUpperCase().charCodeAt(0) - 64), 0) - 1;
        const row = parseInt(rowNumber, 10) - 1;
        return {
            row,
            col
        };
    }
    static parseCellReference(cellRef) {
        const colLetter = cellRef.match(/[A-Za-z]+/)?.[0];
        const rowNumber = cellRef.match(/\d+/)?.[0];
        if (!colLetter || !rowNumber) throw new Error(`Invalid cell reference: ${cellRef}`);
        const col = colLetter.split('').reduce((acc, char)=>acc * 26 + (char.toUpperCase().charCodeAt(0) - 64), 0) - 1;
        const row = parseInt(rowNumber, 10) - 1;
        return {
            row,
            col
        };
    }
    getAst(expression) {
        if (expression.startsWith('=')) {
            const tokens = this.tokenize(expression);
            return this.parse(tokens);
        }
        return null;
    }
    // Main function to parse and evaluate an expression
    evaluateExpression(expression, source) {
        if (typeof expression !== 'string') return expression; // Return non-string values as-is
        // If the expression starts with '=', parse and evaluate it
        if (expression.startsWith('=')) {
            const tokens = this.tokenize(expression);
            const ast = this.parse(tokens);
            return this.evaluate(ast, source);
        }
        // If the expression does not start with '=', treat it as a literal value
        return parseFloat(expression) || expression;
    }
}
exports.default = ExpressionParser;

},{"./financial/FinData":"2GTvl","./dependencytracker":"91xLf","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"2GTvl":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class FinData {
    constructor(){
        if (FinData._instance) return FinData._instance;
        FinData._instance = this;
        this._data = {};
    }
    store(namespace, key, value) {
        if (!this._data[namespace]) this._data[namespace] = {};
        this._data[namespace][key] = value;
    }
    get(namespace, key) {
        if (!this._data[namespace]) return null;
        if (!Object.hasOwn(this._data[namespace], key)) return null;
        return this._data[namespace][key];
    }
}
exports.default = FinData;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"91xLf":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "dependencyTree", ()=>dependencyTree);
parcelHelpers.export(exports, "reverseDependencyTree", ()=>reverseDependencyTree);
parcelHelpers.export(exports, "tickerReg", ()=>tickerReg);
parcelHelpers.export(exports, "shiftDependenciesUp", ()=>shiftDependenciesUp);
parcelHelpers.export(exports, "shiftDependenciesDown", ()=>shiftDependenciesDown);
parcelHelpers.export(exports, "shiftDependenciesRight", ()=>shiftDependenciesRight);
parcelHelpers.export(exports, "shiftDependenciesLeft", ()=>shiftDependenciesLeft);
parcelHelpers.export(exports, "removeDependents", ()=>removeDependents);
parcelHelpers.export(exports, "getDependencies", ()=>getDependencies);
parcelHelpers.export(exports, "removeDependencies", ()=>removeDependencies);
const dependencyTree = {};
const reverseDependencyTree = {};
const tickerReg = {};
function isEmpty(obj) {
    for(let i in obj){
        if (Object.hasOwn(obj, i)) return false;
    }
    return true;
}
function shiftDependenciesUp(pivotRow) {
    const cellsToUpdate = [];
    function helper(tree, depth = 0, didShift = false) {
        const newDeps = {};
        if (depth === 2) for(let row in tree){
            let tmp = tree[row];
            if (row > pivotRow) {
                newDeps[parseInt(row) - 1] = tree[row];
                delete tree[row];
            }
            if (didShift) for(let col in tmp)cellsToUpdate.push([
                row,
                col
            ]);
        }
        else if (depth === 0) for(let row in tree){
            if (row == pivotRow) {
                helper(tree[row], 1, true);
                delete tree[row];
            } else if (row > pivotRow) {
                newDeps[parseInt(row) - 1] = helper(tree[row], 1, true);
                delete tree[row];
            } else helper(tree[row], 1);
        }
        else if (depth === 1) for(let col in tree)helper(tree[col], 2, didShift);
        for(let rowOrCol in newDeps)tree[rowOrCol] = newDeps[rowOrCol];
        return tree;
    }
    helper(dependencyTree);
    return cellsToUpdate;
}
function shiftDependenciesDown(pivotRow) {
    const cellsToUpdate = [];
    function helper(tree, depth = 0, didShift = false) {
        const newDeps = {};
        if (depth === 2) for(let row in tree){
            let tmp = tree[row];
            if (row >= pivotRow) {
                newDeps[parseInt(row) + 1] = tree[row];
                delete tree[row];
            }
            if (didShift) for(let col in tmp)cellsToUpdate.push([
                row,
                col
            ]);
        }
        else if (depth === 0) {
            for(let row in tree)if (row >= pivotRow) {
                newDeps[parseInt(row) + 1] = helper(tree[row], 1, true);
                delete tree[row];
            } else helper(tree[row], 1);
        } else if (depth === 1) for(let col in tree)helper(tree[col], 2, didShift);
        for(let rowOrCol in newDeps)tree[rowOrCol] = newDeps[rowOrCol];
        return tree;
    }
    helper(dependencyTree);
    return cellsToUpdate;
}
function shiftDependenciesRight(pivotCol) {
    const cellsToUpdate = [];
    function helper(tree, depth = 0, didshift, _row) {
        const newDeps = {};
        if (depth === 0 || depth === 2) for(let row in tree)helper(tree[row], depth + 1, didshift, row);
        else if (depth === 1) {
            for(let col in tree)if (col >= pivotCol) {
                newDeps[parseInt(col) + 1] = helper(tree[col], 2, true, null);
                delete tree[col];
            } else helper(tree[col], 2);
        } else if (depth === 3) for(let col in tree){
            if (col >= pivotCol) {
                newDeps[parseInt(col) + 1] = true;
                delete tree[col];
            }
            if (didshift) cellsToUpdate.push([
                _row,
                col
            ]);
        }
        for(let rowOrCol in newDeps)tree[rowOrCol] = newDeps[rowOrCol];
        return tree;
    }
    helper(dependencyTree);
    return cellsToUpdate;
}
function shiftDependenciesLeft(pivotCol) {
    const cellsToUpdate = [];
    function helper(tree, depth = 0, didshift, _row) {
        const newDeps = {};
        if (depth === 0 || depth === 2) for(let row in tree)helper(tree[row], depth + 1, didshift, row);
        else if (depth === 1) for(let col in tree){
            if (col == pivotCol) {
                helper(tree[col], 2, true);
                delete tree[col];
            } else if (col >= pivotCol) {
                newDeps[parseInt(col) - 1] = helper(tree[col], 2, true, null);
                delete tree[col];
            } else helper(tree[col], 2);
        }
        else if (depth === 3) for(let col in tree){
            if (col >= pivotCol) {
                newDeps[parseInt(col) - 1] = true;
                delete tree[col];
            }
            if (didshift) cellsToUpdate.push([
                _row,
                col
            ]);
        }
        for(let rowOrCol in newDeps)tree[rowOrCol] = newDeps[rowOrCol];
        return tree;
    }
    helper(dependencyTree);
    return cellsToUpdate;
}
function removeDependents(deptRow, deptCol) {
    const dependencies = getDependencies(deptRow, deptCol);
    for (const [drow, dcol] of dependencies){
        const dcell = dependencyTree[drow]?.[dcol];
        if (!dcell) continue;
        if (dcell[deptRow]?.[deptCol]) {
            delete dcell[deptRow][deptCol];
            if (isEmpty(dcell[deptRow])) delete dcell[deptRow];
        }
    }
    removeDependencies(deptRow, deptCol);
}
function getDependencies(row, col) {
    const deps = [];
    const t = reverseDependencyTree;
    const cell = t[row]?.[col];
    if (!cell) return [];
    for(let drow in cell)for(let dcol in cell[drow])deps.push([
        drow,
        dcol
    ]);
    return deps;
}
function removeDependencies(row, col) {
    const t = reverseDependencyTree;
    if (!t[row]?.[col]) return;
    delete t[row][col];
    if (isEmpty(t[row])) delete t[row];
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"7E84C":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "launchFormatMenu", ()=>launchFormatMenu);
function launchFormatMenu() {
    const formatWindow = window.open('', 'target=_blank', 'width=190,height=400');
    formatWindow.document.body.innerHTML = `
        <style>
            .format-menu {
                font-family: Arial, sans-serif;
                width: 220px;
                padding: 12px;
                background: #f8f8f8;
                border: 1px solid #999999;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .menu-section {
                margin-bottom: 12px;
            }
            .menu-title {
                font-weight: bold;
                margin-bottom: 6px;
                color: #555;
                font-size: 13px;
            }
            select, input {
                width: 100%;
                padding: 6px;
                border: 1px solid #ccc;
                border-radius: 3px;
                margin-bottom: 8px;
            }
            .color-options {
                display: flex;
                gap: 4px;
                margin-top: 6px;
            }
            .color-option {
                width: 20px;
                height: 20px;
                border-radius: 3px;
                cursor: pointer;
                border: 1px solid #999999;
            }
            .format-btn {
                flex: 1;
                padding: 6px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 3px;
                cursor: pointer;
                text-align: center;
                font-size: 12px;
            }
            .format-btn:hover {
                background: #f0f0f0;
            }
            .format-btn.active {
                background: #999999;
                border-color: #999;
            }
            .color-option:hover {
                border-color: #999;
            }
            .alignment-options,.border-options {
                display: flex;
                gap: 4px;
            }
            .alignment-btn,.border-btn {
                flex: 1;
                padding: 6px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 3px;
                cursor: pointer;
                text-align: center;
            }
            .alignment-btn:hover,.border-btn:hover {
                background: #f0f0f0;
            }
            .alignment-btn.active,.border-btn.active {
                background: #999999;
                border-color: #999;
            }
            .baseline-visual {
                display: inline-block;
                width: 100%;
                height: 40px;
                position: relative;
                margin-top: 8px;
                border: 1px solid #eee;
                background: repeating-linear-gradient(
                    to bottom,
                    #f8f8f8,
                    #f8f8f8 1px,
                    #fff 1px,
                    #fff 10px
                );
            }
            .baseline-line {
                position: absolute;
                left: 0;
                right: 0;
                height: 1px;
                background-color: red;
            }
            .baseline-text {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                white-space: nowrap;
            }
        </style>
        <div class="format-menu">
            <div class="menu-section">
                <div class="menu-title">Cell Type</div>
                <select id="cellType">
                    <option value="text" selected>Text</option>
                    <option value="button">Button</option>
                    <option value="linechart">Line Chart</option>
                </select>
            </div>
            <div class="menu-section">
                <div class="menu-title">Font Size</div>
                <select id="fontSize">
                    <option value="8">8</option>
                    <option value="10" selected>10</option>
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                    <option value="20">20</option>
                    <option value="24">24</option>
                </select>
            </div>
            <div class="menu-section">
                <div class="menu-title">Font Color</div>
                <input type="color" id="fontColor" value="#000000">
                <div class="color-options">
                    <div class="color-option" style="background: #000000;" data-color="#000000"></div>
                    <div class="color-option" style="background: #ff0000;" data-color="#ff0000"></div>
                    <div class="color-option" style="background: #00aa00;" data-color="#00aa00"></div>
                    <div class="color-option" style="background: #0000ff;" data-color="#0000ff"></div>
                    <div class="color-option" style="background: #ff9900;" data-color="#ff9900"></div>
                </div>
            </div>
            <div class="menu-section">
                <div class="menu-title">Text Alignment</div>
                <div class="alignment-options">
                    <div class="alignment-btn" data-align="left" title="Align Left">\u{23A1}</div>
                    <div class="alignment-btn" data-align="center" title="Align Center">\u{23A2}</div>
                    <div class="alignment-btn" data-align="right" title="Align Right">\u{23A3}</div>
                </div>
            </div>
            <div class="menu-section">
                <div class="menu-title">Borders</div>
                <div class="border-options">
                    <div class="border-btn" data-border="${2}" title="Border Left">Left</div>
                    <div class="border-btn" data-border="${4}" title="Border Top">Top</div>
                    <div class="border-btn" data-border="${8}" title="Border Right">Right</div>
                    <div class="border-btn" data-border="${16}" title="Border Bottom">Bottom</div>
                </div>
            </div>
            <div class="menu-section">
            <div class="menu-title">Text Baseline</div>
                <div class="option-group">
                    <div class="format-btn" data-baseline="alphabetic" title="Alphabetic">A</div>
                    <div class="format-btn" data-baseline="top" title="Top">Top</div>
                    <div class="format-btn" data-baseline="middle" title="Middle">Mid</div>
                    <div class="format-btn" data-baseline="bottom" title="Bottom">Bot</div>
                </div>
                <div class="baseline-visual" id="baselineDemo">
                    <div class="baseline-line" id="baselineIndicator"></div>
                    <div class="baseline-text" id="baselineText">Text</div>
                </div>
            </div>
        </div>
    `;
    const cbs = [];
    function onChange(type, value) {
        for (let cb of cbs)cb(type, value);
    }
    formatWindow.document.title = 'Format Menu';
    formatWindow.document.getElementById('fontSize').addEventListener('change', function() {
        onChange('fontSize', this.value);
    });
    formatWindow.document.getElementById('cellType').addEventListener('change', function() {
        onChange('cellType', this.value);
    });
    formatWindow.document.getElementById('fontColor').addEventListener('input', function() {
        onChange('color', this.value);
    });
    // Quick color options
    formatWindow.document.querySelectorAll('.color-option').forEach((option)=>{
        option.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            formatWindow.document.getElementById('fontColor').value = color;
            onChange('color', color);
        });
    });
    // Alignment buttons
    formatWindow.document.querySelectorAll('.alignment-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            formatWindow.document.querySelectorAll('.alignment-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            // Add active class to clicked button
            this.classList.add('active');
            const alignment = this.getAttribute('data-align');
            onChange('textAlign', alignment);
        });
    });
    // Border buttons
    formatWindow.document.querySelectorAll('.border-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            let border = 0;
            formatWindow.document.querySelectorAll('.border-btn.active').forEach(function(b) {
                const databorder = b.getAttribute('data-border');
                border |= databorder;
            });
            // Remove active class from all buttons
            // const border = this.getAttribute('data-border');
            onChange('border', border);
        });
    });
    // Baseline buttons
    formatWindow.document.querySelectorAll('[data-baseline]').forEach(function(btn) {
        // Update baseline visual demonstration
        const baselineOptions = {
            'alphabetic': {
                position: 30,
                description: 'Normal text baseline'
            },
            'top': {
                position: 5,
                description: 'Top of the em square'
            },
            'middle': {
                position: 20,
                description: 'Middle of the em square'
            },
            'bottom': {
                position: 35,
                description: 'Bottom of the em square'
            },
            'hanging': {
                position: 5,
                description: 'Hanging baseline (like Hindi)'
            },
            'ideographic': {
                position: 35,
                description: 'Ideographic baseline (like CJK)'
            }
        };
        function updateBaselineVisual(baseline) {
            const demo = formatWindow.document.getElementById('baselineDemo');
            const indicator = formatWindow.document.getElementById('baselineIndicator');
            const text = formatWindow.document.getElementById('baselineText');
            if (baselineOptions[baseline]) {
                const pos = baselineOptions[baseline].position;
                indicator.style.top = `${pos}px`;
                text.style.top = `${pos}px`;
                text.textContent = baseline;
            }
        }
        btn.addEventListener('click', function() {
            formatWindow.document.querySelectorAll('[data-baseline]').forEach((b)=>b.classList.remove('active'));
            this.classList.add('active');
            const baseline = this.getAttribute('data-baseline');
            updateBaselineVisual(baseline);
            onChange('textBaseline', baseline);
        });
    });
    return {
        win: formatWindow,
        addListener: (fn)=>cbs.push(fn)
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"5HFoS":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "createLineChart", ()=>createLineChart);
function createLineChart(data, container, width, height) {
    console.log('createlinecahrt?');
    function render(data, width, height) {
        container.innerHTML = '';
        container.innerHTML = `
                    <div class="chart-container">
                        <div class="chart"></div>
                    </div>
                    <div class="tooltip"></div>
                `;
        const chart = container.querySelector('.chart');
        const tooltip = container.querySelector('.tooltip');
        const parsedData = data.map((item)=>({
                value: parseFloat(item[0]),
                date: item[1]
            }));
        // Get dimensions
        // const width = chart.offsetWidth;
        // const height = chart.offsetHeight;
        const margin = {
            top: 20,
            right: 50,
            bottom: 50,
            left: 50
        };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        // Create SVG
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        svg.style.overflow = 'visible';
        chart.appendChild(svg);
        // Create chart group
        const chartGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        chartGroup.setAttribute("transform", `translate(${margin.left}, ${margin.top})`);
        svg.appendChild(chartGroup);
        // Calculate scales
        const xScale = (date, index)=>{
            const totalPoints = parsedData.length;
            // Add slight padding to the sides
            const padding = 0.02 * chartWidth;
            return padding + index / (totalPoints - 1) * (chartWidth - 2 * padding);
        };
        const maxValue = Math.max(...parsedData.map((d)=>d.value));
        const yScale = (value)=>{
            return chartHeight - value / maxValue * chartHeight;
        };
        // Create line
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        let pathData = "M";
        parsedData.forEach((d, i)=>{
            const x = xScale(d.date, i);
            const y = yScale(d.value);
            pathData += `${x},${y} `;
            if (i < parsedData.length - 1) pathData += "L";
            // Add points
            const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            point.setAttribute("class", "point");
            point.setAttribute("cx", x);
            point.setAttribute("cy", y);
            point.setAttribute("r", 4);
            point.setAttribute("data-value", d.value);
            point.setAttribute("data-date", d.date);
            // Add hover events
            point.addEventListener('mouseover', (e)=>{
                tooltip.style.display = 'block';
                tooltip.innerHTML = `Date: ${d.date}<br>Value: ${d.value}`;
                tooltip.style.left = e.pageX + 10 + 'px';
                tooltip.style.top = e.pageY - 10 + 'px';
            });
            point.addEventListener('mouseout', ()=>{
                tooltip.style.display = 'none';
            });
            chartGroup.appendChild(point);
        });
        path.setAttribute("class", "line");
        path.setAttribute("d", pathData);
        chartGroup.appendChild(path);
        // Add x-axis labels (dates)
        const labelPadding = 5; // Additional padding for labels
        parsedData.forEach((d, i)=>{
            if (i % Math.ceil(parsedData.length / 5) === 0 || i === parsedData.length - 1) {
                const xPos = xScale(d.date, i);
                // Only draw label if it fits within bounds
                if (xPos >= 0 && xPos <= chartWidth) {
                    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    label.setAttribute("class", "x-axis");
                    label.setAttribute("x", xPos);
                    label.setAttribute("y", chartHeight + 20);
                    label.setAttribute("text-anchor", "middle");
                    // Shorten date format if needed
                    const labelText = d.date.length > 10 ? d.date.substring(5) : d.date;
                    label.textContent = labelText;
                    // Check if label would extend beyond right edge
                    const textLength = labelText.length * 6; // Approximate width
                    if (xPos + textLength / 2 > chartWidth) {
                        label.setAttribute("text-anchor", "end");
                        label.setAttribute("x", chartWidth - labelPadding);
                    } else if (xPos - textLength / 2 < 0) {
                        label.setAttribute("text-anchor", "start");
                        label.setAttribute("x", labelPadding);
                    }
                    chartGroup.appendChild(label);
                }
            }
        });
        // Add y-axis labels (values)
        for(let i = 0; i <= 5; i++){
            const value = maxValue / 5 * i;
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("class", "y-axis");
            label.setAttribute("x", -10);
            label.setAttribute("y", yScale(value));
            label.setAttribute("text-anchor", "end");
            label.setAttribute("dy", "0.35em");
            label.textContent = value.toFixed(1);
            chartGroup.appendChild(label);
            // Add grid line
            const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            gridLine.setAttribute("x1", 0);
            gridLine.setAttribute("y1", yScale(value));
            gridLine.setAttribute("x2", chartWidth);
            gridLine.setAttribute("y2", yScale(value));
            gridLine.setAttribute("stroke", "#eee");
            gridLine.setAttribute("stroke-dasharray", "2,2");
            chartGroup.insertBefore(gridLine, chartGroup.firstChild);
        }
        // Add axis titles
        const xAxisTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
        xAxisTitle.setAttribute("class", "x-axis");
        xAxisTitle.setAttribute("x", chartWidth / 2);
        xAxisTitle.setAttribute("y", chartHeight + 40);
        xAxisTitle.setAttribute("text-anchor", "middle");
        xAxisTitle.textContent = "Date";
        chartGroup.appendChild(xAxisTitle);
        const yAxisTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
        yAxisTitle.setAttribute("class", "y-axis");
        yAxisTitle.setAttribute("transform", "rotate(-90)");
        yAxisTitle.setAttribute("x", -chartHeight / 2);
        yAxisTitle.setAttribute("y", -40); // Adjusted to not overlap with labels
        yAxisTitle.setAttribute("text-anchor", "middle");
        yAxisTitle.textContent = "Value";
        chartGroup.appendChild(yAxisTitle);
    }
    function update() {
        container.innerHTML = '';
    }
    function destroy() {
        container.innerHTML = '';
    }
    render(data, width, height);
    return {
        container,
        update,
        destroy,
        render
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"kDraw":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _ya = require("./ya");
var _yaDefault = parcelHelpers.interopDefault(_ya);
class FinancialSubscriber {
    constructor(){
        if (FinancialSubscriber._instance) return FinancialSubscriber._instance;
        FinancialSubscriber._instance = this;
        this.ya = new (0, _yaDefault.default)();
        this.tickListeners = [];
        this.ya.addListener((data)=>{
            for (let listener of this.tickListeners)listener(data);
        });
    }
    listenYA(tickers) {
        this.ya.addSubs(tickers);
    }
    onTick(fn) {
        this.tickListeners.push(fn);
    }
}
exports.default = FinancialSubscriber;

},{"./ya":"jFFNX","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"jFFNX":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _finData = require("./FinData");
var _finDataDefault = parcelHelpers.interopDefault(_finData);
class YA {
    constructor(){
        this.onmessage = (event)=>{
            try {
                const messageData = event.data;
                const data = this.Yaticker?.decode(new Uint8Array(atob(messageData).split("").map((c)=>c.charCodeAt(0))));
                if (data.id.startsWith('^')) {
                    data._id = data.id;
                    data.id = data.id.slice(1);
                }
                this.data.store('YA', data.id, data);
                console.log('tick data:', data);
                this.updateListeners(data);
            } catch (e) {
                console.log(e);
            }
        };
        this.tickers = new Set();
        this.connection = null;
        this.data = new (0, _finDataDefault.default)();
        this.isOpen = false;
        this.root = protobuf.Root.fromJSON(require("e2539344a5bfbd0"));
        this.Yaticker = this.root?.lookupType("yaticker");
        this.cbs = [];
    // setInterval(() => {
    //     const dummydata = { id: 'GME', price: Math.random() * 100 };
    //     this.data.store('YA', dummydata.id, dummydata);
    //     this.updateListeners(dummydata)
    // }, 1000)
    }
    /**
     * @returns something like '{"subscribe":["API","^GSPC","^DJI","^IXIC","^RUT","CL=F","GC=F","NVDA","GME","RKT","GAP","BLD","IBP"]}'
     */ getSubString() {
        return JSON.stringify({
            subscribe: [
                ...this.tickers
            ]
        });
    }
    hasSubs() {
        return this.tickers.size > 0;
    }
    addListener(cb) {
        this.cbs.push(cb);
    }
    updateSubs() {
        if (this.connection) {
            if (this.hasSubs()) this.connection.send(this.getSubString());
        } else {
            this.connection = new WebSocket(atob("d3NzOi8vc3RyZWFtZXIuZmluYW5jZS55YWhvby5jb20v"));
            this.connection.onopen = ()=>{
                this.isOpen = true;
                if (this.hasSubs()) this.connection.send(this.getSubString());
            };
            this.connection.onmessage = this.onmessage;
        }
        return this.connection;
    }
    updateListeners(data) {
        for (let cb of this.cbs)cb(data);
    }
    async fetchTicker(symbol) {}
    addSubs(subs) {
        for (let symbol of subs){
            if (!this.tickers.has(symbol)) this.fetchTicker(symbol);
            this.tickers.add(symbol);
        }
        if (this.hasSubs()) this.updateSubs();
    }
}
exports.default = YA;

},{"./FinData":"2GTvl","e2539344a5bfbd0":"7dZXa","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"7dZXa":[function(require,module,exports,__globalThis) {
module.exports = JSON.parse("{\"options\":{\"syntax\":\"proto3\"},\"nested\":{\"yaticker\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"price\":{\"type\":\"float\",\"id\":2},\"time\":{\"type\":\"sint64\",\"id\":3},\"currency\":{\"type\":\"string\",\"id\":4},\"exchange\":{\"type\":\"string\",\"id\":5},\"quoteType\":{\"type\":\"QuoteType\",\"id\":6},\"marketHours\":{\"type\":\"MarketHoursType\",\"id\":7},\"changePercent\":{\"type\":\"float\",\"id\":8},\"dayVolume\":{\"type\":\"sint64\",\"id\":9},\"dayHigh\":{\"type\":\"float\",\"id\":10},\"dayLow\":{\"type\":\"float\",\"id\":11},\"change\":{\"type\":\"float\",\"id\":12},\"shortName\":{\"type\":\"string\",\"id\":13},\"expireDate\":{\"type\":\"sint64\",\"id\":14},\"openPrice\":{\"type\":\"float\",\"id\":15},\"previousClose\":{\"type\":\"float\",\"id\":16},\"strikePrice\":{\"type\":\"float\",\"id\":17},\"underlyingSymbol\":{\"type\":\"string\",\"id\":18},\"openInterest\":{\"type\":\"sint64\",\"id\":19},\"optionsType\":{\"type\":\"OptionType\",\"id\":20},\"miniOption\":{\"type\":\"sint64\",\"id\":21},\"lastSize\":{\"type\":\"sint64\",\"id\":22},\"bid\":{\"type\":\"float\",\"id\":23},\"bidSize\":{\"type\":\"sint64\",\"id\":24},\"ask\":{\"type\":\"float\",\"id\":25},\"askSize\":{\"type\":\"sint64\",\"id\":26},\"priceHint\":{\"type\":\"sint64\",\"id\":27},\"vol_24hr\":{\"type\":\"sint64\",\"id\":28},\"volAllCurrencies\":{\"type\":\"sint64\",\"id\":29},\"fromcurrency\":{\"type\":\"string\",\"id\":30},\"lastMarket\":{\"type\":\"string\",\"id\":31},\"circulatingSupply\":{\"type\":\"double\",\"id\":32},\"marketcap\":{\"type\":\"double\",\"id\":33}},\"nested\":{\"QuoteType\":{\"values\":{\"NONE\":0,\"ALTSYMBOL\":5,\"HEARTBEAT\":7,\"EQUITY\":8,\"INDEX\":9,\"MUTUALFUND\":11,\"MONEYMARKET\":12,\"OPTION\":13,\"CURRENCY\":14,\"WARRANT\":15,\"BOND\":17,\"FUTURE\":18,\"ETF\":20,\"COMMODITY\":23,\"ECNQUOTE\":28,\"CRYPTOCURRENCY\":41,\"INDICATOR\":42,\"INDUSTRY\":1000}},\"OptionType\":{\"values\":{\"CALL\":0,\"PUT\":1}},\"MarketHoursType\":{\"values\":{\"PRE_MARKET\":0,\"REGULAR_MARKET\":1,\"POST_MARKET\":2,\"EXTENDED_HOURS_MARKET\":3}}}}}}");

},{}],"8uhD9":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "borderLeft", ()=>borderLeft);
parcelHelpers.export(exports, "borderTop", ()=>borderTop);
parcelHelpers.export(exports, "borderRight", ()=>borderRight);
parcelHelpers.export(exports, "borderBottom", ()=>borderBottom);
parcelHelpers.export(exports, "addBorder", ()=>addBorder);
parcelHelpers.export(exports, "removeBorder", ()=>removeBorder);
parcelHelpers.export(exports, "hasBorder", ()=>hasBorder);
parcelHelpers.export(exports, "hasBorderStr", ()=>hasBorderStr);
parcelHelpers.export(exports, "mkel", ()=>mkel);
const borderLeft = 2;
const borderTop = 4;
const borderRight = 8;
const borderBottom = 16;
function addBorder(curBorder, border) {
    if (!curBorder) return border;
    return curBorder | border;
}
function removeBorder(curBorder, border) {
    if (!curBorder) return 0;
    return border ^ curBorder;
}
function hasBorder(curBorder, border) {
    if (!curBorder) return false;
    return border === (border & curBorder);
}
function hasBorderStr(curBorder, borderStr) {
    if (!curBorder) return false;
    let border;
    if (borderStr === 'left') border = borderLeft;
    else if (borderStr === 'top') border = borderTop;
    else if (borderStr === 'right') border = borderRight;
    else if (borderStr === 'bottom') border = borderBottom;
    else return 0;
    return border === (border & curBorder);
}
function mkel(tag = 'div', className = '', children) {
    const el = document.createElement(tag);
    el.className = className;
    if (children) el.innerHTML = children;
    return el;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"j0IU6":[function(require,module,exports,__globalThis) {
// @ts-ignore
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "shiftTextRefs", ()=>shiftTextRefs);
var _expressionparser = require("packages/expressionparser");
var _expressionparserDefault = parcelHelpers.interopDefault(_expressionparser);
function rowColToRef(row, col) {
    // Validate inputs
    if (row < 0 || col < 0 || !Number.isInteger(row) || !Number.isInteger(col)) return '';
    // Convert column index to letters (0 = A, 1 = B, ..., 25 = Z, 26 = AA, etc.)
    let colLetters = '';
    let remaining = col + 1; // Convert to 1-based for calculation
    while(remaining > 0){
        const remainder = (remaining - 1) % 26;
        colLetters = String.fromCharCode(65 + remainder) + colLetters;
        remaining = Math.floor((remaining - 1) / 26);
    }
    // Convert row index to 1-based number
    const rowNumber = row + 1;
    return colLetters + rowNumber;
}
function shiftTextRefs(text, dir) {
    const deltas = {
        up: [
            -1,
            0
        ],
        down: [
            1,
            0
        ],
        left: [
            0,
            -1
        ],
        right: [
            0,
            1
        ]
    };
    const delta = deltas[dir];
    text = text.slice(1); // strip =
    const tokens = (0, _expressionparserDefault.default).tokenizeWithIndex(text);
    tokens.reverse();
    let str = '=';
    for(let i = 0; i < text.length; i++){
        while(tokens.length > 0 && !/^[A-Za-z]+\d+$/.test(tokens[tokens.length - 1][0]))tokens.pop();
        const [token, indexes] = tokens[tokens.length - 1] || [
            '',
            []
        ];
        if (i === indexes[0]) {
            const cell = (0, _expressionparserDefault.default).parseCellReference(token);
            const newRef = rowColToRef(cell.row + delta[0], cell.col + delta[1]);
            if (!newRef) str += 'REFERROR';
            else str += newRef;
            tokens.pop();
            i = indexes[1] - 1;
        } else str += text[i];
    }
    return str;
}

},{"packages/expressionparser":"8OaEa","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"6k5Dl":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "header", ()=>header);
const header = `
<style>
    .header-bar {
        font-family: Arial, sans-serif;
        background-color: #f3f3f3;
        padding: 5px;
        border-bottom: 1px solid #d4d4d4;
        display: flex;
        flex-wrap: wrap;
        z-index: 300;
    }

    .tab-group {
        display: flex;
        margin-right: 15px;
    }

    .button-group {
        display: flex;
        border-right: 1px solid #d4d4d4;
        padding: 3px 10px 3px 3px;
        align-items: center;
    }

    .button {
        background: none;
        border: none;
        padding: 5px 8px;
        margin: 0 2px;
        cursor: pointer;
        border-radius: 3px;
    }

    .button:hover {
        background-color: #e0e0e0;
    }

    .button img {
        width: 16px;
        height: 16px;
    }

    .separator {
        width: 1px;
        background-color: #d4d4d4;
        margin: 0 5px;
        height: 30px;
    }

    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 130px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
        font-size: 14px;
        border: 1px solid #d4d4d4;
    }
    .dropdown-content > div {
        border-bottom: 1px solid #d4d4d4;
        padding: 2px;
        cursor: pointer;
    }

    .dropdown-content > div:last-child {
        border-bottom: none;
    }

    .dropdown:hover .dropdown-content {
        display: block;
        z-index: 300;
    }
</style>
<div class="header-bar">
    <!-- Clipboard Group -->
    <div class="button-group quick-text-actions-buttons">
        <button class="button" data-action="paste" title="Paste">\u{1F4CB}</button>
        <button class="button" data-action="cut" title="Cut">\u{2702}\u{FE0F}</button>
        <button class="button" data-action="copy" title="Copy">\u{1F4C4}</button>
        <div class="separator"></div>
        <div class="dropdown">
            <button id="format-button" class="button format-button" title="Format Painter">\u{1F58C}\u{FE0F}</button>
        </div>
    </div>

    <!-- Font Group -->
    <div class="button-group">
        <div class="dropdown">
            <button class="button" title="Font">Arial \u{25BC}</button>
            <div class="dropdown-content">
                <div>Arial</div>
                <div>Calibri</div>
                <div>Times New Roman</div>
            </div>
        </div>
        <div class="dropdown">
            <button class="button" title="Font Size">11 \u{25BC}</button>
        </div>
        <button class="button" title="Bold">B</button>
        <button class="button" title="Italic">I</button>
        <button class="button" title="Underline">U</button>
        <div class="separator"></div>
        <button class="button" title="Border">\u{29C9}</button>
        <div class="dropdown">
            <button class="button" title="Fill Color">\u{25A3}</button>
        </div>
        <div class="dropdown">
            <button class="button" title="Font Color">A</button>
        </div>
    </div>

    <!-- Alignment Group -->
    <div class="button-group align-button-group">
        <button class="button" data-align="left" title="Align Left">\u{2261}</button>
        <button class="button" data-align="center" title="Align Center">\u{2261}</button>
        <button class="button" data-align="right" title="Align Right">\u{2261}</button>
        <div class="separator"></div>
        <button class="button merge-button" title="Merge & Center" id="merge-button">\u{29C9} M</button>
    </div>

    <!-- Editing Group -->
    <div class="button-group">
        <div class="dropdown">
            <button class="button" title="Insert">\u{2295} Insert</button>
        </div>
        <div class="dropdown">
            <button class="button" title="Delete">\u{2296} Delete</button>
        </div>
        <div class="separator"></div>
        <div class="dropdown">
            <button class="button" title="Conditional Formatting">\u{2630} Format</button>
        </div>
    </div>
</div>
`;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"gI5GS":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
const menuItems = [
    {
        key: 'copy',
        title: 'Copy',
        label: 'Ctrl+C'
    },
    {
        key: 'cut',
        title: 'Cut',
        label: 'Ctrl+X'
    },
    {
        key: 'paste',
        title: 'Paste',
        label: 'Ctrl+V'
    },
    {
        key: 'paste-value',
        title: 'Paste values only',
        label: 'Ctrl+Shift+V'
    },
    {
        key: 'paste-format',
        title: 'Paste format only',
        label: 'Ctrl+Alt+V'
    },
    {
        key: 'divider'
    },
    {
        key: 'insert-row',
        title: 'Insert row'
    },
    {
        key: 'insert-column',
        title: 'Insert column'
    },
    {
        key: 'divider'
    },
    {
        key: 'merge',
        title: 'Merge'
    },
    {
        key: 'unmerge',
        title: 'Unmerge'
    },
    {
        key: 'divider'
    },
    {
        key: 'delete-row',
        title: 'Delete row'
    },
    {
        key: 'delete-column',
        title: 'Delete column'
    },
    {
        key: 'delete-cell-text',
        title: 'Delete cell text'
    },
    {
        key: 'clear',
        title: 'Clear Contents',
        label: ''
    },
    {
        key: 'divider'
    },
    {
        key: 'toggle-gridlines',
        title: 'Toggle Gridlines'
    }
];
function buildMenuItem(item) {
    if (item.key === 'divider') return (0, _utils.mkel)('div', `gigasheet-item divider`);
    const el = (0, _utils.mkel)('div', `gigasheet-item`, `
        ${item.title}
        <div class="label">${item.label || ''}</div>
    `);
    el.setAttribute('data-key', item.key);
    return el;
}
function buildMenu(menuItems) {
    return menuItems.map((it)=>buildMenuItem(it));
}
class ContextMenu {
    constructor(){
        this.menuItems = buildMenu(menuItems);
        this.container = (0, _utils.mkel)('div', 'gigasheet-contextmenu');
        this.container.oncontextmenu = (e)=>e.preventDefault();
        this.container.style.display = 'none';
        for (let child of this.menuItems)this.container.appendChild(child);
        this.container.onclick = (e)=>{
            if (e.target.hasAttribute('data-key')) {
                const action = e.target.getAttribute('data-key');
                if (this.clickCb) this.clickCb(action);
                this.hide();
            }
        };
    }
    onClick(fn) {
        this.clickCb = fn;
    }
    hide() {
        this.container.style.display = 'none';
    }
    setPosition(x, y, containerRect) {
        const { width, height } = containerRect;
        const ctxrect = this.container.getBoundingClientRect();
        const ctxwidth = ctxrect.width;
        const vhf = height / 2;
        let left = x;
        if (width - x <= ctxwidth) left -= ctxwidth;
        this.container.style.left = `${left}px`;
        if (y > vhf) {
            this.container.style.bottom = `${height - y}px`;
            this.container.style.maxHeight = `${y}px`;
            this.container.style.top = 'auto';
        } else {
            this.container.style.top = `${y}px`;
            this.container.style.maxHeight = `${height - y}px`;
            this.container.style.bottom = 'auto';
        }
        this.container.style.display = '';
    }
}
exports.default = ContextMenu;

},{"../utils":"8uhD9","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}]},["eZFTg","9Fk10"], "9Fk10", "parcelRequireedef", {})

//# sourceMappingURL=gigaspreadsheet.c9112ede.js.map
