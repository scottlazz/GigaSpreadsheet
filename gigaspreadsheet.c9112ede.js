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
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
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
// import Giga from "./giga";
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _sheet = require("./sheet");
var _sheetDefault = parcelHelpers.interopDefault(_sheet);
var _styleCss = require("./style.css");
document.addEventListener("DOMContentLoaded", (event)=>{
    const wrapper = document.getElementById('grid-wrapper');
    const cells = [];
    const sheet = new (0, _sheetDefault.default)(wrapper, Object.assign(// fininit,
    {
    }, {
        cellHeaders: true,
        autosize: true
    }));
});

},{"./sheet":"cIFaS","./style.css":"bhJkM","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"cIFaS":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _sparsegrid = require("../packages/sparsegrid");
var _sparsegridDefault = parcelHelpers.interopDefault(_sparsegrid);
var _expressionparser = require("../packages/expressionparser");
var _expressionparserDefault = parcelHelpers.interopDefault(_expressionparser);
var _format = require("./windows/format");
var _linechart = require("./graphs/linechart");
// import FinancialSubscriber from '../packages/financial/index';
var _dependencytracker = require("../packages/dependencytracker");
var _utils = require("./utils");
var _shiftops = require("./shiftops");
var _contextmenu = require("./components/contextmenu");
var _contextmenuDefault = parcelHelpers.interopDefault(_contextmenu);
var _formulaBar = require("./components/formulaBar");
var _toolbar = require("./components/toolbar");
var _scrollIntoView = require("../packages/scrollIntoView");
var _scrollIntoViewDefault = parcelHelpers.interopDefault(_scrollIntoView);
var _copypaste = require("./copypaste");
var _block = require("./components/block");
var _history = require("./history");
var _historyDefault = parcelHelpers.interopDefault(_history);
var _keyboardHandler = require("./keyboardHandler");
var _keyboardHandlerDefault = parcelHelpers.interopDefault(_keyboardHandler);
var _gridmetrics = require("./gridmetrics");
var _gridmetricsDefault = parcelHelpers.interopDefault(_gridmetrics);
var _rownumbers = require("./rownumbers");
var _rownumbersDefault = parcelHelpers.interopDefault(_rownumbers);
var _headeridentifiers = require("./headeridentifiers");
var _headeridentifiersDefault = parcelHelpers.interopDefault(_headeridentifiers);
class Sheet {
    constructor(wrapper, options = {}){
        this.subscribeEvent = (eventName, cb)=>{
            if (!this.events[eventName]) this.events[eventName] = [];
            this.events[eventName].push(cb);
        };
        this.emitEvent = (eventName, data)=>{
            const cbs = this.events[eventName] || [];
            for (let cb of cbs)cb(data);
        };
        this.hasEvent = (eventName)=>{
            return !!this.events[eventName];
        };
        this.getMerge = (row, col)=>{
            // Check if the cell is part of a merged range
            return this.mergedCells.find((merged)=>row >= merged.startRow && row <= merged.endRow && col >= merged.startCol && col <= merged.endCol);
        };
        this.immediateRenderAll = ()=>{
            for(let key in this.scheduledRenders){
                const [row, col, fromBlockRender] = this.scheduledRenders[key];
                this.immediateRenderCell(row, col, fromBlockRender);
                delete this.scheduledRenders[key];
            }
            for(let key in this.scheduledOffBlockRenders){
                const [row, col, fromBlockRender, block] = this.scheduledOffBlockRenders[key];
                this.immediateOffBlockRender(row, col, fromBlockRender, block);
                delete this.scheduledOffBlockRenders[key];
            }
            this.renderQueued = false;
        };
        this.immediateUpdateDims = ()=>{
            const ctx = this.measureCanvas.getContext('2d');
            let needsRerender = false;
            let colsNeedingRemax = {};
            for(let key in this.needDims){
                const [row, col] = this.needDims[key];
                const cell = this.getCell(row, col);
                const isCustomRender = cell.renderType === 'custom' && this.options.renderCustomCell;
                if (isCustomRender) {
                    delete this.needDims[key];
                    continue;
                }
                if (this.getMerge(row, col)) {
                    delete this.needDims[key];
                    continue;
                }
                if (cell.text && cell.text.length > 3) {
                    this.setTextCtx(ctx, row, col);
                    const m = ctx.measureText(cell.text);
                    const mwidth = m.width / (this.effectiveDevicePixelRatio() * this.zoomLevel) + 5;
                    if (this.maxWidthInCol[cell.col]) {
                        if (mwidth > this.maxWidthInCol[cell.col].max) {
                            this.maxWidthInCol[cell.col] = {
                                max: mwidth,
                                row: cell.row
                            };
                            needsRerender = true;
                        } else if (mwidth < this.maxWidthInCol[cell.col].max - 50 && // subtract some width so it doesnt resize too much
                        this.maxWidthInCol[cell.col].row === cell.row) {
                            this.maxWidthInCol[cell.col] = {
                                max: mwidth,
                                row: cell.row
                            };
                            needsRerender = true;
                            colsNeedingRemax[cell.col] = true;
                        }
                    } else if (mwidth > this.cellWidth) {
                        this.maxWidthInCol[cell.col] = {
                            max: mwidth,
                            row: cell.row
                        };
                        needsRerender = true;
                    }
                    cell._dims = {
                        width: mwidth
                    };
                } else {
                    if (this.maxWidthInCol[cell.col] && this.maxWidthInCol[cell.col].row === cell.row) {
                        this.maxWidthInCol[cell.col].max = 0;
                        needsRerender = true;
                        colsNeedingRemax[cell.col] = true;
                    }
                    cell._dims = {
                        width: 0
                    };
                }
                delete this.needDims[key];
            }
            for(let col in colsNeedingRemax){
                const cells = this.data.getCol(col);
                for(let key in cells){
                    const cell = cells[key];
                    if (!this.isNotMergedOver(cell.row, cell.col)) continue;
                    if (cell._dims) {
                        if (cell._dims.width > this.maxWidthInCol[cell.col].max) {
                            this.maxWidthInCol[cell.col].max = cell._dims.width;
                            this.maxWidthInCol[cell.col].row = cell.row;
                        }
                    }
                }
            }
            this.dimUpdatesQueued = false;
            if (needsRerender) {
                this.updateWidthAccum();
                this.headerIdentifiers.renderHeaders();
                this.forceRerender();
                this.updateSelection();
            }
        };
        this.zoomLevel = 1;
        this.events = {};
        this.toolbar = null;
        this._selectionBoundRects = [];
        this.renderQueued = false;
        this.dimUpdatesQueued = false;
        this.options = options;
        this.formulaBar = null;
        this.lastCol = null;
        this.scheduledRenders = {};
        this.needDims = {};
        this.scheduledOffBlockRenders = {};
        this.measureCanvas = document.createElement('canvas');
        this.wrapper = wrapper || document.createElement('div');
        const _container = document.createElement('div');
        this._container = _container;
        _container.tabIndex = 0; // Make div focusable
        _container.style.width = '100%';
        _container.style.height = '100%';
        _container.style.display = 'flex';
        _container.style.flexDirection = 'column';
        // _container.style.maxHeight = 'calc(100vh - 40px)';
        this.maxRows = options.maxRows || null;
        this.maxCols = options.maxCols || null;
        if (options.toolbar !== false) {
            this.toolbar = new (0, _toolbar.Toolbar)();
            _container.appendChild(this.toolbar.container);
        }
        if (options.formulaBar != false) {
            this.formulaBar = new (0, _formulaBar.FormulaBar)(this);
            _container.appendChild(this.formulaBar.container);
        }
        // _container.innerHTML += header;
        _container.insertAdjacentHTML('beforeend', `
        <div class="grid-container">
            <div class="corner-cell"></div>
            <div class="header-container"></div>
            <div class="row-number-container"></div>
            <div class="selection-layer"></div>
        </div>
        `);
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
        this.cornerCell = _container.querySelector('.corner-cell');
        this.selectionLayer = _container.querySelector('.selection-layer');
        this.formatButton = _container.querySelector('.format-button');
        this.lastDevicePixelRatio = this.effectiveDevicePixelRatio();
        this.lastBlockCanvases = this.blockCanvases();
        // Configuration
        this.cellWidth = options.cellWidth ?? 64;
        this.cellHeight = options.cellHeight ?? 20;
        this.blockRows = options.blockRows ?? 28; // Max rows per canvas block
        this.blockCols = options.blockCols ?? 30; // Max cols per canvas block
        this.paddingBlocks = options.paddingBlocks ?? 1; // Extra blocks to render around visible area
        this.padding = options.padding || 1; // number of adjacent blocks to render
        this.headerRowHeight = 0;
        this.rowNumberWidth = 0;
        if (options.cellHeaders !== false) {
            this.headerRowHeight = this.cellHeight || 30;
            this.rowNumberWidth = 42;
            this.selectionLayer.style.top = `${this.headerRowHeight}px`;
            this.selectionLayer.style.left = `${this.rowNumberWidth}px`;
            this.cornerCell.style.width = `${this.rowNumberWidth}px`;
            this.cornerCell.style.height = `${this.headerRowHeight}px`;
            this.cornerCell.style.marginTop = `-${this.headerRowHeight + 1}px`; // -1 for border
        }
        options.subscribeFinance;
        // State
        this.historyManager = new (0, _historyDefault.default)(this);
        this.keyboardHandler = new (0, _keyboardHandlerDefault.default)(this);
        this.copyHandler = new (0, _copypaste.CopyHandler)(this);
        this.pasteHandler = new (0, _copypaste.PasteHandler)(this);
        this.metrics = new (0, _gridmetricsDefault.default)(this);
        this.rowNumbers = new (0, _rownumbersDefault.default)(this);
        this.headerIdentifiers = new (0, _headeridentifiersDefault.default)(this);
        this.mergedCells = options.mergedCells || [];
        this.heightOverrides = this.buildOverrides(options.heightOverrides);
        this.widthOverrides = this.buildOverrides(options.widthOverrides);
        this.maxWidthInCol = {};
        this.widthMaxByCol = {};
        this.freeze = {
            col: 4
        };
        this.gridlinesOn = options.gridlinesOn ?? true;
        this.activeBlocks = new Map(); // Track active canvas blocks
        // window.activeBlocks = this.activeBlocks;
        // window.renderBlock = this.renderBlock.bind(this);
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
        // Add edit input element
        this.editInput = document.createElement('input');
        this.editInput.className = 'cell-edit-input';
        this.editInput.style.position = 'absolute';
        this.editInput.style.display = 'none';
        this.container.appendChild(this.editInput);
        // Initialize
        this.initEventListeners();
        this.createSelectionHandle();
        this.addNewSelection();
        this.probe = document.createElement('div');
        this.probe.style.position = 'absolute';
        this.probe.style.display = 'none';
        // this.probe.style.display = 'none';
        this.probe.style.visibility = 'hidden';
        this.probe.style.width = '10px';
        this.probe.style.height = '10px';
        this.probe.style.borderRadius = '5px';
        // this.probe.style.background = 'red';
        this.selectionLayer.appendChild(this.probe);
        this.data = null;
        this.parser = null;
        this.initialCells = options.initialCells;
        // if (!this.restoreSave()) {
        this.initRender();
        this.setData(new (0, _sparsegridDefault.default)(), options.initialCells);
    // }
    // this.intervalSetRandomData();
    // setTimeout(() => {
    // })
    }
    intervalSetRandomData() {
        if (!this.initialCells) return;
        setInterval(()=>{
            for (let cell of this.initialCells)if (// true
            !cell.text || !isNaN(cell.text) && !Number.isNaN(parseFloat(cell.text)) && !Number.isInteger(parseFloat(cell.text))) {
                let mul = 1;
                if (Math.random() > .8) mul = -1;
                this.setCell(cell.row, cell.col, 'text', (Math.random() * 10 * mul).toFixed(3));
                // const _cell = this.getCell(cell.row,cell.col);
                // _cell.text = (Math.random()*10*mul).toFixed(3);
                // this.putCellObj(cell.row,cell.col,Object.assign({}, _cell))
                this.renderCell(cell.row, cell.col);
            }
        }, 1500);
    }
    initRender() {
        this.updateGridDimensions();
        this.headerIdentifiers.renderHeaders();
        this.rowNumbers.renderRowNumbers();
        this.updateVisibleGrid();
    }
    buildOverrides(overrides) {
        if (!overrides) return [];
        const _overrides = [];
        for(let key in overrides){
            if (overrides[key] == null) continue;
            _overrides[key] = overrides[key];
        }
        return _overrides;
    }
    subscribeFinance() {
    // const f = new FinancialSubscriber();
    // f.listenYA(["API", "^GSPC", "^DJI", "^IXIC", "^RUT", "CL=F", "GC=F", "NVDA", "GME", "RKT", "GAP", "BLD", "IBP"]);
    // f.onTick((data: any) => {
    //     const cells = tickerReg[data.id] || {};
    //     for (let key in cells) {
    //         const [row,col] = key.split(',');
    //         this.renderCell(row,col,false);
    //     }
    //     console.log('gigasheet::ontick', data)
    // });
    }
    initEventListeners() {
        this.container.addEventListener('scroll', ()=>{
            requestAnimationFrame(()=>{
                this.handleScroll();
            });
        });
        const resizeObserver = new ResizeObserver(()=>{
            this.updateGridDimensions();
            this.metrics.calculateVisibleRange();
            this.rowNumbers.renderRowNumbers();
            this.headerIdentifiers.renderHeaders();
            this.updateVisibleGrid();
            this.updateSelection();
            this.updateRenderingQuality();
        });
        resizeObserver.observe(this.container);
        // Selection event listeners
        this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        // Edit event listeners
        this.container.addEventListener('dblclick', this.handleCellDblClick.bind(this));
        this._container.addEventListener('keydown', this.handleKeyDown.bind(this));
        // Copy selected cells to clipboard
        this._container.addEventListener('copy', (e)=>{
            if (this.editingCell) return;
            if (!this.selectionBoundRect) return;
            this.copyHandler.onCopy(e);
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
            this.setCells(selectedCells, 'ta', textAlign);
        });
        this._container.querySelector('.quick-text-actions-buttons')?.addEventListener('click', async (e)=>{
            // console.log('clicked align buttons', e.target?.getAttribute('data-align'))
            const action = e.target?.getAttribute('data-action');
            if (action === 'copy') document.execCommand('copy');
            else if (action === 'paste') {
                const clipboardText = await navigator.clipboard.readText();
                this.pasteHandler.handlePastePlaintext(clipboardText);
            // document.execCommand('paste');
            } else if (action === 'cut') {
                document.execCommand('copy');
                this.clearSelectedCells();
            }
        });
        this._container.addEventListener('paste', (e)=>{
            this.pasteHandler.onPaste(e);
        });
        this.ctxmenu.onClick(async (action)=>{
            if (action === 'copy') document.execCommand('copy');
            else if (action === 'cut') {
                document.execCommand('copy');
                this.clearSelectedCells();
            } else if (action === 'paste') {
                if (this.editingCell) return;
                const clipboardText = await navigator.clipboard.readText();
                this.pasteHandler.handlePastePlaintext(clipboardText);
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
        this.editInput.oninput = (e)=>{
            if (this.formulaBar) this.formulaBar.textarea.value = e.target.value;
        };
        this.toolbar?.onAction(async (action, value)=>{
            if (action === 'Merge') this.mergeSelectedCells();
            else if (action === 'Copy') document.execCommand('copy');
            else if (action === 'Paste') {
                const clipboardText = await navigator.clipboard.readText();
                this.pasteHandler.handlePastePlaintext(clipboardText);
            } else if (action === 'Undo') this.historyManager.undo();
            else if (action === 'Redo') this.historyManager.redo();
            else if (action === 'Left align') {
                const textAlign = 'left';
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, 'ta', textAlign);
                const c = selectedCells[0];
                if (c?.row == null) return;
                const value = this.getCell(c.row, c.col)?.ta || 'left';
                this.toolbar?.set('textAlign', value);
            } else if (action === 'Center align') {
                const textAlign = 'center';
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, 'ta', textAlign);
                const c = selectedCells[0];
                if (c?.row == null) return;
                const value = this.getCell(c.row, c.col)?.ta || 'left';
                this.toolbar?.set('textAlign', value);
            } else if (action === 'Right align') {
                const textAlign = 'right';
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, 'ta', textAlign);
                const c = selectedCells[0];
                if (c?.row == null) return;
                const value = this.getCell(c.row, c.col)?.ta || 'left';
                this.toolbar?.set('textAlign', value);
            } else if (action === 'Grow Font') {
                const selectedCells = this.getSelectedCells();
                this.setCellsMutate(selectedCells, (cell)=>{
                    if (cell.fontSize == null) cell.fontSize = 12;
                    cell.fontSize++;
                });
                const c = selectedCells[0];
                if (c?.row == null) return;
                const fontSize = this.getCell(c.row, c.col)?.fontSize || '12';
                this.toolbar?.set('fontSize', fontSize.toString());
            } else if (action === 'Shrink Font') {
                const selectedCells = this.getSelectedCells();
                this.setCellsMutate(selectedCells, (cell)=>{
                    if (cell.fontSize == null) cell.fontSize = 12;
                    cell.fontSize--;
                });
                const c = selectedCells[0];
                if (c?.row == null) return;
                const fontSize = this.getCell(c.row, c.col)?.fontSize || '12';
                this.toolbar?.set('fontSize', fontSize.toString());
            } else if (action === 'Bold') {
                const selectedCells = this.getSelectedCells();
                this.setCellsMutate(selectedCells, (cell)=>{
                    cell.bold = !cell.bold;
                });
                const c = selectedCells[0];
                if (c?.row == null) return;
                const value = this.getCell(c.row, c.col)?.bold || false;
                this.toolbar?.set('bold', value);
            } else if (action === 'Italic') {
                const selectedCells = this.getSelectedCells();
                this.setCellsMutate(selectedCells, (cell)=>{
                    cell.italic = !cell.italic;
                });
                const c = selectedCells[0];
                if (c?.row == null) return;
                const value = this.getCell(c.row, c.col)?.italic || false;
                this.toolbar?.set('italic', value);
            } else if (action === 'fontFamily') {
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, 'ff', value);
            } else if (action === 'fontSize') {
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, 'fontSize', value);
            } else if (action === 'backgroundColor') {
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, 'bc', value);
            } else if (action === 'borderShape') {
                const cells = this.getSelectedCellsOrVirtual2D();
                if (value === 'top') this.setCellsMutate(cells[0], (cell)=>{
                    if (cell.fontSize == null) this.setCell(cell.row, cell.col, 'border', (0, _utils.addBorder)(cell.border, 1 << 2));
                });
                else if (value === 'bottom') this.setCellsMutate(cells[cells.length - 1], (cell)=>{
                    if (cell.fontSize == null) this.setCell(cell.row, cell.col, 'border', (0, _utils.addBorder)(cell.border, 1 << 4));
                });
                else if (value === 'left') {
                    const leftCells = cells.map((row)=>row[0]);
                    this.setCellsMutate(leftCells, (cell)=>{
                        if (cell.fontSize == null) this.setCell(cell.row, cell.col, 'border', (0, _utils.addBorder)(cell.border, 1 << 1));
                    });
                } else if (value === 'right') {
                    const rightCells = cells.map((row)=>row[row.length - 1]);
                    this.setCellsMutate(rightCells, (cell)=>{
                        if (cell.fontSize == null) this.setCell(cell.row, cell.col, 'border', (0, _utils.addBorder)(cell.border, 1 << 3));
                    });
                } else if (value === 'box') {
                    const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
                    this.setCellsMutate(this.getSelectedCellsOrVirtual(), (cell)=>{
                        let border = cell.border;
                        if (cell.row === startRow) {
                            border = (0, _utils.addBorder)(border, 1 << 2);
                            this.setCell(cell.row, cell.col, 'border', border);
                        }
                        if (cell.row === endRow) {
                            border = (0, _utils.addBorder)(border, 1 << 4);
                            this.setCell(cell.row, cell.col, 'border', border);
                        }
                        if (cell.col === startCol) {
                            border = (0, _utils.addBorder)(border, 1 << 1);
                            this.setCell(cell.row, cell.col, 'border', border);
                        }
                        if (cell.col === endCol) {
                            border = (0, _utils.addBorder)(border, 1 << 3);
                            this.setCell(cell.row, cell.col, 'border', border);
                        }
                    });
                }
            }
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
        for (let [row, col] of Object.values(cellsNeedingShift)){
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
        this.rowNumbers.renderRowNumbers();
        record && this.historyManager.recordChanges([
            {
                changeKind: 'deleteEntireRow',
                row,
                rowData,
                heightOverride
            }
        ]);
        this.forceRerender();
        if (this.selectionBoundRect) {
            this.selectionBoundRect = this.getBoundingRectCells(this.selectionBoundRect.startRow, this.selectionBoundRect.startCol, this.selectionBoundRect.endRow, this.selectionBoundRect.endCol);
            this.updateSelection();
        }
    }
    deleteCol(col = null, record = true) {
        col = col != null ? col : this.selectionStart?.col;
        if (col == null) return;
        const cellsNeedingShift = (0, _dependencytracker.shiftDependenciesLeft)(col);
        for (let [row, col] of Object.values(cellsNeedingShift)){
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
        this.headerIdentifiers.renderHeaders();
        record && this.historyManager.recordChanges([
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
            if (pivot < this.heightOverrides.length) {
                this.heightOverrides.splice(pivot, 0, undefined);
                delete this.heightOverrides[pivot];
            }
        }
    }
    shiftWidthOverrides(pivot, amount = 1) {
        if (amount === -1) this.widthOverrides.splice(pivot, 1);
        else if (amount === 1) {
            if (pivot < this.widthOverrides.length) {
                this.widthOverrides.splice(pivot, 0, undefined);
                delete this.widthOverrides[pivot];
            }
        }
    }
    insertRow(row = null, data = null, record = true, heightOverride = null) {
        row = row != null ? row : this.selectionStart?.row;
        if (row == null) return;
        const cellsNeedingShift = (0, _dependencytracker.shiftDependenciesDown)(row);
        for (let [row, col] of Object.values(cellsNeedingShift)){
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
        this.rowNumbers.renderRowNumbers();
        record && this.historyManager.recordChanges([
            {
                changeKind: 'insertEntireRow',
                row
            }
        ]);
        this.forceRerender();
        if (this.selectionBoundRect) {
            this.selectionBoundRect = this.getBoundingRectCells(this.selectionBoundRect.startRow, this.selectionBoundRect.startCol, this.selectionBoundRect.endRow, this.selectionBoundRect.endCol);
            this.updateSelection();
        }
    }
    insertCol(col = null, data = null, record = true, widthOverride = null) {
        col = col != null ? col : this.selectionStart?.col;
        if (col == null) return;
        const cellsNeedingShift = (0, _dependencytracker.shiftDependenciesRight)(col);
        for (let [row, col] of Object.values(cellsNeedingShift)){
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
        this.headerIdentifiers.renderHeaders();
        record && this.historyManager.recordChanges([
            {
                changeKind: 'insertEntireCol',
                col
            }
        ]);
        this.forceRerender();
        if (this.selectionBoundRect) {
            this.selectionBoundRect = this.getBoundingRectCells(this.selectionBoundRect.startRow, this.selectionBoundRect.startCol, this.selectionBoundRect.endRow, this.selectionBoundRect.endCol);
            this.updateSelection();
        }
    }
    toggleGridlines() {
        this.gridlinesOn = !this.gridlinesOn;
        this.forceRerender();
    }
    scaler() {
        return this.effectiveDevicePixelRatio() < 1 ? (1 + (1 - this.effectiveDevicePixelRatio())) * (1 + (1 - this.effectiveDevicePixelRatio())) : 1;
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
                prevData: Object.assign({}, this.getCell(row, col)),
                changeKind: 'valchange'
            };
            this.clearElRegistry(row, col);
            deletions.push([
                row,
                col
            ]);
            changes.push(obj);
            this.updateDim(row, col);
        }
        this.data.deleteCells(deletions);
        this.historyManager.recordChanges(changes);
        // for (let [row, col] of deletions) {
        //     this.renderCell(row, col);
        // }
        this.rerenderCells(deletions);
        this.onSelectionChange();
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
    recordCellBeforeChange(row, col, attr) {
        const obj = {
            row,
            col,
            prevData: Object.assign({}, this.getCell(row, col)),
            attr,
            changeKind: 'valchange'
        };
        this.historyManager.changes.push(obj);
    }
    setWidthOverride(col, width) {
        if (width == null) delete this.widthOverrides[col];
        else this.widthOverrides[col] = width;
    }
    setHeightOverride(row, height) {
        if (height == null) delete this.heightOverrides[row];
        else this.heightOverrides[row] = height;
    }
    rerenderCellsForce(arr) {
        for (let cell of arr){
            this.putCellObj(cell.row, cell.col, cell);
            this.renderCell(cell.row, cell.col);
        }
    // this.rerenderMerges(arr);
    }
    rerenderCells(arr) {
        for (let cell of arr){
            let row, col;
            if (Array.isArray(cell)) {
                row = cell[0];
                col = cell[1];
            } else {
                row = cell.row;
                col = cell.col;
            }
            this.renderCell(row, col, false);
        }
    // this.rerenderMerges(arr);
    }
    rerenderMerges(arr = []) {
        const mergeSet = new Set();
        for (let cell of arr){
            let row, col;
            if (Array.isArray(cell)) {
                row = cell[0];
                col = cell[1];
            } else {
                row = cell.row;
                col = cell.col;
            }
            const merge = this.getMerge(row, col);
            if (!merge) continue;
            mergeSet.add(merge);
            for (let block of this.getBlocksInMerge(merge))this.renderCell(merge.startRow, merge.startCol, block);
        }
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
        const cell = this.getCellOrMerge(row, col);
        if (cell.renderType === 'custom') return;
        this.startCellEdit(row, col);
    }
    applyBorder(border) {
        const selectedCells = this.getSelectedCellsOrVirtual();
        this.setCellsMutate(selectedCells, (cell)=>{
            if (cell.fontSize == null) this.setCell(cell.row, cell.col, 'border', (0, _utils.addBorder)(cell.border, border));
        });
    }
    openFormatMenu() {
        const { win, addListener } = (0, _format.launchFormatMenu)();
        addListener((type, value)=>{
            if (type === 'border-apply') this.applyBorder(parseInt(value));
            else {
                const selectedCells = this.getSelectedCells();
                this.setCells(selectedCells, type, value);
            }
        });
    }
    forceRerender() {
        this.updateVisibleGrid(true);
    }
    handleKeyDown(e) {
        this.keyboardHandler.onKeyDown(e);
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
            this.widthOverrides = this.buildOverrides(save.widthOverrides);
            this.heightOverrides = this.buildOverrides(save.heightOverrides);
            this.mergedCells = save.mergedCells;
            this.gridlinesOn = save.gridlinesOn;
            const g = new (0, _sparsegridDefault.default)();
            g.restore(save.data);
            this.setData(g);
            this.updateGridDimensions();
            this.headerIdentifiers.renderHeaders();
            this.rowNumbers.renderRowNumbers();
            this.updateVisibleGrid(true);
            this.updateSelection();
            return true;
        }
        return false;
    }
    getSelectedCells() {
        if (!this.selectionBoundRect) return [];
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
        const cells = this.data.getCellsForce(startRow, startCol, endRow, endCol).filter((cell)=>this.isNotMergedOver(cell.row, cell.col));
        return cells;
    }
    getSelectedCellsOrVirtual() {
        if (!this.selectionBoundRect) return [];
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
        const cells = this.data.getCellsForce(startRow, startCol, endRow, endCol).filter((cell)=>this.isNotMergedOver(cell.row, cell.col));
        return cells;
    }
    getSelectedCellsOrVirtual2D() {
        if (!this.selectionBoundRect) return [];
        const arr = [];
        const { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
        for(let i = startRow; i <= endRow; i++){
            const cells = this.data.getCellsForce(i, startCol, i, endCol).filter((cell)=>this.isNotMergedOver(cell.row, cell.col));
            arr.push(cells);
        }
        return arr;
    }
    getSelectedCellsOrVirtualMultiple() {
        if (!this.selectionBoundRect) return [];
        const cells = [];
        for (let rect of this.getSelectionBoundRects()){
            const { startRow, startCol, endRow, endCol } = rect;
            cells.push(this.data.getCellsForce(startRow, startCol, endRow, endCol).filter((cell)=>this.isNotMergedOver(cell.row, cell.col)));
        }
        return cells;
    }
    getSelectedCellDataSparse() {
        const cells = [];
        if (!this.selectionBoundRect) return cells;
        for (let rect of this.getSelectionBoundRects()){
            const { startRow, startCol, endRow, endCol } = rect;
            for(let i = startRow; i <= endRow; i++){
                for(let j = startCol; j <= endCol; j++)if (this.data.has(i, j)) cells.push(this.getCell(i, j));
            }
        }
        return cells;
    }
    isNotMergedOver(row, col) {
        const merge = this.getMerge(row, col);
        if (!merge) return true;
        return merge.startRow == row && merge.startCol == col;
    }
    isMergedOver(row, col) {
        return !this.isNotMergedOver(row, col);
    }
    getTotalRows() {
        return this.totalRows;
    }
    getTotalCols() {
        return this.totalCols;
    }
    get shouldDrawGridlines() {
        return this.gridlinesOn && this.quality() !== 'performance';
    }
    get totalRows() {
        return Math.max(this.data?.bottomRow || 0, this.blockRows) + this.blockRows * this.padding;
    }
    get totalCols() {
        return Math.max(this.data?.rightCol || 0, this.blockCols) + this.blockCols * this.padding;
    }
    startCellEdit(row, col, startingValue) {
        if (row < 0 || row > this.totalRowBounds || col < 0 || col > this.totalColBounds) return;
        let left, top, width, height, value;
        ({ left, top, width, height, row, col } = this.metrics.getCellCoordsContainer(row, col));
        const cell = this.getCellOrMerge(row, col);
        value = startingValue != null ? '' : this.getCellText(cell.row, cell.col);
        if (this.options.launchCustomEditor) {
            const customEditor = this.options.launchCustomEditor(cell, {
                left,
                top,
                width,
                height
            });
            return;
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
            else if (e.key === 'Tab') this.finishCellEdit();
            else this.editInput.style.width = this.editInput.value.length + 1 + "ch";
        };
    }
    setText(row, col, text) {
        this.recordCellBeforeChange(row, col, 'text');
        this.setCell(row, col, 'text', text);
        this.historyManager.flushChanges();
        this.renderCell(row, col);
    }
    setCell(row, col, field, value) {
        const cell = this.getCell(row, col);
        if (!cell) return;
        cell[field] = value;
        if (!this.data.has(row, col)) this.data.set(row, col, cell);
        this.updateDim(row, col);
    }
    putCellObj(row, col, obj) {
        if (!obj) return;
        this.data.set(row, col, obj);
        this.updateDim(row, col);
    }
    setCellsMutate(cells, mutator) {
        for (let cell of cells){
            this.recordCellBeforeChange(cell.row, cell.col);
            mutator(cell);
            this.updateDim(cell.row, cell.col);
            this.renderCell(cell.row, cell.col);
        }
        this.historyManager.flushChanges();
    }
    setCells(cells, field, value) {
        for (let cell of cells){
            this.recordCellBeforeChange(cell.row, cell.col);
            this.setCell(cell.row, cell.col, field, value);
            this.renderCell(cell.row, cell.col);
        }
        this.historyManager.flushChanges();
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
        this.historyManager.recordChanges([
            {
                row,
                col,
                prevData: Object.assign({}, this.getCell(row, col)),
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
        const blocks = [];
        const blockSet = new Set();
        for(let i = merge.startRow; i <= merge.endRow; i++)for(let j = merge.startCol; j <= merge.endCol; j++){
            const block = this.getSubBlock(i, j);
            if (!block) continue;
            if (blockSet.has(block)) continue;
            blockSet.add(block);
            blocks.push([
                block,
                [
                    i,
                    j
                ]
            ]);
        }
        return blocks;
    }
    cancelCellEdit() {
        this.editInput.style.display = 'none';
        this.editingCell = null;
        this.editInput.onblur = null;
        this.editInput.onkeydown = null;
        this.onSelectionChange();
        this._container.focus();
    }
    updateRenderingQuality() {
        if (this.lastBlockCanvases !== this.blockCanvases()) {
            console.log("RESIZE");
            this.lastBlockCanvases = this.blockCanvases();
            this.forceRerender();
        } else if (Math.abs(this.effectiveDevicePixelRatio() - this.lastDevicePixelRatio) > 0.00) {
            // Only update if scale changed significantly
            this.lastDevicePixelRatio = this.effectiveDevicePixelRatio();
            console.log('update render quality');
            requestAnimationFrame(()=>{
                if (this.busy) return;
                const createTimeout = ()=>setTimeout(()=>{
                        this.busy = true;
                        this.activeBlocks.forEach((block)=>{
                            block.subBlocks.forEach((subBlock)=>{
                                subBlock.renderBlock(true);
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
        this._container.focus();
        if (e.button === 2) {
            let x = e.clientX;
            x = x - this._container.getBoundingClientRect().x;
            let y = e.clientY;
            y = y - this._container.getBoundingClientRect().y;
            const { row, col } = this.getCellFromEvent(e);
            this.lastCol = col;
            this.showContextMenu(x, y, row, col);
            return;
        }
        if (e.button !== 0) return;
        this.handleSelectionMouseDown(e);
    }
    getSelectionBoundRects() {
        return [
            ...this._selectionBoundRects,
            this.selectionBoundRect
        ].filter((r)=>r != null);
    }
    handleSelectionMouseDown(e) {
        const { row, col } = this.getCellFromEvent(e);
        this.lastCol = col;
        if (e.ctrlKey && this.selectionStart) {
            this._selectionBoundRects.push(this.selectionBoundRect);
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
            this._selectionBoundRects = [];
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
            this.selectionLayer.appendChild(this.probe);
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
        this.updateSelection(true);
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
            let x = e.clientX;
            x = x - this._container.getBoundingClientRect().x;
            let padderOffset = this.headerIdentifiers.renderHeaderPadder.getBoundingClientRect().width;
            if (padderOffset > 0) padderOffset += 42;
            this.draggingHeader.el.style.left = `${scrollLeft + x - 8 - padderOffset}px`;
        } else if (this.draggingRow) {
            const scrollTop = this.container.scrollTop;
            const rect = this.container.getBoundingClientRect();
            // this.draggingRow.el.style.top = `${scrollTop + e.clientY - this.headerRowHeight - rect.y - 5}px`;
            // console.log('dragging', (scrollTop + e.clientY - this.headerRowHeight - rect.y - 5) - this.renderRowNumberPadder.offsetTop);
            const top = scrollTop + e.clientY - this.headerRowHeight - rect.y - 5 - this.rowNumbers.renderRowNumberPadder.getBoundingClientRect().height;
            this.draggingRow.el.style.top = `${top}px`;
        } else if (this.isSelecting) {
            this.probe.style.display = 'block';
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
            const scrollLeft = this.container.scrollLeft;
            let x = e.clientX;
            x = x - this._container.getBoundingClientRect().x;
            const scrollTop = this.container.scrollTop;
            const rect = this.container.getBoundingClientRect();
            this.probe.style.right = `0px`;
            this.probe.style.bottom = `0px`;
            this.probe.style.width = `${this.metrics.getCellWidth(col) + 20}px`;
            this.probe.style.height = `${this.metrics.getCellHeight(row) + 20}px`;
            const probeRect = this.probe.getBoundingClientRect();
            this.probe.style.left = `${scrollLeft + x - this.rowNumberWidth - probeRect.width / 2}px`;
            this.probe.style.top = `${scrollTop + e.clientY - this.headerRowHeight - rect.y - probeRect.height / 2}px`;
            if (this.atEndWidth()) this.probe.style.left = `${scrollLeft - 30}px`;
            if (this.atEndHeight()) this.probe.style.top = `${scrollTop}px`;
            (0, _scrollIntoViewDefault.default)(this.probe, {
                scrollMode: 'if-needed',
                block: 'nearest',
                inline: 'nearest'
            });
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
            this.probe.style.display = 'none';
            // this.activeSelection.style.display = 'none';
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
            let x = e.clientX;
            x = x - this._container.getBoundingClientRect().x;
            let diff = scrollLeft + x - this.metrics.getWidthOffset(col + 1, true);
            diff = diff / this.zoomLevel;
            const prevOverride = this.widthOverrides[col];
            const change = this.widthOverrides[col] ? this.widthOverrides[col] + diff : this.metrics.getCellWidth(col) / this.zoomLevel + diff;
            if (change <= 1) {
                draggingHeader.el.style.left = draggingHeader.origLeft;
                return;
            }
            this.setWidthOverride(col, change);
            this.historyManager.recordChanges([
                {
                    changeKind: 'widthOverrideUpdate',
                    col,
                    value: prevOverride
                }
            ]);
            this.updateWidthAccum();
            this.headerIdentifiers.renderHeaders();
            this.forceRerender();
            this.updateSelection();
            e.stopPropagation();
        } else if (this.draggingRow) {
            const draggingRow = this.draggingRow;
            const row = this.draggingRow.row;
            this.draggingRow = null;
            const scrollTop = this.container.scrollTop;
            const rect = this.container.getBoundingClientRect();
            let diff = scrollTop + e.clientY - rect.y - this.metrics.getHeightOffset(row + 1, true);
            diff = diff / this.zoomLevel;
            const prevOverride = this.heightOverrides[row];
            const change = this.heightOverrides[row] ? this.heightOverrides[row] + diff : this.metrics.getCellHeight(row) / this.zoomLevel + diff;
            if (change <= 1) {
                draggingRow.el.style.top = draggingRow.origTop;
                return;
            }
            this.setHeightOverride(row, change);
            this.historyManager.recordChanges([
                {
                    changeKind: 'heightOverrideUpdate',
                    row,
                    value: prevOverride
                }
            ]);
            this.updateHeightAccum();
            this.rowNumbers.renderRowNumbers();
            this.forceRerender();
            this.updateSelection();
            e.stopPropagation();
        }
    }
    getCellFromEvent(e) {
        const rect = this.container.getBoundingClientRect();
        const scrollLeft = this.container.scrollLeft;
        const scrollTop = this.container.scrollTop;
        // Adjust for header and row numbers
        let x = e.clientX - rect.left + scrollLeft - this.rowNumberWidth;
        let y = e.clientY - rect.top + scrollTop - this.headerRowHeight; // 30 for header
        if (x < 0 || y < 0) return {
            row: -1,
            col: -1
        };
        let col = this.metrics.bsearch(this.widthAccum, x + this.rowNumberWidth) - 1;
        let row = this.metrics.bsearch(this.heightAccum, y + this.headerRowHeight) - 1;
        return {
            row: Math.min(row, this.totalRowBounds),
            col: Math.min(col, this.totalColBounds)
        };
    }
    mergeSelectedCells(bounds = null, recordChanges = true) {
        if (bounds == null && (!this.selectionStart || !this.selectionEnd)) return;
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
        recordChanges && this.historyManager.recordChanges([
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
        recordChanges && this.historyManager.recordChanges([
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
    getTrueValue(row, col) {
        const merge = this.getMerge(row, col);
        if (merge) return this.getCellText(merge.startRow, merge.startCol);
        return this.getCellText(row, col);
    }
    onSelectionChange() {
        if (!this.selectionBoundRect) return;
        const row = this.selectionBoundRect.startRow;
        const col = this.selectionBoundRect.startCol;
        const ref = (0, _shiftops.rowColToRef)(row, col);
        if (this.formulaBar) {
            this.formulaBar.input.value = ref;
            this.formulaBar.textarea.value = this.getTrueValue(row, col);
        }
        const fontSize = this.getCell(row, col)?.fontSize || '12';
        this.toolbar?.set('fontSize', fontSize.toString());
        const fontFamily = this.getCell(row, col).ff || 'Arial';
        this.toolbar?.set('fontFamily', fontFamily);
        const backgroundColor = this.getCell(row, col).bc || '#FFFFFF';
        this.toolbar?.set('backgroundColor', backgroundColor);
        const textAlign = this.getCell(row, col).ta || 'left';
        this.toolbar?.set('textAlign', textAlign);
        const bold = this.getCell(row, col).bold || false;
        this.toolbar?.set('bold', bold);
        const italic = this.getCell(row, col).italic || false;
        this.toolbar?.set('italic', italic);
        if (this.hasEvent('selectionChange')) {
            if (!this.prevSelectionBoundRect || this.prevSelectionBoundRect.startRow !== this.selectionBoundRect.startRow || this.prevSelectionBoundRect.startCol !== this.selectionBoundRect.startCol || this.prevSelectionBoundRect.endRow !== this.selectionBoundRect.endRow || this.prevSelectionBoundRect.endCol !== this.selectionBoundRect.endCol) {
                this.prevSelectionBoundRect = Object.assign({}, this.selectionBoundRect);
                this.emitEvent('selectionChange', Object.assign({}, this.selectionBoundRect));
            }
        }
    }
    updateSelection(fromKeyInput = false) {
        this.onSelectionChange();
        if (!this.activeSelection) return;
        // Clear previous selection
        this.activeSelection.innerHTML = '';
        if (!this.selectionHandle) return;
        this.selectionHandle.style.display = 'none';
        if (!this.selectionBoundRect) return;
        let { startRow, startCol, endRow, endCol } = this.selectionBoundRect;
        let left = this.metrics.getWidthOffset(startCol);
        let width = this.metrics.getWidthBetweenColumns(startCol, endCol + 1);
        if (!fromKeyInput && (this.visibleEndRow < startRow || this.visibleEndCol < startCol)) this.activeSelection.style.display = 'none';
        else this.activeSelection.style.display = 'block';
        endRow = Math.min(endRow, this.visibleEndRow);
        const top = this.metrics.getHeightOffset(startRow); // Below header
        const height = this.metrics.getHeightBetweenRows(startRow, endRow + 1);
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
            const el = this.headerIdentifiers.headerContainer.querySelector(`[data-hccol='${col}']`);
            if (!el) continue;
            el.classList.remove('col-selected');
            const handle = el.nextSibling;
            if (handle) handle.classList.remove('handle-col-selected');
        }
        for(let i = startCol; i <= endCol; i++){
            if (i in this.selectedCols) continue;
            this.selectedCols.add(i);
            const el = this.headerIdentifiers.headerContainer.querySelector(`[data-hccol='${i}']`);
            if (!el) continue;
            el.classList.add('col-selected');
            const handle = el.nextSibling;
            if (handle) handle.classList.add('handle-col-selected');
        }
        for (let row of this.selectedRows)if (row < startRow || row > endRow) {
            this.selectedRows.delete(row);
            const el = this.rowNumbers.rowNumberContainer.querySelector(`[data-rnrow='${row}']`);
            if (!el) continue;
            el.classList.remove('row-selected');
            const handle = el.nextSibling;
            if (handle) handle.classList.remove('handle-row-selected');
        }
        for(let i = startRow; i <= endRow; i++){
            if (i in this.selectedRows) continue;
            this.selectedRows.add(i);
            const el = this.rowNumbers.rowNumberContainer.querySelector(`[data-rnrow='${i}']`);
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
    setData(grid = null, initialData = null) {
        for (let cell of initialData || [])cell._id = (0, _sparsegrid.uuid).generate();
        grid = grid || new (0, _sparsegridDefault.default)();
        this.parser = new (0, _expressionparserDefault.default)(grid);
        this.data = grid;
        if (initialData) this.rerenderCellsForce(initialData);
    }
    createRowNumber(label) {
        const el = document.createElement('div');
        el.className = 'row-number';
        // el.textContent = label;
        el.innerHTML = `<div>${label}</div>`;
        return el;
    }
    get totalRowBounds() {
        let bounds = this.heightAccum?.length || this.blockRows;
        if (this.maxRows) bounds = Math.min(bounds, this.maxRows - 1);
        return bounds;
    }
    get totalColBounds() {
        let bounds = this.widthAccum?.length || this.blockCols;
        if (this.maxCols) bounds = Math.min(bounds, this.maxCols - 1);
        return bounds;
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
        // console.log(this.container.clientHeight, this.container.scrollTop, this.container.scrollHeight, updateVisHeight);
        for(let row = 0; row < oldHeight - 1 || row % this.blockRows !== 0 || // render full blocks
        row < this.totalRows || // render til bottom row that has data
        // this.heightAccum[this.heightAccum.length - 1] < this.container.scrollTop + this.container.clientHeight + 150 || // render til bottom of visible area
        this.heightAccum[this.heightAccum.length - 1] < this.container.clientHeight + 150 || // render til bottom of visible area
        updateVisHeight && row < prevRowBounds + this.blockRows; row++)this.heightAccum.push(heightSum += this.metrics.getCellHeight(row));
    }
    updateWidthAccum() {
        let prevColBounds = this.totalColBounds;
        const oldWidth = this.widthAccum.length;
        this.widthAccum = [
            this.rowNumberWidth
        ];
        let widthSum = this.rowNumberWidth;
        const updateVisWidth = this.container.clientWidth + this.container.scrollLeft >= this.container.scrollWidth - 150;
        for(let col = 0; col < oldWidth - 1 || col % this.blockCols !== 0 || col < this.totalCols || this.widthAccum[this.widthAccum.length - 1] < this.container.clientWidth + 150 || // render til right of visible area
        updateVisWidth && col < prevColBounds + this.blockCols; col++)this.widthAccum.push(widthSum += this.metrics.getColWidth(col));
    }
    updateGridDimensions() {
        this.updateHeightAccum();
        this.updateWidthAccum();
    }
    atEndWidth() {
        if (!this.maxCols) return false;
        if (!this.selectionEnd) return false;
        return this.selectionEnd.col >= this.maxCols - 1;
    }
    atEndHeight() {
        if (!this.maxRows) return false;
        if (!this.selectionEnd) return false;
        return this.selectionEnd.row >= this.maxRows - 1;
    }
    handleScroll() {
        const updateVisHeight = this.container.clientHeight + this.container.scrollTop >= this.container.scrollHeight - 150;
        const updateVisWidth = this.container.clientWidth + this.container.scrollLeft >= this.container.scrollWidth - 150;
        // this.activeSelection.style.display = 'none';
        // console.log(this.visibleStartRow, this.visibleStartCol, this.visibleEndRow, this.visibleEndCol);
        // if (this.selectionBoundRect) {
        //     if (this.selectionBoundRect.startRow >= this.visibleEndRow) {
        //         this.activeSelection.style.display = 'none';
        //     } else {
        //         this.activeSelection.style.display = 'block';
        //     }
        // }
        if (updateVisHeight || updateVisWidth) {
            console.log('SCROLL UPDATE VIS HEIGHT OR WIDTH');
            this.updateGridDimensions();
            this.metrics.calculateVisibleRange();
            this.rowNumbers.renderRowNumbers();
            this.headerIdentifiers.renderHeaders();
            // this.forceRerender();
            this.updateVisibleGrid();
        } else {
            this.updateGridDimensions();
            this.metrics.calculateVisibleRange();
            this.rowNumbers.renderRowNumbers();
            this.headerIdentifiers.renderHeaders();
            this.updateVisibleGrid();
        }
        this.updateSelection();
    }
    updateVisibleGrid(force = false) {
        const padding = this.padding;
        const maxBlockRows = Math.floor(this.totalRowBounds / this.blockRows);
        const maxBlockCols = Math.floor(this.totalColBounds / this.blockCols);
        this.metrics.calculateVisibleRange();
        // Determine which blocks we need to render
        const neededBlocks = new Set();
        const startBlockRow = Math.max(0, Math.floor(this.visibleStartRow / this.blockRows) - padding);
        let endBlockRow = Math.min(maxBlockRows, Math.floor((this.visibleEndRow - 1) / this.blockRows));
        const startBlockCol = Math.max(0, Math.floor(this.visibleStartCol / this.blockCols) - padding);
        let endBlockCol = Math.min(maxBlockCols, Math.floor((this.visibleEndCol - 1) / this.blockCols));
        // console.log('endblock', [endBlockRow,endBlockCol])
        // console.log('visible blocks', [startBlockRow, startBlockCol], 'through', [endBlockRow, endBlockCol])
        for(let blockRow = startBlockRow; blockRow <= endBlockRow; blockRow++)for(let blockCol = startBlockCol; blockCol <= endBlockCol; blockCol++)neededBlocks.add(`${blockRow},${blockCol}`);
        // Remove blocks that are no longer needed
        const toRemove = [];
        this.activeBlocks.forEach((block, key)=>{
            if (!neededBlocks.has(key)) {
                toRemove.push(key);
                this.releaseBlock(block);
            } else if (force) try {
                block.subBlocks.forEach((subBlock)=>{
                    subBlock.renderBlock(true);
                });
            } catch (err) {
                toRemove.push(key);
                this.releaseBlock(block);
            }
        });
        toRemove.forEach((key)=>this.activeBlocks.delete(key));
        if (toRemove.length > 0) {
            // this.renderHeaders();
            this.rowNumbers.renderRowNumbers();
            this.headerIdentifiers.renderHeaders();
        }
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
                    block.positionBlock();
                // this.positionBlock(block);
                }
            });
        });
    }
    blockCanvases() {
        if (this.effectiveDevicePixelRatio() >= 1.875) return 4;
        if (this.effectiveDevicePixelRatio() > 1.7) return 2;
        else return 1;
    }
    createBlock(blockRow, blockCol) {
        // Calculate block boundaries
        const startRow = blockRow * this.blockRows;
        let endRow = Math.min(startRow + this.blockRows);
        if (this.maxRows) endRow = Math.min(endRow, this.maxRows);
        const startCol = blockCol * this.blockCols;
        let endCol = Math.min(startCol + this.blockCols);
        if (this.maxCols) endCol = Math.min(endCol, this.maxCols);
        const blockContainer = document.createElement('div');
        // blockContainer.id = `${blockRow},${blockCol}`;
        blockContainer.className = 'canvas-block-container';
        const block = new (0, _block.Block)({
            startRow,
            endRow,
            startCol,
            endCol,
            blockRow,
            blockCol,
            blockContainer,
            subBlocks: [],
            count: this.blockCanvases()
        }, this);
        const key = `${blockRow},${blockCol}`;
        this.activeBlocks.set(key, block);
        // Add to DOM if not already present
        if (!blockContainer.parentNode) this.container.appendChild(blockContainer);
        return block;
    }
    effectiveDevicePixelRatio() {
        return devicePixelRatio;
    }
    blockKey(block) {
        return `${block.blockRow},${block.blockCol}`;
    }
    getKey(row, col) {
        return `${row},${col}`;
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
    getSubBlock(row, col) {
        const parentBlock = this.getBlock(row, col);
        if (!parentBlock) return null;
        if (parentBlock.subBlocks.length === 1) return parentBlock.subBlocks[0];
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
    setGridlinesCtx(ctx, bgc) {
        // console.log('bgc:', bgc)
        if (bgc) {
            ctx.strokeStyle = bgc;
            return;
        }
        ctx.fillStyle = bgc || '#333333';
        ctx.strokeStyle = `hsl(0,0%,88%)`;
    }
    scale(val) {
        return Math.round(val * this.effectiveDevicePixelRatio());
    }
    scalex(val) {
        return val * this.effectiveDevicePixelRatio();
    }
    scalec(val) {
        return Math.ceil(val * this.effectiveDevicePixelRatio());
    }
    scalef(val) {
        return Math.floor(val * this.effectiveDevicePixelRatio());
    }
    // Scale a rectangle to device pixels and round edges so that fills/strokes align
    // precisely with gridlines. Returns device-pixel integer coords and sizes.
    scaleRect(x, y, width, height) {
        const dpr = this.effectiveDevicePixelRatio();
        const l = Math.round(x * dpr);
        const t = Math.round(y * dpr);
        const r = Math.round((x + width) * dpr);
        const b = Math.round((y + height) * dpr);
        return {
            l,
            t,
            w: Math.max(0, r - l),
            h: Math.max(0, b - t)
        };
    }
    setBorStroke(ctx, borderColor) {
        ctx.strokeStyle = borderColor || 'black';
    }
    setGridLineStroke(ctx) {
        ctx.strokeStyle = '#dddddd';
    }
    setClearStroke(ctx) {
        ctx.strokeStyle = 'white';
    }
    strokeLine(ctx, x1, y1, x2, y2) {
        const color = ctx.strokeStyle;
        // ctx.globalCompositeOperation = 'destination-out';
        // ctx.strokeStyle = 'rgba(0,0,0,1)';
        // ctx.beginPath();
        // ctx.moveTo(x1 + 0.5, y1 + 0.5);
        // ctx.lineTo(x2 + 0.5, y2 + 0.5);
        // ctx.stroke();
        // ctx.globalCompositeOperation = 'source-over';
        // ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1 + 0.5, y1 + 0.5);
        ctx.lineTo(x2 + 0.5, y2 + 0.5);
        ctx.stroke();
    }
    getBorder(cell, side = 'left') {
        const border = cell?.border;
        if (typeof border === 'string') try {
            const obj = JSON.parse(border);
            return obj[side];
        } catch (e) {
            return null;
        }
        if (typeof border === 'number' && (0, _utils.hasBorderStr)(border, side)) {
            let borderColor = cell?.borderColor;
            if (typeof borderColor === 'string' && borderColor.startsWith('{')) try {
                return JSON.parse(borderColor)[side];
            } catch (e) {}
            else if (typeof borderColor === 'string') return borderColor;
            return 'black';
        }
    }
    // drawborders
    renderBorders(ctx, row, col, fromBlockRender) {
        // return;
        const cell = this.getCellOrMerge(row, col);
        ctx.save();
        ctx.lineWidth = 1;
        let left, top, width, height;
        ({ left, top, width, height } = this.metrics.getCellCoordsCanvas(row, col));
        const rect = this.scaleRect(left, top, width, height);
        // left border
        const leftCell = this.getCellOrMerge(cell.row, cell.col - 1);
        const leftBorder = this.getBorder(cell, 'left') || this.getBorder(leftCell, 'right');
        //  || cell.bc || leftCell?.bc;
        if (leftBorder) {
            this.setBorStroke(ctx, leftBorder);
            this.strokeLine(ctx, rect.l, rect.t, rect.l, rect.t + rect.h);
        } else if (!fromBlockRender) {
            if (this.getCellOrMerge(cell.row, cell.col - 1)?.bc) ;
            else {
                if (this.shouldDrawGridlines) this.setGridLineStroke(ctx);
                else this.setClearStroke(ctx);
                this.strokeLine(ctx, rect.l, rect.t, rect.l, rect.t + rect.h);
            }
        // todo: improve this logic, instead of above, calc right borders on cells abutting to the left
        }
        // top border
        const topCell = this.getCellOrMerge(cell.row - 1, cell.col);
        const topBorder = this.getBorder(cell, 'top') || this.getBorder(topCell, 'bottom');
        //  || cell.bc || topCell?.bc;
        if (topBorder) {
            this.setBorStroke(ctx, topBorder);
            this.strokeLine(ctx, rect.l, rect.t, rect.l + rect.w, rect.t);
        } else if (!fromBlockRender) {
            if (this.getCellOrMerge(cell.row - 1, cell.col)?.bc) ;
            else {
                if (this.shouldDrawGridlines) this.setGridLineStroke(ctx);
                else this.setClearStroke(ctx);
                this.strokeLine(ctx, rect.l, rect.t, rect.l + rect.w, rect.t);
            }
        // calc bottom borders on cells abutting to the top
        }
        // right border
        const rightCell = this.getCellOrMerge(cell.row, cell.col + 1);
        const rightBorder = this.getBorder(cell, 'right') || this.getBorder(rightCell, 'left');
        //  || cell.bc || rightCell?.bc;
        if (rightBorder) {
            this.setBorStroke(ctx, rightBorder);
            this.strokeLine(ctx, rect.l + rect.w, rect.t, rect.l + rect.w, rect.t + rect.h);
        } else if (!fromBlockRender) {
            if (this.getCellOrMerge(cell.row, cell.col + 1)?.bc) ;
            else {
                if (this.shouldDrawGridlines) this.setGridLineStroke(ctx);
                else this.setClearStroke(ctx);
                this.strokeLine(ctx, rect.l + rect.w, rect.t, rect.l + rect.w, rect.t + rect.h);
            }
        // calc left borders on cells abutting to the right
        }
        // bottom border
        const bottomCell = this.getCellOrMerge(cell.row + 1, cell.col);
        const bottomBorder = this.getBorder(cell, 'bottom') || this.getBorder(bottomCell, 'top');
        //  || cell.bc || bottomCell?.bc;
        if (bottomBorder) {
            this.setBorStroke(ctx, bottomBorder);
            this.strokeLine(ctx, rect.l, rect.t + rect.h, rect.l + rect.w, rect.t + rect.h);
        } else if (!fromBlockRender) {
            if (this.getCellOrMerge(cell.row + 1, cell.col)?.bc) ;
            else {
                if (this.shouldDrawGridlines) this.setGridLineStroke(ctx);
                else this.setClearStroke(ctx);
                this.strokeLine(ctx, rect.l, rect.t + rect.h, rect.l + rect.w, rect.t + rect.h);
            }
        // calc top borders on cells abutting to the bottom
        }
        ctx.restore();
    }
    getCtx(row, col) {
        let block = this.getSubBlock(row, col);
        if (!block) return;
        return block?.canvas.getContext('2d');
    }
    getOverlappingRect(rect1, rect2) {
        const startRow = Math.max(rect1.startRow, rect2.startRow);
        const startCol = Math.max(rect1.startCol, rect2.startCol);
        const endRow = Math.min(rect1.endRow, rect2.endRow);
        const endCol = Math.min(rect1.endCol, rect2.endCol);
        if (startRow <= endRow && startCol <= endCol) return {
            startRow,
            startCol,
            endRow,
            endCol
        };
        return null;
    }
    immediateRenderCell(row, col, fromBlockRender) {
        if (this.isMergedOver(row, col)) {
            if (!fromBlockRender) return;
            // only render cells part of this merge once in this block
            const merge = this.getMerge(row, col);
            const _block = this.getSubBlock(row, col);
            if (_block) {
                const rect = this.getOverlappingRect(merge, {
                    startRow: _block.startRow,
                    endRow: _block.endRow - 1,
                    startCol: _block.startCol,
                    endCol: _block.endCol - 1
                });
                for(let r = rect.startRow; r <= rect.endRow; r++)for(let c = rect.startCol; c <= rect.endCol; c++)delete this.scheduledRenders[this.getKey(r, c)];
            } else {
                console.log('no block for merge', merge, 'at cell', row, col);
                return;
            }
        }
        const cell = this.getCell(row, col);
        if (cell.renderType === 'custom' && this.options.renderCustomCell) {
            let left, top, width, height, value;
            ({ left, top, width, height, row, col } = this.metrics.getCellCoordsContainer(row, col));
            const customCell = this.options.renderCustomCell(cell, {
                left,
                top,
                width,
                height
            });
            return;
        }
        let block = this.getSubBlock(row, col);
        if (!block) return;
        let ctx = block?.canvas.getContext('2d');
        let left, top, width, height;
        // ctx.fillStyle = '#333333';
        this.renderCellBackground(ctx, row, col);
        this.renderBorders(ctx, row, col, fromBlockRender);
        if (this.getCell(row, col).cellType === 'button') {
            const button = this.getButton(row, col).el;
            ({ left, top, width, height } = this.metrics.getCellCoordsContainer(row, col));
            this.positionElement(button, left, top, width, height);
        } else if (this.getCell(row, col).cellType === 'linechart') {
            const lineChart = this.getLineChart(row, col)?.el;
            ({ left, top, width, height } = this.metrics.getCellCoordsContainer(row, col));
            this.positionElement(lineChart, left, top, width, height);
        } else {
            this.clearElRegistry(row, col);
            this.renderCellText(ctx, row, col);
            if ((0, _dependencytracker.dependencyTree)[row]?.[col]) {
                for(let childRow in (0, _dependencytracker.dependencyTree)[row][col])for(let childCol in (0, _dependencytracker.dependencyTree)[row][col][childRow])this.renderCell(Number(childRow), Number(childCol));
            }
        }
    }
    immediateOffBlockRender(row, col, fromBlockRender, block) {
        if (!block) return;
        try {
            this.metrics.getCellCoordsCanvas(row, col);
        } catch (e) {
            return;
        }
        let ctx = block?.canvas.getContext('2d');
        this.renderCellBackground(ctx, row, col);
        this.renderBorders(ctx, row, col, fromBlockRender);
        this.clearElRegistry(row, col);
        this.renderCellText(ctx, row, col);
    }
    getCellsInMerge(merge) {
        const cells = [];
        for(let row = merge.startRow; row <= merge.endRow; row++)for(let col = merge.startCol; col <= merge.endCol; col++)cells.push(this.getCell(row, col));
        return cells;
    }
    updateDim(row, col) {
        if (!this.isNotMergedOver(row, col)) return;
        if (!this.options?.autosize) return;
        if (col in this.widthOverrides && !this.getCell(row, col)?.ul) return;
        this.needDims[[
            row,
            col
        ].toString()] = [
            row,
            col
        ];
        if (!this.dimUpdatesQueued) {
            this.dimUpdatesQueued = true;
            requestAnimationFrame(this.immediateUpdateDims);
        }
    }
    renderCell(row, col, fromBlockRender) {
        if (this.maxRows && row > this.maxRows || this.maxCols && col > this.maxCols) return;
        this.scheduledRenders[`${row},${col}`] = [
            row,
            col,
            fromBlockRender
        ];
        const merge = this.getMerge(row, col);
        if (merge) {
            const startBlock = this.getSubBlock(merge.startRow, merge.startCol);
            for (let block of this.getBlocksInMerge(merge)){
                if (block[0] === startBlock) continue;
                this.scheduledOffBlockRenders[`${block[1][0]},${block[1][1]}`] = [
                    block[1][0],
                    block[1][1],
                    fromBlockRender,
                    block[0]
                ];
            }
        }
        if (!this.renderQueued) {
            this.renderQueued = true;
            requestAnimationFrame(this.immediateRenderAll);
        }
    }
    scalerZoom() {
        return this.effectiveDevicePixelRatio();
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
        el.style.position = 'absolute';
        append && this.container.appendChild(el);
    }
    getCellId(row, col) {
        return this.getCell(row, col)?._id;
    }
    setElRegistry(row, col, el, type) {
        const _id = this.getCellId(row, col);
        if (!_id) return;
        if (this.elRegistry[_id]) this.elRegistry[_id].el.remove();
        this.elRegistry[_id] = {
            el,
            type
        };
    }
    getButton(row, col) {
        const _id = this.getCellId(row, col);
        if (this.elRegistry[_id] && this.elRegistry[_id].type === 'button') return this.elRegistry[_id];
        else if (this.elRegistry[_id] && this.elRegistry[_id].type !== 'button') this.elRegistry[_id].el.remove();
        const button = document.createElement('button');
        button.textContent = this.getCellText(row, col);
        button.onclick = (e)=>e.stopPropagation();
        button.ondblclick = (e)=>e.stopPropagation();
        button.style.zIndex = 1;
        button.style.position = 'absolute';
        button.style.overflow = 'hidden';
        button.style.userSelect = 'none';
        const cell = this.getCellOrMerge(row, col);
        if (cell.fontSize) button.style.fontSize = `${cell.fontSize}px`;
        if (cell.color) button.style.color = `${cell.color}`;
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
            const { width, height } = this.metrics.getWidthHeight(row, col);
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
        const { width, height } = this.metrics.getWidthHeight(row, col);
        const lineChart = (0, _linechart.createLineChart)(data, wrapper, width, height);
        this.elRegistry[_id] = {
            el: wrapper,
            lineChart,
            data,
            type: 'lineChart'
        };
        return this.elRegistry[_id];
    }
    quality() {
        if (this.effectiveDevicePixelRatio() < 0.5) return 'performance';
        else if (this.effectiveDevicePixelRatio() < 1) return 'balance';
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
    hasCell(row, col) {
        return !this.data.has(row, col) || !this.data.get(row, col);
    }
    getCell(row, col) {
        if (!this.data) return {
            row,
            col
        };
        if (!this.data.has(row, col) || !this.data.get(row, col)) return {
            row,
            col
        };
        const cell = this.data.get(row, col);
        cell.row = row;
        cell.col = col; // bug: inserting can change row/col
        return cell;
    }
    getCellOrMerge(row, col) {
        const merge = this.getMerge(row, col);
        if (merge) return this.getCell(merge.startRow, merge.startCol);
        return this.getCell(row, col);
    }
    getCellText(row, col) {
        return this.getCell(row, col)?.text || '';
    }
    getCellTextAlign(row, col) {
        return this.getCell(row, col)?.ta;
    }
    // renderbackground
    renderCellBackground(ctx, row, col) {
        const cell = this.getCellOrMerge(row, col);
        if (cell?.bc != null) {
            ctx.save();
            ctx.fillStyle = cell.bc || 'white';
            const c = this.metrics.getCellCoordsCanvas(row, col);
            const { l, t, w, h } = this.scaleRect(c.left, c.top, c.width, c.height);
            ctx.clearRect(l, t, w, h);
            ctx.fillRect(l, t, w, h);
            ctx.restore();
        } else {
            ctx.save();
            ctx.fillStyle = cell.bc || 'white';
            const c = this.metrics.getCellCoordsCanvas(row, col);
            const { l, t, w, h } = this.scaleRect(c.left, c.top, c.width, c.height);
            ctx.fillRect(l + 1, t + 1, w - 1, h - 1);
            ctx.clearRect(l + 1, t + 1, w - 1, h - 1);
            // ctx.fillRect(l, t, w, h);
            // ctx.clearRect(l, t, w, h);
            ctx.restore();
        }
    }
    setTextCtx(ctx, row, col) {
        const cell = this.getCellOrMerge(row, col);
        if (this.getCellColor(cell.row, cell.col)) ctx.fillStyle = this.getCellColor(cell.row, cell.col);
        else if ((0, _utils.isNumeric)(cell.text) && cell.text < 0) ctx.fillStyle = 'red';
        ctx.font = this.getFontString(cell.row, cell.col);
        if (this.getCell(cell.row, cell.col)?.textBaseline != null) ctx.textBaseline = this.getCell(cell.row, cell.col).textBaseline;
        const textAlign = this.getCellTextAlign(cell.row, cell.col) || 'left';
        if (textAlign !== 'left') ctx.textAlign = this.getCellTextAlign(row, col);
    }
    renderCellText(ctx, row, col) {
        let left, top, width, height;
        ({ left, top, width, height } = this.metrics.getCellCoordsCanvas(row, col));
        const cell = this.getCellOrMerge(row, col);
        row = cell.row, col = cell.col;
        const value = this.getCellText(row, col);
        let text = value !== undefined && value !== null ? String(value) : '';
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
        this.setTextCtx(ctx, row, col);
        let textX = left;
        const textAlign = this.getCellTextAlign(row, col) || 'left';
        if (textAlign !== 'left') {
            if (textAlign === 'center') textX += width / 2;
            else if (textAlign === 'right') textX += width - 4;
        } else textX += 4;
        const dpr = this.effectiveDevicePixelRatio();
        ctx.rect((left + 1.4) * dpr, (top + 1.4) * dpr, (width - 2.8) * dpr, (this.metrics.rowHeight(row) - 1) * dpr); // Adjust y position based on your text baseline
        let region = new Path2D();
        region.rect((left + 1.4) * dpr, (top + 1.4) * dpr, (width - 2.8) * dpr, (this.metrics.rowHeight(row) - 1) * dpr);
        ctx.clip(region);
        ctx.fillText(text, textX * dpr, (top + this.metrics.rowHeight(row) / 2 + 1) * dpr);
        if (cell.ul && cell._dims) {
            ctx.beginPath();
            ctx.strokeStyle = cell.color || 'black';
            ctx.lineWidth = cell.fontSize ? this.getFontSize(cell.row, cell.col) / 6 : 2;
            const y = (top + this.metrics.rowHeight(row) / 2 + this.getFontSize(cell.row, cell.col) / 4 + 3) * dpr;
            // Compute underline start X based on text alignment so underline matches rendered text
            let underlineStartX = textX;
            if (textAlign === 'center') underlineStartX = textX - cell._dims.width / 2;
            else if (textAlign === 'right') underlineStartX = textX - cell._dims.width;
            const startX = underlineStartX * dpr;
            const endX = startX + cell._dims.width * dpr;
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            ctx.stroke();
        }
        ctx.restore(); // Restore the state to remove clipping
    }
    getFontSize(row, col) {
        return this.getCell(row, col)?.fontSize ?? 12;
    }
    getCellColor(row, col) {
        return this.getCell(row, col)?.color ?? '';
    }
    getAbbreviatedText(text) {
        if (text.length > 8) return text.substring(0, 5) + '...';
        return text;
    }
    getFontString(row = null, col = null) {
        let fontSize = 12 * this.effectiveDevicePixelRatio() * this.zoomLevel;
        if (row != null && col != null && this.getCell(row, col).fontSize != null) fontSize = this.getCell(row, col).fontSize * this.effectiveDevicePixelRatio() * this.zoomLevel;
        let bold, italic, fontFamily = 'Arial';
        if (row != null && col != null) {
            bold = this.getCell(row, col).bold;
            italic = this.getCell(row, col).italic;
            fontFamily = this.getCell(row, col).ff || 'Arial';
        }
        let fontString = '';
        if (bold) fontString += 'bold ';
        if (italic) fontString += 'italic ';
        fontString += `${fontSize}px ${fontFamily}`;
        if (this.quality() === 'max' && this.effectiveDevicePixelRatio() >= 1) // Only use subpixel rendering when not zoomed out
        fontString += ', sans-serif';
        return fontString;
    }
    releaseBlock(block) {
        if (block.subBlocks.length >= 1) while(block.subBlocks.length >= 1)block.subBlocks.pop();
        block.blockContainer.innerHTML = '';
        block.blockContainer.remove();
    // block.blockContainer.parentNode.removeChild(block.blockContainer);
    }
}
exports.default = Sheet;

},{"../packages/sparsegrid":"439Ev","../packages/expressionparser":"iCIGL","./windows/format":"cYZBq","./graphs/linechart":"llKjD","../packages/dependencytracker":"h7QoD","./utils":"8uhD9","./shiftops":"j0IU6","./components/contextmenu":"gI5GS","./components/formulaBar":"eqMRX","./components/toolbar":"i99wk","../packages/scrollIntoView":"4L1h3","./copypaste":"eVpGM","./components/block":"g9HFo","./history":"gYAB7","./keyboardHandler":"b3xq5","./gridmetrics":"gtl53","./rownumbers":"7XKRd","./headeridentifiers":"vcvFL","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"439Ev":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "uuid", ()=>uuid);
class UUIDGenerator {
    constructor(){
        this._id = 1;
    }
    generate() {
        return this._id++;
    }
}
const uuid = new UUIDGenerator();
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
        if (!cell._id) cell._id = uuid.generate();
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
        const isNewCell = isNewRow || !this._data[row][col];
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
        if (!value._id) value._id = uuid.generate();
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
            if (col in this._data[row] && this._data[row][col]) colData[row] = this._data[row][col];
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
        if (!this._data[row] || !this._data[row][col]) return {
            row,
            col
        };
        return this._data[row][col];
    }
    has(row, col = null) {
        if (col == null) return !!this._data[row];
        return this._data.hasOwnProperty(row) && this._data[row].hasOwnProperty(col);
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
    deleteCellsArea(startRow, startCol, endRow, endCol) {}
    getAllCells() {
        const data = [];
        for(let row in this._data)for(let col in this._data[row]){
            if (col === 'size') continue;
            if (this._data[row][col] && typeof this._data[row][col] === 'object') {
                this._data[row][col].row = parseInt(row);
                this._data[row][col].col = parseInt(col);
                data.push(this._data[row][col]);
            }
        }
        return data;
    }
    getAllCellsInRange(startRow, startCol, endRow, endCol) {
        const data = [];
        for(let row in this._data){
            if (row < startRow || row > endRow) continue;
            for(let col in this._data[row]){
                if (col < startCol || col > endCol) continue;
                if (this._data[row][col] && typeof this._data[row][col] === 'object') {
                    this._data[row][col].row = parseInt(row);
                    this._data[row][col].col = parseInt(col);
                    data.push(this._data[row][col]);
                }
            }
        }
        return data;
    }
    getAllData() {
        const data = [];
        for(let row in this._data)for(let col in this._data[row])data.push(this._data[row][col]);
        return data;
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
        for(let row = startRow; row <= endRow; row++)for(let col = startCol; col <= endCol; col++){
            let cell = this.get(row, col);
            if (!cell) cell = {
                row,
                col
            };
            cell.row = parseInt(row);
            cell.col = parseInt(col);
            cells.push(cell);
        }
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
            for(let col in this._data[row]){
                if (col === 'size') continue;
                callback(this._data[row][col], row, col, counter++);
            }
        }
    }
}
exports.default = SparseGrid;

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

},{}],"iCIGL":[function(require,module,exports,__globalThis) {
// import FinData from "./financial/FinData";
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _dependencytracker = require("./dependencytracker");
class ExpressionParser {
    // finData: FinData;
    constructor(data){
        this.data = data; // Spreadsheet data
    // this.finData = new FinData();
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
        // const tokens = [];
        // const regex = /\s*(=>|[-+*/^()]|[A-Za-z_]\w*|\d*\.?\d+|\S)\s*/dg;
        // let match: any;
        // while ((match = regex.exec(expression)) !== null) {
        //     tokens.push([match[1], match.indices[1]]);
        // }
        // res = '';
        const arr = expression.split(/(\s*=>|[-+*/^()]|[A-Za-z_]\w*|\d*\.?\d+|\S\s*)/g);
        const tokens = [];
        let idx = 0;
        arr.forEach((s, i)=>{
            if (i % 2 === 1) tokens.push([
                s,
                [
                    idx,
                    idx + s.length
                ]
            ]);
            idx = idx + s.length;
        });
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
                return '';
        }
    }
    getCellText(row, col) {
        return this.data.get(row, col)?.text ?? '';
    }
    // Get the value of a cell reference (e.g., A1, B2)
    getCellValue(cellRef) {
        const { row, col } = this.parseCellReference(cellRef);
        // Skip validation if boundaries are not set (empty grid)
        if (this.data.bottomRow !== null && this.data.rightCol !== null) {
            if (row < 0 || row > this.data.bottomRow || col < 0 || col > this.data.rightCol) return '';
        }
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
            // Skip validation if boundaries are not set (empty grid)
            if (this.data.bottomRow !== null && this.data.rightCol !== null) {
                if (row < 0 || row > this.data.bottomRow || col < 0 || col > this.data.rightCol) throw new Error(`Invalid cell in range: ${rangeRef}`);
            }
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
        const match = cellRef.match(/^([A-Za-z]+)(\d+)$/);
        if (!match) throw new Error(`Invalid cell reference: ${cellRef}`);
        const colLetter = match[1];
        const rowNumber = match[2];
        const col = colLetter.split('').reduce((acc, char)=>acc * 26 + (char.toUpperCase().charCodeAt(0) - 64), 0) - 1;
        const row = parseInt(rowNumber, 10) - 1;
        return {
            row,
            col
        };
    }
    static parseCellReference(cellRef) {
        const match = cellRef.match(/^([A-Za-z]+)(\d+)$/);
        if (!match) throw new Error(`Invalid cell reference: ${cellRef}`);
        const colLetter = match[1];
        const rowNumber = match[2];
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
        return !isNaN(expression) && !Number.isNaN(parseFloat(expression)) ? parseFloat(expression) : expression;
    }
}
exports.default = ExpressionParser;

},{"./dependencytracker":"h7QoD","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"h7QoD":[function(require,module,exports,__globalThis) {
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
        if (obj.hasOwnProperty(i)) return false;
    }
    return true;
}
function shiftDependenciesUp(pivotRow) {
    const cellsToUpdate = {};
    function helper(tree, depth = 0, didShift = false) {
        const newDeps = {};
        if (depth === 2) for(let row in tree){
            let tmp = tree[row];
            if (row > pivotRow) {
                newDeps[parseInt(row) - 1] = tree[row];
                delete tree[row];
            }
            if (didShift) for(let col in tmp)cellsToUpdate[`${row},${col}`] = [
                row,
                col
            ];
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
    const cellsToUpdate = {};
    function helper(tree, depth = 0, didShift = false) {
        const newDeps = {};
        if (depth === 2) for(let row in tree){
            let tmp = tree[row];
            if (row >= pivotRow) {
                newDeps[parseInt(row) + 1] = tree[row];
                delete tree[row];
            }
            if (didShift) for(let col in tmp)cellsToUpdate[`${row},${col}`] = [
                row,
                col
            ];
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
    const cellsToUpdate = {};
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
            if (didshift) cellsToUpdate[`${_row},${col}`] = [
                _row,
                col
            ];
        }
        for(let rowOrCol in newDeps)tree[rowOrCol] = newDeps[rowOrCol];
        return tree;
    }
    helper(dependencyTree);
    return cellsToUpdate;
}
function shiftDependenciesLeft(pivotCol) {
    const cellsToUpdate = {};
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
            if (didshift) cellsToUpdate[`${_row},${col}`] = [
                _row,
                col
            ];
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"cYZBq":[function(require,module,exports,__globalThis) {
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
            .alignment-btn,.border-btn,.border-btn-apply {
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
                <div class="menu-title">Add Border</div>
                <div class="border-options">
                    <div class="border-btn-apply" data-border="${2}" title="Border Left">Left</div>
                    <div class="border-btn-apply" data-border="${4}" title="Border Top">Top</div>
                    <div class="border-btn-apply" data-border="${8}" title="Border Right">Right</div>
                    <div class="border-btn-apply" data-border="${16}" title="Border Bottom">Bottom</div>
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
    formatWindow.document.querySelectorAll('.border-btn-apply').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const border = this.getAttribute('data-border');
            console.log('border:', border);
            onChange('border-apply', border);
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
            if (!baseline) return;
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"llKjD":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "createLineChart", ()=>createLineChart);
function createLineChart(data, container, width, height) {
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
            point.setAttribute("cx", String(x));
            point.setAttribute("cy", String(y));
            point.setAttribute("r", String(4));
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
                    label.setAttribute("x", String(xPos));
                    label.setAttribute("y", String(chartHeight + 20));
                    label.setAttribute("text-anchor", "middle");
                    // Shorten date format if needed
                    const labelText = d.date.length > 10 ? d.date.substring(5) : d.date;
                    label.textContent = labelText;
                    // Check if label would extend beyond right edge
                    const textLength = labelText.length * 6; // Approximate width
                    if (xPos + textLength / 2 > chartWidth) {
                        label.setAttribute("text-anchor", "end");
                        label.setAttribute("x", String(chartWidth - labelPadding));
                    } else if (xPos - textLength / 2 < 0) {
                        label.setAttribute("text-anchor", "start");
                        label.setAttribute("x", String(labelPadding));
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
            label.setAttribute("x", '-10');
            label.setAttribute("y", String(yScale(value)));
            label.setAttribute("text-anchor", "end");
            label.setAttribute("dy", "0.35em");
            label.textContent = value.toFixed(1);
            chartGroup.appendChild(label);
            // Add grid line
            const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            gridLine.setAttribute("x1", '0');
            gridLine.setAttribute("y1", String(yScale(value)));
            gridLine.setAttribute("x2", String(chartWidth));
            gridLine.setAttribute("y2", String(yScale(value)));
            gridLine.setAttribute("stroke", "#eee");
            gridLine.setAttribute("stroke-dasharray", "2,2");
            chartGroup.insertBefore(gridLine, chartGroup.firstChild);
        }
        // Add axis titles
        const xAxisTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
        xAxisTitle.setAttribute("class", "x-axis");
        xAxisTitle.setAttribute("x", String(chartWidth / 2));
        xAxisTitle.setAttribute("y", String(chartHeight + 40));
        xAxisTitle.setAttribute("text-anchor", "middle");
        xAxisTitle.textContent = "Date";
        chartGroup.appendChild(xAxisTitle);
        const yAxisTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
        yAxisTitle.setAttribute("class", "y-axis");
        yAxisTitle.setAttribute("transform", "rotate(-90)");
        yAxisTitle.setAttribute("x", String(-chartHeight / 2));
        yAxisTitle.setAttribute("y", String(-40)); // Adjusted to not overlap with labels
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"8uhD9":[function(require,module,exports,__globalThis) {
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
parcelHelpers.export(exports, "addBorderStr", ()=>addBorderStr);
parcelHelpers.export(exports, "mkel", ()=>mkel);
parcelHelpers.export(exports, "isNumeric", ()=>isNumeric);
parcelHelpers.export(exports, "extractClassesFromStyle", ()=>extractClassesFromStyle);
parcelHelpers.export(exports, "rgbToHex", ()=>rgbToHex) // function replaceRgbWithHex(input: string): string {
 //     if (!input) return input;
 //     return input.replace(/rgba?\(\s*[^)]+\)/gi, (match) => {
 //         try {
 //             return rgbToHex(match) || match;
 //         } catch {
 //             return match;
 //         }
 //     });
 // }
;
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
    if (typeof curBorder === 'string') try {
        const obj = JSON.parse(curBorder);
        return obj[borderStr] != null;
    } catch (e) {
        return false;
    }
    let border;
    if (borderStr === 'left') border = borderLeft;
    else if (borderStr === 'top') border = borderTop;
    else if (borderStr === 'right') border = borderRight;
    else if (borderStr === 'bottom') border = borderBottom;
    else return 0;
    return border === (border & curBorder);
}
function addBorderStr(curBorder, borderStr) {
    if (curBorder == null) return 0;
    if (borderStr === 'left') return curBorder | borderLeft;
    else if (borderStr === 'top') return curBorder | borderTop;
    else if (borderStr === 'right') return curBorder | borderRight;
    else if (borderStr === 'bottom') return curBorder | borderBottom;
    else return 0;
}
function mkel(tag = 'div', className = '', children) {
    const el = document.createElement(tag);
    el.className = className;
    if (children) el.innerHTML = children;
    return el;
}
const isNumeric = (num)=>!isNaN(num) && !Number.isNaN(parseFloat(num));
function extractClassesFromStyle(styleElement) {
    if (!styleElement) return null;
    document.head.appendChild(styleElement);
    const sheet = styleElement.sheet;
    const classes = {};
    try {
        const rules = sheet.cssRules || sheet.rules;
        for (let rule of rules)if (rule.type === CSSRule.STYLE_RULE) {
            const selector = rule.selectorText;
            if (selector.startsWith('.')) {
                const className = selector.slice(1);
                classes[className] = {
                    cssText: rule.style.cssText,
                    properties: Object.fromEntries(Array.from(rule.style).map((prop)=>[
                            prop,
                            rule.style.getPropertyValue(prop)
                        ]))
                };
            }
        }
    } catch (e) {
    // console.warn('Error parsing CSS:', e);
    } finally{
    // document.head.removeChild(styleElement);
    }
    return classes;
}
function rgbToHex(rgbString) {
    if (!rgbString) return '';
    if (rgbString.startsWith('#')) return rgbString;
    // Extract the R, G, B values from the string
    const match = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return rgbString; // Invalid RGB string format
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    // Convert each component to its hexadecimal representation
    // and ensure it's always two digits long by padding with a leading '0' if needed.
    const toHex = (c)=>{
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    const hexR = toHex(r);
    const hexG = toHex(g);
    const hexB = toHex(b);
    return `#${hexR}${hexG}${hexB}`;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"j0IU6":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "rowColToRef", ()=>rowColToRef);
parcelHelpers.export(exports, "shiftTextRefs", ()=>shiftTextRefs);
var _expressionparser = require("../packages/expressionparser");
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

},{"../packages/expressionparser":"iCIGL","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"gI5GS":[function(require,module,exports,__globalThis) {
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

},{"../utils":"8uhD9","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"eqMRX":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "FormulaBar", ()=>FormulaBar);
var _scrollIntoView = require("../../packages/scrollIntoView");
var _scrollIntoViewDefault = parcelHelpers.interopDefault(_scrollIntoView);
var _expressionparser = require("../../packages/expressionparser");
var _expressionparserDefault = parcelHelpers.interopDefault(_expressionparser);
var _shiftops = require("../shiftops");
class FormulaBar {
    constructor(sheet){
        this.sheet = sheet;
        this.isEditing = false;
        this.container = document.createElement('div');
        this.container.className = 'gigasheet-formulabar';
        this.container.innerHTML = `
            <input value="A1" class="gigasheet-name-box"></input>
            <!-- <div class="gigasheet-okcancelcontainer"><button>X</button><button>\u{2713}</button><button>fx</button></div> -->&nbsp;
            <textarea class="formulainput" spellcheck="false"></textarea>
        `;
        // <div style="background-color: white;width:100%;height:100%;display:flex;align-items:center;padding-left:10px;" contenteditable="true" class="formulainput" spellcheck="false"></div>
        // this.menu = this.container.querySelector('.gigasheet-menu')!;
        this.active = 1;
        this.tabCbs = [];
        this.input = this.container.querySelector('.gigasheet-name-box');
        this.textarea = this.container.querySelector('textarea');
        this.addEvents();
    }
    addEvents() {
        // this.editInput.onblur = this.finishCellEdit.bind(this);
        this.textarea.onfocus = (e)=>{
            this.isEditing = true;
        };
        this.textarea.onblur = (e)=>{
            this.isEditing = false;
        };
        this.textarea.onkeydown = (e)=>{
            if (e.key === 'Enter' || e.key === 'Tab') {
                this.isEditing = false;
                this.textarea.blur();
                this.sheet._container.focus();
                const selection = this.sheet.selectionBoundRect;
                const row = selection.startRow;
                const col = selection.startCol;
                this.sheet.historyManager.recordChanges([
                    {
                        row,
                        col,
                        prevData: Object.assign({}, this.sheet.getCell(row, col)),
                        changeKind: 'valchange'
                    }
                ]);
                this.sheet.setText(row, col, this.textarea.value);
                this.sheet.renderCell(row, col);
            } else if (e.key === 'Escape') {
                this.isEditing = false;
                this.textarea.value = this.sheet.getCellText(this.sheet.selectionStart.row, this.sheet.selectionStart.col);
                this.textarea.blur();
                this.sheet._container.focus();
            } else this.isEditing = true;
        };
        this.input.onfocus = (e)=>{
            this.isEditingCellSelect = true;
        };
        this.input.onblur = (e)=>{
            this.isEditingCellSelect = false;
        };
        this.input.onkeydown = (e)=>{
            if (e.key === 'Enter') {
                // this.sheet._container.focus();
                let cell;
                try {
                    cell = (0, _expressionparserDefault.default).parseCellReference(this.input.value);
                } catch (err) {
                    return;
                }
                if (cell && cell.row >= 0 && cell.col >= 0) {
                    this.sheet.lastCol = cell.col;
                    this.sheet.selectCell({
                        row: cell.row,
                        col: cell.col,
                        continuation: false
                    });
                }
                setTimeout(()=>{
                    (0, _scrollIntoViewDefault.default)(this.sheet.selectedCell, {
                        scrollMode: 'if-needed',
                        block: 'nearest',
                        inline: 'nearest'
                    });
                    this.input.blur();
                    this.sheet._container.focus();
                    this.isEditingCellSelect = false;
                }, 0);
            } else if (e.key === 'Escape') {
                this.isEditingCellSelect = false;
                this.input.blur();
                const row = this.sheet.selectionBoundRect.startRow;
                const col = this.sheet.selectionBoundRect.startCol;
                const ref = (0, _shiftops.rowColToRef)(row, col);
                this.input.value = ref;
                this.sheet._container.focus();
            } else this.isEditingCellSelect = true;
        };
    }
    emit(value) {
        this.tabCbs.forEach((fn)=>{
            fn(value);
        });
    }
}

},{"../../packages/scrollIntoView":"4L1h3","../../packages/expressionparser":"iCIGL","../shiftops":"j0IU6","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"4L1h3":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "compute", ()=>compute);
parcelHelpers.export(exports, "default", ()=>scrollIntoView);
const isElement = (el)=>typeof el === 'object' && el != null && el.nodeType === 1;
const canOverflow = (overflow, skipOverflowHiddenElements)=>{
    if (skipOverflowHiddenElements && overflow === 'hidden') return false;
    return overflow !== 'visible' && overflow !== 'clip';
};
const getFrameElement = (el)=>{
    if (!el.ownerDocument || !el.ownerDocument.defaultView) return null;
    try {
        return el.ownerDocument.defaultView.frameElement;
    } catch (e) {
        return null;
    }
};
const isHiddenByFrame = (el)=>{
    const frame = getFrameElement(el);
    if (!frame) return false;
    return frame.clientHeight < el.scrollHeight || frame.clientWidth < el.scrollWidth;
};
const isScrollable = (el, skipOverflowHiddenElements)=>{
    if (el.clientHeight < el.scrollHeight || el.clientWidth < el.scrollWidth) {
        const style = getComputedStyle(el, null);
        return canOverflow(style.overflowY, skipOverflowHiddenElements) || canOverflow(style.overflowX, skipOverflowHiddenElements) || isHiddenByFrame(el);
    }
    return false;
};
const alignNearest = (scrollingEdgeStart, scrollingEdgeEnd, scrollingSize, scrollingBorderStart, scrollingBorderEnd, elementEdgeStart, elementEdgeEnd, elementSize)=>{
    if (elementEdgeStart < scrollingEdgeStart && elementEdgeEnd > scrollingEdgeEnd || elementEdgeStart > scrollingEdgeStart && elementEdgeEnd < scrollingEdgeEnd) return 0;
    if (elementEdgeStart <= scrollingEdgeStart && elementSize <= scrollingSize || elementEdgeEnd >= scrollingEdgeEnd && elementSize >= scrollingSize) return elementEdgeStart - scrollingEdgeStart - scrollingBorderStart;
    if (elementEdgeEnd > scrollingEdgeEnd && elementSize < scrollingSize || elementEdgeStart < scrollingEdgeStart && elementSize > scrollingSize) return elementEdgeEnd - scrollingEdgeEnd + scrollingBorderEnd;
    return 0;
};
const getParentElement = (element)=>{
    const parent = element.parentElement;
    if (parent == null) return element.getRootNode().host || null;
    return parent;
};
const getScrollMargins = (target)=>{
    const computedStyle = window.getComputedStyle(target);
    return {
        top: parseFloat(computedStyle.scrollMarginTop) || 0,
        right: parseFloat(computedStyle.scrollMarginRight) || 0,
        bottom: parseFloat(computedStyle.scrollMarginBottom) || 0,
        left: parseFloat(computedStyle.scrollMarginLeft) || 0
    };
};
const compute = (target, options)=>{
    if (typeof document === 'undefined') return [];
    const { scrollMode, block, inline, boundary, skipOverflowHiddenElements } = options;
    const checkBoundary = typeof boundary === 'function' ? boundary : (node)=>node !== boundary;
    if (!isElement(target)) throw new TypeError('Invalid target');
    const scrollingElement = document.scrollingElement || document.documentElement;
    const frames = [];
    let cursor = target;
    while(isElement(cursor) && checkBoundary(cursor)){
        cursor = getParentElement(cursor);
        if (cursor === scrollingElement) {
            frames.push(cursor);
            break;
        }
        if (cursor != null && cursor === document.body && isScrollable(cursor) && !isScrollable(document.documentElement)) continue;
        if (cursor != null && isScrollable(cursor, skipOverflowHiddenElements)) frames.push(cursor);
    }
    const viewportWidth = window.visualViewport?.width ?? innerWidth;
    const viewportHeight = window.visualViewport?.height ?? innerHeight;
    const { scrollX, scrollY } = window;
    const { height: targetHeight, width: targetWidth, top: targetTop, right: targetRight, bottom: targetBottom, left: targetLeft } = target.getBoundingClientRect();
    const { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft } = getScrollMargins(target);
    let targetBlock = block === 'start' || block === 'nearest' ? targetTop - marginTop : block === 'end' ? targetBottom + marginBottom : targetTop + targetHeight / 2 - marginTop + marginBottom // block === 'center
    ;
    let targetInline = inline === 'center' ? targetLeft + targetWidth / 2 - marginLeft + marginRight : inline === 'end' ? targetRight + marginRight : targetLeft - marginLeft // inline === 'start || inline === 'nearest
    ;
    const computations = [];
    for(let index = 0; index < frames.length; index++){
        const frame = frames[index];
        const { height, width, top, right, bottom, left } = frame.getBoundingClientRect();
        if (scrollMode === 'if-needed' && targetTop >= 0 && targetLeft >= 0 && targetBottom <= viewportHeight && targetRight <= viewportWidth && (frame === scrollingElement && !isScrollable(frame) || targetTop >= top && targetBottom <= bottom && targetLeft >= left && targetRight <= right)) return computations;
        const frameStyle = getComputedStyle(frame);
        const borderLeft = parseInt(frameStyle.borderLeftWidth, 10);
        const borderTop = parseInt(frameStyle.borderTopWidth, 10);
        const borderRight = parseInt(frameStyle.borderRightWidth, 10);
        const borderBottom = parseInt(frameStyle.borderBottomWidth, 10);
        let blockScroll = 0;
        let inlineScroll = 0;
        const scrollbarWidth = 'offsetWidth' in frame ? frame.offsetWidth - frame.clientWidth - borderLeft - borderRight : 0;
        const scrollbarHeight = 'offsetHeight' in frame ? frame.offsetHeight - frame.clientHeight - borderTop - borderBottom : 0;
        const scaleX = 'offsetWidth' in frame ? frame.offsetWidth === 0 ? 0 : width / frame.offsetWidth : 0;
        const scaleY = 'offsetHeight' in frame ? frame.offsetHeight === 0 ? 0 : height / frame.offsetHeight : 0;
        if (scrollingElement === frame) {
            if (block === 'start') blockScroll = targetBlock;
            else if (block === 'end') blockScroll = targetBlock - viewportHeight;
            else if (block === 'nearest') blockScroll = alignNearest(scrollY, scrollY + viewportHeight, viewportHeight, borderTop, borderBottom, scrollY + targetBlock, scrollY + targetBlock + targetHeight, targetHeight);
            else blockScroll = targetBlock - viewportHeight / 2;
            if (inline === 'start') inlineScroll = targetInline;
            else if (inline === 'center') inlineScroll = targetInline - viewportWidth / 2;
            else if (inline === 'end') inlineScroll = targetInline - viewportWidth;
            else inlineScroll = alignNearest(scrollX, scrollX + viewportWidth, viewportWidth, borderLeft, borderRight, scrollX + targetInline, scrollX + targetInline + targetWidth, targetWidth);
            blockScroll = Math.max(0, blockScroll + scrollY);
            inlineScroll = Math.max(0, inlineScroll + scrollX);
        } else {
            if (block === 'start') blockScroll = targetBlock - top - borderTop;
            else if (block === 'end') blockScroll = targetBlock - bottom + borderBottom + scrollbarHeight;
            else if (block === 'nearest') blockScroll = alignNearest(top, bottom, height, borderTop, borderBottom + scrollbarHeight, targetBlock, targetBlock + targetHeight, targetHeight);
            else blockScroll = targetBlock - (top + height / 2) + scrollbarHeight / 2;
            if (inline === 'start') inlineScroll = targetInline - left - borderLeft;
            else if (inline === 'center') inlineScroll = targetInline - (left + width / 2) + scrollbarWidth / 2;
            else if (inline === 'end') inlineScroll = targetInline - right + borderRight + scrollbarWidth;
            else inlineScroll = alignNearest(left, right, width, borderLeft, borderRight + scrollbarWidth, targetInline, targetInline + targetWidth, targetWidth);
            const { scrollLeft, scrollTop } = frame;
            blockScroll = scaleY === 0 ? 0 : Math.max(0, Math.min(scrollTop + blockScroll / scaleY, frame.scrollHeight - height / scaleY + scrollbarHeight));
            inlineScroll = scaleX === 0 ? 0 : Math.max(0, Math.min(scrollLeft + inlineScroll / scaleX, frame.scrollWidth - width / scaleX + scrollbarWidth));
            targetBlock += scrollTop - blockScroll;
            targetInline += scrollLeft - inlineScroll;
        }
        computations.push({
            el: frame,
            top: blockScroll,
            left: inlineScroll
        });
    }
    return computations;
};
const isStandardScrollBehavior = (options)=>options === Object(options) && Object.keys(options).length !== 0;
const getOptions = (options)=>{
    if (options === false) return {
        block: 'end',
        inline: 'nearest'
    };
    if (isStandardScrollBehavior(options)) return options;
    return {
        block: 'start',
        inline: 'nearest'
    };
};
function scrollIntoView(target, options) {
    const margins = getScrollMargins(target);
    const behavior = typeof options === 'boolean' ? undefined : options?.behavior;
    for (const { el, top, left } of compute(target, getOptions(options))){
        const adjustedTop = top - margins.top + margins.bottom;
        const adjustedLeft = left - margins.left + margins.right;
        el.scroll({
            top: adjustedTop,
            left: adjustedLeft,
            behavior
        });
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"i99wk":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Toolbar", ()=>Toolbar);
var _icons = require("./icons");
var _dropdown = require("../dropdown");
var _dropdownDefault = parcelHelpers.interopDefault(_dropdown);
var _tooltip = require("../../../packages/tooltip");
var _tooltipDefault = parcelHelpers.interopDefault(_tooltip);
var _drawer = require("../../../packages/drawer");
var _drawerDefault = parcelHelpers.interopDefault(_drawer);
class Toolbar {
    constructor(){
        this.container = document.createElement('div');
        this.container.className = 'gigasheet-toolbar';
        this.container.innerHTML = `
            <div class="gigasheet-toolbar-buttons">
                <button class="gigasheet-toolbar-btn" data-tooltip="Undo">
                    <i class="gigasheet-icon">
                        ${0, _icons.undo}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Redo">
                    <i class="gigasheet-icon">
                        ${0, _icons.redo}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Copy">
                    <i class="gigasheet-icon">
                        ${0, _icons.copy}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Paste">
                    <i class="gigasheet-icon">
                        ${0, _icons.paste}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Bold">
                    <i class="gigasheet-icon">
                        ${0, _icons.bold}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Grow Font">
                    <i class="gigasheet-icon">
                        ${0, _icons.growFont}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Shrink Font">
                    <i class="gigasheet-icon">
                        ${0, _icons.shrinkFont}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Italic">
                    <i class="gigasheet-icon">
                        ${0, _icons.italic}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Borders">
                    <i class="gigasheet-icon">
                        ${0, _icons.borders}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn" data-tooltip="Merge">
                    <i class="gigasheet-icon">
                        ${0, _icons.merge}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn toolbar-text-align" data-tooltip="Left align">
                    <i class="gigasheet-icon">
                        ${0, _icons.leftAlign}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn toolbar-text-align" data-tooltip="Center align">
                    <i class="gigasheet-icon">
                        ${0, _icons.centerAlign}
                    </i>
                </button>
                <button class="gigasheet-toolbar-btn toolbar-text-align" data-tooltip="Right align">
                    <i class="gigasheet-icon">
                        ${0, _icons.rightAlign}
                    </i>
                </button>
                <input style="width:32px;" data-tooltip="Background Color" class="gigasheet-toolbar-btn" type="color" value="#FFFFFF">
                </button>
            </div>`;
        this.font = new (0, _dropdownDefault.default)('Font', [
            {
                value: 'Arial',
                name: 'Arial'
            },
            {
                value: 'Calibri',
                name: 'Calibri'
            },
            {
                value: 'Helvetica',
                name: 'Helvetica'
            },
            {
                name: 'Verdana',
                value: 'Verdana'
            },
            {
                value: 'Courier New',
                name: 'Courier New'
            },
            {
                name: 'Times New Roman',
                value: 'Times New Roman'
            },
            {
                value: 'Garamond',
                name: 'Garamond'
            },
            {
                name: 'Trebuchet MS',
                value: 'Trebuchet MS'
            },
            {
                value: 'Georgia',
                name: 'Georgia'
            }
        ]);
        this.container.children[0].appendChild(this.font.container);
        this.fontSize = new (0, _dropdownDefault.default)('FontSize', [
            {
                value: '8',
                name: '8'
            },
            {
                value: '9',
                name: '9'
            },
            {
                value: '10',
                name: '10'
            },
            {
                value: '11',
                name: '11'
            },
            {
                value: '12',
                name: '12'
            },
            {
                value: '13',
                name: '13'
            },
            {
                value: '15',
                name: '15'
            },
            {
                value: '18',
                name: '18'
            },
            {
                value: '22',
                name: '22'
            }
        ]);
        this.container.children[0].appendChild(this.fontSize.container);
        this.cb = null;
        this.borderDrawer = document.createElement('div');
        this.borderDrawer.style.textAlign = 'center';
        this.borderDrawer.innerHTML = `
        <button class="gigasheet-toolbar-btn" data-tooltip="box">
            <i class="gigasheet-icon">
                ${0, _icons.borderBox}
            </i>
        </button>
        <button class="gigasheet-toolbar-btn" data-tooltip="top">
            <i class="gigasheet-icon">
                ${0, _icons.borderTop}
            </i>
        </button>
        <button class="gigasheet-toolbar-btn" data-tooltip="left">
            <i class="gigasheet-icon">
                ${0, _icons.borderLeft}
            </i>
        </button>
        <button class="gigasheet-toolbar-btn" data-tooltip="right">
            <i class="gigasheet-icon">
                ${0, _icons.borderRight}
            </i>
        </button>
        <button class="gigasheet-toolbar-btn" data-tooltip="bottom">
            <i class="gigasheet-icon">
                ${0, _icons.borderBottom}
            </i>
        </button>
        `;
        this.addListeners();
    }
    set(attr, value) {
        if (attr === 'fontSize') this.fontSize.container.value = value;
        else if (attr === 'fontFamily') this.font.container.value = value;
        else if (attr === 'backgroundColor') this.backgroundColorButton.value = value;
        else if (attr === 'textAlign') this.setActiveTextAlign(value);
        else if (attr === 'bold') {
            const bold = this.container.querySelector(`[data-tooltip='Bold']`);
            if (value) bold?.classList.add('active-btn');
            else bold?.classList.remove('active-btn');
        } else if (attr === 'italic') {
            const el = this.container.querySelector(`[data-tooltip='Italic']`);
            if (value) el?.classList.add('active-btn');
            else el?.classList.remove('active-btn');
        }
    }
    setActiveTextAlign(value) {
        const left = this.container.querySelector(`[data-tooltip='Left align']`);
        const middle = this.container.querySelector(`[data-tooltip='Center align']`);
        const right = this.container.querySelector(`[data-tooltip='Right align']`);
        left?.classList.remove('active-btn');
        right?.classList.remove('active-btn');
        middle?.classList.remove('active-btn');
        let b;
        // b = left;
        if (value === 'left') b = left;
        else if (value === 'center') b = middle;
        else if (value == 'right') b = right;
        b?.classList.add('active-btn');
    }
    addListeners() {
        const onmouseenter = (e)=>{
            const text = e.target.getAttribute('data-tooltip');
            (0, _tooltipDefault.default)(e.target, text);
        };
        const onclick = (e)=>{
            if (!this.cb) return;
            const button = e.target.closest('.gigasheet-toolbar-btn');
            const text = button.getAttribute('data-tooltip');
            // if (button.classList.contains('toolbar-text-align')) {
            //     this.setActiveTextAlign(text.toLowerCase().split(' ')[0]);
            // }
            this.cb(text);
        };
        for (let el of this.container.querySelectorAll('.gigasheet-toolbar-btn')){
            el.onmouseenter = onmouseenter;
            el.addEventListener('click', onclick);
        }
        for (let el of this.borderDrawer.querySelectorAll('.gigasheet-toolbar-btn'))// el.onmouseenter = onmouseenter;
        // el.addEventListener('click', onclick);
        el.onclick = (e)=>{
            // console.log(el.getAttribute('data-tooltip'))
            const shape = el.getAttribute('data-tooltip');
            // this.sheet.applyBorder(shape);
            this.cb('borderShape', shape);
        };
        this.font.container.onchange = (e)=>{
            if (!this.cb) return;
            this.cb('fontFamily', e.target.value);
        };
        this.fontSize.container.onchange = (e)=>{
            if (!this.cb) return;
            this.cb('fontSize', e.target.value);
        };
        this.borderButton = this.container.querySelector(`[data-tooltip='Borders']`);
        this.borderButton.addEventListener('click', (e)=>{
            // alert('border')
            (0, _drawerDefault.default)(e.target, this.borderDrawer, 100);
        });
        this.backgroundColorButton = this.container.querySelector(`[data-tooltip='Background Color']`);
        this.backgroundColorButton.addEventListener('change', (e)=>{
            if (!this.cb) return;
            this.cb('backgroundColor', e.target.value);
        });
    }
    onAction(fn) {
        this.cb = fn;
    }
}

},{"./icons":"9APBL","../dropdown":"aJYDE","../../../packages/tooltip":"7P92b","../../../packages/drawer":"dqFhZ","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"9APBL":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "undo", ()=>undo);
parcelHelpers.export(exports, "redo", ()=>redo);
parcelHelpers.export(exports, "copy", ()=>copy);
parcelHelpers.export(exports, "paste", ()=>paste);
parcelHelpers.export(exports, "bold", ()=>bold);
parcelHelpers.export(exports, "growFont", ()=>growFont);
parcelHelpers.export(exports, "shrinkFont", ()=>shrinkFont);
parcelHelpers.export(exports, "italic", ()=>italic);
parcelHelpers.export(exports, "borders", ()=>borders);
parcelHelpers.export(exports, "borderBox", ()=>borderBox);
parcelHelpers.export(exports, "borderTop", ()=>borderTop);
parcelHelpers.export(exports, "borderLeft", ()=>borderLeft);
parcelHelpers.export(exports, "borderRight", ()=>borderRight);
parcelHelpers.export(exports, "borderBottom", ()=>borderBottom);
parcelHelpers.export(exports, "merge", ()=>merge);
parcelHelpers.export(exports, "leftAlign", ()=>leftAlign);
parcelHelpers.export(exports, "centerAlign", ()=>centerAlign);
parcelHelpers.export(exports, "rightAlign", ()=>rightAlign);
const undo = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="IconColors_HighContrast" d="M512 256q0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36v502q0 25 18 43 18 18 43 18h502q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15h-368l355-309q84-73 193-94 106-20 207 15 105 35 178 119 73 84 94 193 20 106-15 207-35 105-119 178l-866 727q-16 14-17 35-1 21 12 38 14 16 35 17 21 1 38-12l865-727q105-91 149-223 43-127 18-259-26-136-116-241-91-105-223-149-127-43-259-18-136 26-241 116l-381 332v-406z"></path><path type="path" class="IconColors_m22" d="M512 256q0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36v502q0 25 18 43 18 18 43 18h502q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15h-368l355-309q84-73 193-94 106-20 207 15 105 35 178 119 73 84 94 193 20 106-15 207-35 105-119 178l-866 727q-16 14-17 35-1 21 12 38 14 16 35 17 21 1 38-12l865-727q105-91 149-223 43-127 18-259-26-136-116-241-91-105-223-149-127-43-259-18-136 26-241 116l-381 332v-406z"></path></svg>`;
const redo = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="IconColors_HighContrast" d="M1536 256q0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36v502q0 25-18 43-18 18-44 18h-501q-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15h368l-356-309q-84-73-193-94-106-20-207 15-105 35-178 119-73 84-93 193-20 106 14 207 35 105 119 178l866 727q16 14 17 35 1 21-12 38-14 16-35 17-21 1-37-12l-866-727q-105-91-149-223-43-127-18-259 26-136 117-241 91-105 222-149 127-43 259-18 136 26 241 116l381 332v-406z"></path><path type="path" class="IconColors_m22" d="M1536 256q0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36v502q0 25-18 43-18 18-44 18h-501q-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15h368l-356-309q-84-73-193-94-106-20-207 15-105 35-178 119-73 84-93 193-20 106 14 207 35 105 119 178l866 727q16 14 17 35 1 21-12 38-14 16-35 17-21 1-37-12l-866-727q-105-91-149-223-43-127-18-259 26-136 117-241 91-105 222-149 127-43 259-18 136 26 241 116l381 332v-406z"></path></svg>`;
const copy = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="IconColors_HighContrast" d="M819 205q-85 0-145 60-60 60-60 145v1024q0 85 60 144 60 60 145 60h615q85 0 144-60 60-60 60-144v-1024q0-85-60-145-60-60-144-60h-615z m-102 205q0-42 30-73 30-30 72-30h615q42 0 72 30 30 30 30 73v1024q0 42-30 72-30 30-72 30h-615q-42 0-72-30-30-30-30-72v-1024z m-307 204q0-56 28-103 27-47 74-74v1048q0 106 75 181 75 75 181 75h638q-27 47-73 74-48 28-104 28h-461q-97 0-181-49-81-47-128-128-49-84-49-181v-871z"></path><path type="path" class="IconColors_m22" d="M819 205q-85 0-145 60-60 60-60 145v1024q0 85 60 144 60 60 145 60h615q85 0 144-60 60-60 60-144v-1024q0-85-60-145-60-60-144-60h-615z m-102 205q0-42 30-73 30-30 72-30h615q42 0 72 30 30 30 30 73v1024q0 42-30 72-30 30-72 30h-615q-42 0-72-30-30-30-30-72v-1024z m-307 204q0-56 28-103 27-47 74-74v1048q0 106 75 181 75 75 181 75h638q-27 47-73 74-48 28-104 28h-461q-97 0-181-49-81-47-128-128-49-84-49-181v-871z"></path></svg>`;
const paste = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="IconColors_HighContrast" d="M1075 717q-64 0-108 45-45 45-45 108v820q0 64 45 108 45 45 108 45h512q64 0 109-45 45-45 45-108v-820q0-64-45-108-45-45-109-45h-512z m-51 153q0-21 15-36 15-15 36-15h512q21 0 36 15 15 15 15 36v820q0 21-15 36-15 15-36 15h-512q-21 0-36-15-15-15-15-36v-820z m-563-460h162q16 45 55 73 40 29 90 29h307q50 0 90-29 39-28 55-73h162q21 0 37 15 15 15 15 36v102q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36v-102q0-64-45-109-45-45-109-45h-162q-16-45-55-73-40-29-90-29h-307q-50 0-90 29-39 28-55 73h-162q-64 0-109 45-45 45-45 109v1229q0 64 45 108 45 45 109 45h307q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15h-307q-21 0-36-15-15-15-15-36v-1229q0-21 15-36 15-15 36-15z m307 0q-21 0-36-15-15-15-15-37 0-21 15-36 15-15 36-15h307q21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15h-307z"></path><path type="path" class="IconColors_m20" d="M768 461h307q42 0 73-30 30-30 30-73 0-42-30-72-30-30-73-30h-307q-42 0-72 30-30 30-30 72 0 42 30 73 30 30 72 30z m205 409v820q0 42 30 72 30 30 72 30h512q42 0 73-30 30-30 30-72v-820q0-42-30-72-30-30-73-30h-512q-42 0-72 30-30 30-30 72z"></path><path type="path" class="IconColors_m22" d="M1075 717q-64 0-108 45-45 45-45 108v820q0 64 45 108 45 45 108 45h512q64 0 109-45 45-45 45-108v-820q0-64-45-108-45-45-109-45h-512z m-51 153q0-21 15-36 15-15 36-15h512q21 0 36 15 15 15 15 36v820q0 21-15 36-15 15-36 15h-512q-21 0-36-15-15-15-15-36v-820z"></path><path type="path" class="IconColors_m212" d="M358 1690v-1229q0-42 30-73 30-30 73-30h51q29 0 65 16 21 10 63 36 40 24 60 33 33 16 61 18 4 0 7 0h307q4 0 7 0 27-2 61-18 20-9 60-33 42-26 64-36 36-16 64-16h51q42 0 73 30 30 30 30 73v153h-410q-106 0-181 75-75 75-75 181v922h-358q-42 0-73-30-30-30-30-72z"></path><path type="path" class="IconColors_m211" d="M461 410h162q16 45 55 73 40 29 90 29h307q50 0 90-29 39-28 55-73h162q21 0 37 15 15 15 15 36v102q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36v-102q0-64-45-109-45-45-109-45h-162q-16-45-55-73-40-29-90-29h-307q-50 0-90 29-39 28-55 73h-162q-64 0-109 45-45 45-45 109v1229q0 64 45 108 45 45 109 45h307q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15h-307q-21 0-36-15-15-15-15-36v-1229q0-21 15-36 15-15 36-15z m307 0q-21 0-36-15-15-15-15-37 0-21 15-36 15-15 36-15h307q21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15h-307z"></path></svg>`;
const bold = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="IconColors_HighContrast" d="M614 1638v-1228q0-42 30-73 30-30 73-30h409q145 0 247 106 97 101 112 253 5 56-21 135-19 57-52 120-15 26-30 52 20 24 40 47 46 61 74 127 40 93 40 184 0 104-59 201-57 93-150 150-97 59-201 59h-409q-42 0-73-30-30-30-30-73z m205-102h307q50 0 100-37 47-35 77-89 31-57 32-113 0-84-66-153-65-69-143-69h-307v461z m0-1024v358l307 0q74 0 116-51 38-48 38-128 0-75-64-128-61-51-141-51h-256z"></path><path type="path" class="IconColors_m22" d="M614 1638v-1228q0-42 30-73 30-30 73-30h409q145 0 247 106 97 101 112 253 5 56-21 135-19 57-52 120-15 26-30 52 20 24 40 47 46 61 74 127 40 93 40 184 0 104-59 201-57 93-150 150-97 59-201 59h-409q-42 0-73-30-30-30-30-73z m205-102h307q50 0 100-37 47-35 77-89 31-57 32-113 0-84-66-153-65-69-143-69h-307v461z m0-1024v358l307 0q74 0 116-51 38-48 38-128 0-75-64-128-61-51-141-51h-256z"></path></svg>`;
const growFont = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="IconColors_HighContrast" d="M1747 687q10 19 31 25 20 6 39-5 19-10 24-30 6-20-4-39l-211-381q-19-34-56-46-34-12-68 0-36 13-55 46l-212 381q-10 19-4 39 6 20 24 30 19 10 39 5 20-6 31-25l211-380 211 380z m-979-277q35 0 48 32l512 1332q8 20-1 39-9 19-29 27-20 8-39-1-19-9-27-29l-184-479h-560l-184 479q-8 20-27 29-19 9-39 1-20-8-29-27-9-19-1-39l512-1332q13-33 48-32z m-241 819h482l-241-626-241 626z"></path><path type="path" class="IconColors_m22" d="M816 442q-13-33-48-32-35 0-48 32l-512 1332q-8 20 1 39 9 19 29 27 20 8 39-1 19-9 27-29l184-479h560l184 479q8 20 27 29 19 9 39 1 20-8 29-27 9-19 1-39l-512-1332z m193 787h-482l241-626 241 626z"></path><path type="path" class="IconColors_m24" d="M1817 707q-19 10-39 5-20-6-31-25l-211-380-211 380q-10 19-31 25-20 6-39-5-19-10-24-30-6-20 4-39l212-381q19-34 55-46 34-12 68 0 36 13 56 46l211 381q10 19 4 39-6 20-24 30z"></path></svg>`;
const shrinkFont = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false">
    <path type="path" class="IconColors_HighContrast"
        d="M1747 687q10 19 31 25 20 6 39-5 19-10 24-30 6-20-4-39l-211-381q-19-34-56-46-34-12-68 0-36 13-55 46l-212 381q-10 19-4 39 6 20 24 30 19 10 39 5 20-6 31-25l211-380 211 380z m-979-277q35 0 48 32l512 1332q8 20-1 39-9 19-29 27-20 8-39-1-19-9-27-29l-184-479h-560l-184 479q-8 20-27 29-19 9-39 1-20-8-29-27-9-19-1-39l512-1332q13-33 48-32z m-241 819h482l-241-626-241 626z">
    </path>
    <path type="path" class="IconColors_m22"
        d="M816 442q-13-33-48-32-35 0-48 32l-512 1332q-8 20 1 39 9 19 29 27 20 8 39-1 19-9 27-29l184-479h560l184 479q8 20 27 29 19 9 39 1 20-8 29-27 9-19 1-39l-512-1332z m193 787h-482l241-626 241 626z">
    </path>
    <path type="path" class="IconColors_m24"
        d="M1817 211q-19-10-39-4-20 6-31 24l-211 380-211-380q-10-19-31-24-20-6-39 4-19 10-24 31-6 20 4 39l212 380q19 34 55 47 34 12 68 0 36-13 56-47l211-380q10-19 4-39-6-20-24-31z">
    </path>
</svg>`;
const italic = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="IconColors_HighContrast" d="M1638 307q21 0 37 15 15 15 15 36 0 21-15 37-15 15-37 15h-323l-473 1228h336q21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15h-768q-21 0-37-15-15-15-15-36 0-21 15-37 15-15 37-15h323l472-1228h-335q-21 0-36-15-15-15-15-37 0-21 15-36 15-15 36-15h768z"></path><path type="path" class="IconColors_m22" d="M1638 307q21 0 37 15 15 15 15 36 0 21-15 37-15 15-37 15h-323l-473 1228h336q21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15h-768q-21 0-37-15-15-15-15-36 0-21 15-37 15-15 37-15h323l472-1228h-335q-21 0-36-15-15-15-15-37 0-21 15-36 15-15 36-15h768z"></path></svg>`;
const borders = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="IconColors_HighContrast" d="M154 205q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-37 15-15 15-15 37 0 21 15 36 15 15 37 15z m-52 153q0 21 15 37 15 15 37 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m820 0q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-564 666q21 0 37-15 15-15 15-36 0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m1383-666q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-1383-153q21 0 37-15 15-15 15-36 0-21-15-37-15-15-37-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-256 358q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m820 0q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-359 461q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m1178-461q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-1178-358q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-461 563q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m820 0q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-154 256q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m973-256q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-973-563q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-666 768q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m820 0q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m819 0q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-768-768q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-871 973q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-37 15-15 15-15 37z m820 0q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37z m256-154q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15z m563 154q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37z m-563-973q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-37 15-15 15-15 37 0 21 15 36 15 15 37 15z m-1076 1177q0 21 15 37 15 15 37 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m820 0q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m460-358q21 0 37-15 15-15 15-36 0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m359 358q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-359-1177q21 0 37-15 15-15 15-36 0-21-15-37-15-15-37-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-1280 1382q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m820 0q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m665-563q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m154 563q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-154-1382q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m205 0q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-1690 1587q0-21 15-36 15-15 37-15h1638q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15h-1638q-21 0-37-15-15-15-15-36z"></path><path type="path" class="IconColors_m23" d="M205 154q0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36 0-21 15-37 15-15 37-15 21 0 36 15 15 15 15 37z m-51 256q-21 0-37-15-15-15-15-37 0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15z m768-52q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-512 615q0 21-15 36-15 15-37 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 37 15 15 15 15 36z m1331-615q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-1331-204q0 21-15 36-15 15-37 15-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 37 15 15 15 15 37z m-308 409q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m871 51q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m-410 410q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m1229-410q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m-1229-409q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-409 614q-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m768-51q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-103 205q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36z m922-205q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-922-614q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37z m-717 819q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m871 51q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m768-51q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-717-819q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37z m-922 1024q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-37 15-15 15-15 37z m871 51q-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15z m205-205q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15z m614 205q-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15z m-614-1024q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-37 15-15 15-15 37 0 21 15 36 15 15 37 15z m-1024 1229q-21 0-37-15-15-15-15-37 0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15z m768-52q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m512-409q0 21-15 36-15 15-37 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 37 15 15 15 15 36z m307 409q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-307-1228q0 21-15 36-15 15-37 15-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 37 15 15 15 15 37z m-1332 1433q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m871 51q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m614-614q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m205 614q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m-205-1433q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m256-51q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37z"></path><path type="path" class="IconColors_m22" d="M154 1741q-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15h1638q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15h-1638z"></path></svg>`;
const borderBox = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="OfficeIconColors_HighContrast" d="M973 410q21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 37 15 15 36 15z m614 614q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m-563-461q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36z m358 461q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 37 15 15 15 15 36 0 21-15 36-15 15-37 15z m-358-256q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36z m154 256q-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m-154-51q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36z m0 205q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37z m-256-154q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m256 358q0 21-15 37-15 15-36 15-21 0-36-15-15-15-15-37 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36z m-461-358q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m461 563q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36z m-666-563q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 37 15 15 15 15 36 0 21-15 36-15 15-37 15z m-102-922q-64 0-109 45-45 45-45 109v1434q0 64 45 108 45 45 109 45h1434q64 0 108-45 45-45 45-108v-1434q0-64-45-109-45-45-108-45h-1434z m-51 154q0-21 15-36 15-15 36-15h1434q21 0 36 15 15 15 15 36v1434q0 21-15 36-15 15-36 15h-1434q-21 0-36-15-15-15-15-36v-1434z"></path><path type="path" class="OfficeIconColors_m23" d="M973 410q21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 37 15 15 36 15z m614 614q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m-614-410q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m409 410q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 37 15 15 15 15 36 0 21-15 36-15 15-37 15z m-409-205q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m205 205q-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m-205 0q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m51 154q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37z m-307-205q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m307 409q0 21-15 37-15 15-36 15-21 0-36-15-15-15-15-37 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36z m-512-409q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m512 614q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36z m-717-614q0 21 15 36 15 15 36 15 21 0 37-15 15-15 15-36 0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36z"></path><path type="path" class="OfficeIconColors_m22" d="M102 256q0-64 45-109 45-45 109-45h1434q64 0 108 45 45 45 45 109v1434q0 64-45 108-45 45-108 45h-1434q-64 0-109-45-45-45-45-108v-1434z m154-51q-21 0-36 15-15 15-15 36v1434q0 21 15 36 15 15 36 15h1434q21 0 36-15 15-15 15-36v-1434q0-21-15-36-15-15-36-15h-1434z"></path></svg>`;
const borderTop = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="OfficeIconColors_HighContrast" d="M102 154q0 21 15 36 15 15 37 15h1638q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15h-1638q-21 0-37 15-15 15-15 37z m0 204q0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-37-15-15-15-15-37z m0 205q0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36z m0 205q0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36z m256 154q21 0 37 15 15 15 15 36 0 21-15 36-15 15-37 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m-256 665q0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36z m52 154q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15z m768-154q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m819 0q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-1383 154q21 0 37 15 15 15 15 36 0 21-15 36-15 15-37 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m-256-359q0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-37-15-15-15-15-37z m820 0q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-36-15-15-15-15-37z m-359-460q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m1178 460q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-36-15-15-15-15-37z m-1178 359q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m-461-563q0-21 15-37 15-15 37-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36z m820 0q0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-154-256q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m973 256q0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-973 563q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m-666-768q0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36z m820 0q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m819 0q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-768 768q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m-51-973q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m256 154q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15z m563-154q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-563 973q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15z m-256-1178q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m460 359q21 0 37 15 15 15 15 36 0 21-15 36-15 15-37 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m359-359q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-359 1178q21 0 37 15 15 15 15 36 0 21-15 36-15 15-37 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m-460-1383q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-36-15-15-15-15-37z m665 564q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m154-564q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-36-15-15-15-15-37z m-154 1383q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m205 0q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z"></path><path type="path" class="OfficeIconColors_m23" d="M205 1792q0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36z m-51-256q-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15z m768 51q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-512-614q0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 37-15 15-15 15-36z m1331 614q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-1331 205q0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 37-15 15-15 15-36z m-308-410q0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-37-15-15-15-15-37z m871-51q-21 0-36 15-15 15-15 36 0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15z m-410-409q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m1229 409q-21 0-36 15-15 15-15 36 0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15z m-1229 410q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m-409-615q-21 0-37 15-15 15-15 37 0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15z m768 52q0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-103-205q0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36z m922 205q0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-922 614q0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36z m-717-819q0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36z m871-51q-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15z m768 51q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-717 819q0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36z m-922-1024q0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36z m871-51q-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15z m205 205q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15z m614-205q-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15z m-614 1024q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15z m-1024-1229q-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15z m768 51q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m512 410q0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 37-15 15-15 15-36z m307-410q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-307 1229q0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 37-15 15-15 15-36z m-1332-1434q0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-37-15-15-15-15-37z m871-51q-21 0-36 15-15 15-15 36 0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15z m614 615q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m205-615q-21 0-36 15-15 15-15 36 0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15z m-205 1434q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m256 51q0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36z"></path><path type="path" class="OfficeIconColors_m22" d="M154 205q-21 0-37-15-15-15-15-36 0-21 15-37 15-15 37-15h1638q21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15h-1638z"></path></svg>`;
const borderLeft = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="OfficeIconColors_HighContrast" d="M154 1843q21 0 36-15 15-15 15-36l0-1638q0-21-15-37-15-15-36-15-21 0-37 15-15 15-15 37v1638q0 21 15 36 15 15 37 15z m204-1638q-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 37 15 15 15 15 37 0 21-15 36-15 15-37 15z m205 0q-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15z m205 0q-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15z m205 0q-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15z m614 0q-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15z m0 819q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m0 819q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m154-51q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-819-205q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m819 0q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-359 256q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 37 15 15 15 15 36 0 21-15 36-15 15-37 15z m0-819q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 37 15 15 15 15 36 0 21-15 36-15 15-37 15z m-460 358q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-36-15-15-15-15-37z m460-1177q-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 37 15 15 15 15 37 0 21-15 36-15 15-37 15z m359 1177q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-36-15-15-15-15-37z m-563 461q-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m0-819q-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m-256 154q0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m256-973q-21 0-37-15-15-15-15-36 0-21 15-37 15-15 37-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15z m563 973q0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-768 665q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m0-819q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m768-51q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-973 870q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m0-819q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m154-256q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m819 0q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-1178 1075q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m0-819q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m359-461q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m819 0q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-1383 1280q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 37 15 15 15 15 36 0 21-15 36-15 15-37 15z m0-819q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 37 15 15 15 15 36 0 21-15 36-15 15-37 15z m564-666q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-36-15-15-15-15-37z m819 0q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-36-15-15-15-15-37z m0-204q0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z"></path><path type="path" class="OfficeIconColors_m23" d="M1792 1741q-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15z m-256 51q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m51-768q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m-614 512q-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15z m614-1331q-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15z m205 1331q-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15z m-410 307q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 37 15 15 15 15 36 0 21-15 36-15 15-37 15z m-51-870q0 21 15 36 15 15 36 15 21 0 37-15 15-15 15-36 0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36z m-409 409q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-36-15-15-15-15-37z m409-1228q0 21 15 36 15 15 36 15 21 0 37-15 15-15 15-36 0-21-15-37-15-15-37-15-21 0-36 15-15 15-15 37z m410 1228q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-36-15-15-15-15-37z m-615 410q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m52-768q-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m-205 102q-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15z m205-921q-21 0-37-15-15-15-15-36 0-21 15-37 15-15 37-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15z m614 921q-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15z m-819 717q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m-51-870q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m51-768q-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15z m819 717q-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15z m-1024 921q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m-51-870q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m205-205q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-205-614q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37z m1024 614q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36z m-1229 1024q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m51-768q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m410-512q-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15z m-410-307q-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15z m1229 307q-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15z m-1434 1331q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 37 15 15 15 15 36 0 21-15 36-15 15-37 15z m-51-870q0 21 15 36 15 15 36 15 21 0 37-15 15-15 15-36 0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36z m615-615q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-36-15-15-15-15-37z m-615-204q0 21 15 36 15 15 36 15 21 0 37-15 15-15 15-36 0-21-15-37-15-15-37-15-21 0-36 15-15 15-15 37z m1434 204q0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15-21 0-36-15-15-15-15-37z m51-256q-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15z"></path><path type="path" class="OfficeIconColors_m22" d="M205 1792q0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36l0-1638q0-21 15-37 15-15 37-15 21 0 36 15 15 15 15 37l0 1638z"></path></svg>`;
const borderRight = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="OfficeIconColors_HighContrast" d="M358 205q21 0 37-15 15-15 15-36 0-21-15-37-15-15-37-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m0 819q21 0 37-15 15-15 15-36 0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m-153 768q0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36z m153 51q21 0 37-15 15-15 15-36 0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m666-256q0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36z m-819 0q0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36z m358 256q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m0-819q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m461 358q0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37z m-461-1177q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-358 1177q0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 37 15 15 37 15 21 0 36-15 15-15 15-37z m563 461q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m0-819q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m256 154q0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36z m-256-973q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-563 973q0-21-15-37-15-15-36-15-21 0-37 15-15 15-15 37 0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36z m768 665q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m0-819q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m0-819q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-768 768q0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36z m973 870q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15z m0-819q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15z m-154-256q0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36z m154-563q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-37 15-15 15-15 37 0 21 15 36 15 15 37 15z m-973 563q0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36z m1177 1075q21 0 37-15 15-15 15-36 0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m0-819q21 0 37-15 15-15 15-36 0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m-358-461q0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36z m358-358q21 0 37-15 15-15 15-36 0-21-15-37-15-15-37-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-1177 358q0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36z m1382 1280q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m0-819q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m-563-666q0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37z m563-153q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-1382 153q0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 37 15 15 37 15 21 0 36-15 15-15 15-37z m0-204q0-21-15-37-15-15-36-15-21 0-37 15-15 15-15 37 0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36z m1587 1689q-21 0-36-15-15-15-15-36v-1638q0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37v1638q0 21-15 36-15 15-36 15z"></path><path type="path" class="OfficeIconColors_m23" d="M154 1741q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15z m256 51q0 21-15 36-15 15-37 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 37 15 15 15 15 36z m-52-768q21 0 37-15 15-15 15-36 0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m615 512q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m-615-1331q21 0 37-15 15-15 15-36 0-21-15-37-15-15-37-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-204 1331q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15z m409 307q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m51-870q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36z m410 409q0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37z m-410-1228q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37z m-409 1228q0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 37 15 15 37 15 21 0 36-15 15-15 15-37z m614 410q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36z m-51-768q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m205 102q21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15z m-205-921q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-614 921q21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36 0-21 15-37 15-15 37-15z m819 717q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m51-870q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36z m-51-768q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-819 717q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15z m1024 921q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15z m51-870q0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36z m-205-205q0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36z m205-614q0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36 0-21 15-37 15-15 37-15 21 0 36 15 15 15 15 37z m-1024 614q0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36z m1229 1024q0 21-15 36-15 15-37 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 37 15 15 15 15 36z m-52-768q21 0 37-15 15-15 15-36 0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m-409-512q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15z m409-307q21 0 37-15 15-15 15-36 0-21-15-37-15-15-37-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-1228 307q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15z m1433 1331q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m51-870q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36z m-614-615q0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37z m614-204q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37z m-1433 204q0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 37 15 15 37 15 21 0 36-15 15-15 15-37z m-51-256q21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36 0-21 15-37 15-15 37-15z"></path><path type="path" class="OfficeIconColors_m22" d="M1741 1792q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36l0-1638q0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37l0 1638z"></path></svg>`;
const borderBottom = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="OfficeIconColors_HighContrast" d="M154 205q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-37 15-15 15-15 37 0 21 15 36 15 15 37 15z m-52 153q0 21 15 37 15 15 37 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m820 0q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-564 666q21 0 37-15 15-15 15-36 0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m1383-666q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-1383-153q21 0 37-15 15-15 15-36 0-21-15-37-15-15-37-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-256 358q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m820 0q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-359 461q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m1178-461q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-1178-358q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-461 563q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m820 0q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-154 256q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m973-256q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-973-563q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-666 768q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m820 0q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m819 0q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-768-768q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-871 973q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-37 15-15 15-15 37z m820 0q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37z m256-154q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15z m563 154q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37z m-563-973q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-37 15-15 15-15 37 0 21 15 36 15 15 37 15z m-1076 1177q0 21 15 37 15 15 37 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m820 0q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m460-358q21 0 37-15 15-15 15-36 0-21-15-36-15-15-37-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m359 358q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-359-1177q21 0 37-15 15-15 15-36 0-21-15-37-15-15-37-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-1280 1382q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m820 0q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m665-563q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m154 563q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-154-1382q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m205 0q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-1690 1587q0-21 15-36 15-15 37-15h1638q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15h-1638q-21 0-37-15-15-15-15-36z"></path><path type="path" class="OfficeIconColors_m23" d="M205 154q0 21-15 36-15 15-36 15-21 0-37-15-15-15-15-36 0-21 15-37 15-15 37-15 21 0 36 15 15 15 15 37z m-51 256q-21 0-37-15-15-15-15-37 0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15z m768-52q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-512 615q0 21-15 36-15 15-37 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 37 15 15 15 15 36z m1331-615q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-1331-204q0 21-15 36-15 15-37 15-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 37 15 15 15 15 37z m-308 409q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m871 51q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m-410 410q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m1229-410q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m-1229-409q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m-409 614q-21 0-37-15-15-15-15-36 0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m768-51q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-103 205q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36z m922-205q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-922-614q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37z m-717 819q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m871 51q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m768-51q0 21 15 36 15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-717-819q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37z m-922 1024q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-37 15-15 15-15 37z m871 51q-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15z m205-205q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15z m614 205q-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37 0 21-15 36-15 15-36 15z m-614-1024q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-37 15-15 15-15 37 0 21 15 36 15 15 37 15z m-1024 1229q-21 0-37-15-15-15-15-37 0-21 15-36 15-15 37-15 21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15z m768-52q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m512-409q0 21-15 36-15 15-37 15-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 37 15 15 15 15 36z m307 409q0 21 15 37 15 15 36 15 21 0 36-15 15-15 15-37 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36z m-307-1228q0 21-15 36-15 15-37 15-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 37 15 15 15 15 37z m-1332 1433q0 21 15 36 15 15 37 15 21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-37 15-15 15-15 36z m871 51q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m614-614q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15z m205 614q-21 0-36-15-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15z m-205-1433q21 0 36-15 15-15 15-36 0-21-15-37-15-15-36-15-21 0-36 15-15 15-15 37 0 21 15 36 15 15 36 15z m256-51q0 21-15 36-15 15-36 15-21 0-36-15-15-15-15-36 0-21 15-37 15-15 36-15 21 0 36 15 15 15 15 37z"></path><path type="path" class="OfficeIconColors_m22" d="M154 1741q-21 0-37 15-15 15-15 36 0 21 15 36 15 15 37 15h1638q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15h-1638z"></path></svg>`;
const merge = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="IconColors_HighContrast" d="M1244 1214q-15-15-15-36 0-21 15-37l117-117h-674l117 117q15 15 15 37 0 21-15 36-15 15-36 15-21 0-36-15l-205-205q-15-15-15-36 0-21 15-36l205-205q15-15 36-15 21 0 36 15 15 15 15 36 0 21-15 36l-117 118h674l-117-118q-15-15-15-36 0-21 15-36 15-15 36-15 21 0 36 15l205 205q15 15 15 36 0 21-15 36l-205 205q-15 15-36 15-21 0-36-15z m-1039-702q0-127 90-217 90-90 217-90h1024q127 0 217 90 90 90 90 217v922q0 127-90 217-90 90-217 90h-1024q-127 0-217-90-90-90-90-217v-922z m1331-205h-1024q-85 0-145 60-60 60-60 145l1434 0q0-85-60-145-60-60-145-60z m-1229 1024h1434v-717h-1434v717z m0 103q0 85 60 144 60 60 145 60h1024q85 0 145-60 60-60 60-144h-1434z"></path><path type="path" class="IconColors_m22" d="M205 512q0-127 90-217 90-90 217-90h1024q127 0 217 90 90 90 90 217v922q0 127-90 217-90 90-217 90h-1024q-127 0-217-90-90-90-90-217v-922z m307-205q-85 0-145 60-60 60-60 145v922q0 85 60 144 60 60 145 60h1024q85 0 145-60 60-60 60-144v-922q0-85-60-145-60-60-145-60h-1024z"></path><path type="path" class="IconColors_m24" d="M205 573q0-20 0-27 0-13 0-34h1577q31 0 61 0v922q-31 0-61 0h-1577q0-28 0-39 0-8 0-23v-799z m102 41v717h1434v-717h-1434z"></path><path type="path" class="IconColors_m24" d="M1244 1141q-15 15-15 37 0 21 15 36 15 15 36 15 21 0 36-15l205-205q15-15 15-36 0-21-15-36l-205-205q-15-15-36-15-21 0-36 15-15 15-15 36 0 21 15 36l117 118h-674l117-118q15-15 15-36 0-21-15-36-15-15-36-15-21 0-36 15l-205 205q-15 15-15 36 0 21 15 36l205 205q15 15 36 15 21 0 36-15 15-15 15-36 0-21-15-37l-117-117h674l-117 117z"></path></svg>`;
const leftAlign = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="IconColors_HighContrast" d="M205 358q0-21 15-36 15-15 36-15h1126q21 0 37 15 15 15 15 36 0 21-15 37-15 15-37 15h-1126q-21 0-36-15-15-15-15-37z m0 615q0-21 15-36 15-15 36-15h1536q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15h-1536q-21 0-36-15-15-15-15-36z m51 563q-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15h922q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15h-922z"></path><path type="path" class="IconColors_m22" d="M205 358q0-21 15-36 15-15 36-15h1126q21 0 37 15 15 15 15 36 0 21-15 37-15 15-37 15h-1126q-21 0-36-15-15-15-15-37z m0 615q0-21 15-36 15-15 36-15h1536q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15h-1536q-21 0-36-15-15-15-15-36z m51 563q-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15h922q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15h-922z"></path></svg>`;
const centerAlign = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="IconColors_HighContrast" d="M410 358q0-21 15-36 15-15 36-15h1126q21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15h-1126q-21 0-36-15-15-15-15-37z m-205 615q0-21 15-36 15-15 36-15h1536q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15h-1536q-21 0-36-15-15-15-15-36z m358 563q-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15h922q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15h-922z"></path><path type="path" class="IconColors_m22" d="M410 358q0-21 15-36 15-15 36-15h1126q21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15h-1126q-21 0-36-15-15-15-15-37z m-205 615q0-21 15-36 15-15 36-15h1536q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15h-1536q-21 0-36-15-15-15-15-36z m358 563q-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15h922q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15h-922z"></path></svg>`;
const rightAlign = `<svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false"><path type="path" class="IconColors_HighContrast" d="M614 358q0-21 15-36 15-15 37-15h1126q21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15h-1126q-21 0-37-15-15-15-15-37z m-409 615q0-21 15-36 15-15 36-15h1536q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15h-1536q-21 0-36-15-15-15-15-36z m768 563q-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15h819q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15h-819z"></path><path type="path" class="IconColors_m22" d="M614 358q0-21 15-36 15-15 37-15h1126q21 0 36 15 15 15 15 36 0 21-15 37-15 15-36 15h-1126q-21 0-37-15-15-15-15-37z m-409 615q0-21 15-36 15-15 36-15h1536q21 0 36 15 15 15 15 36 0 21-15 36-15 15-36 15h-1536q-21 0-36-15-15-15-15-36z m768 563q-21 0-36 15-15 15-15 36 0 21 15 36 15 15 36 15h819q21 0 36-15 15-15 15-36 0-21-15-36-15-15-36-15h-819z"></path></svg>`;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"aJYDE":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class Dropdown {
    constructor(name, options){
        this.name = name;
        this.container = document.createElement('select');
        this.container.className = 'gigasheet-select';
        let str = '';
        for (let option of options)str += `<option value="${option.value}">${option.name}</option>`;
        this.container.innerHTML = str;
    }
}
exports.default = Dropdown;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"7P92b":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>tooltip);
function tooltip(target, text) {
    if (target.classList.contains('active')) return;
    const { left, top, width, height } = target.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'gigasheet-tooltip';
    el.innerText = text || '';
    document.body.appendChild(el);
    const elBox = el.getBoundingClientRect();
    el.style.left = `${left + width / 2 - elBox.width / 2}px`;
    el.style.top = `${top + height + 6}px`;
    target.onmouseleave = ()=>{
        if (document.body.contains(el)) document.body.removeChild(el);
    };
    target.onclick = ()=>{
        if (document.body.contains(el)) document.body.removeChild(el);
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"dqFhZ":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>drawer);
function drawer(target, child, maxWidth = 200) {
    if (target.classList.contains('active')) return;
    const { left, top, width, height } = target.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'gigasheet-tooltip';
    el.style.maxWidth = `${maxWidth}px`;
    // el.innerHTML = text || '';
    el.appendChild(child);
    document.body.appendChild(el);
    const elBox = el.getBoundingClientRect();
    el.style.left = `${left + width / 2 - elBox.width / 2}px`;
    el.style.top = `${top + height + 6}px`;
    setTimeout(()=>{
        const ondocclick = (event)=>{
            if (!el.contains(event.target)) {
                // document.body.removeChild(el);
                el.remove();
                document.removeEventListener('click', ondocclick);
            }
        };
        document.addEventListener('click', ondocclick);
    }, 0);
    target.onclick = ()=>{
        if (document.body.contains(el)) document.body.removeChild(el);
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"eVpGM":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "parseXML", ()=>parseXML);
parcelHelpers.export(exports, "toXML", ()=>toXML);
parcelHelpers.export(exports, "CopyHandler", ()=>CopyHandler);
parcelHelpers.export(exports, "PasteHandler", ()=>PasteHandler);
var _utils = require("./utils");
function parseXML(xml) {
    if (!xml) return;
    // console.log(xml)
    const d = document.createElement('div');
    d.innerHTML = xml;
    const table = d.querySelector('table');
    if (!table) return;
    const isGs = !!d.querySelector('google-sheets-html-origin');
    const styleEl = d.querySelector('style');
    if (isGs && styleEl) styleEl.remove();
    table.removeAttribute('border');
    // console.log(table)
    // table.style.position = 'absolute';
    // table.style.background = 'white';
    // table.style.top = 0;
    // const styleEl: any = d.querySelector('style');
    // const classes = extractClassesFromStyle(styleEl);
    // console.log('got classes:', classes)
    // document.body.appendChild(table);
    document.body.appendChild(d); // append to DOM to compute <style>
    const configs = [];
    const merges = [];
    let r = 0;
    const tbody = d.querySelector('tbody');
    const occupied = {};
    const isOccupied = (row, col)=>!!(occupied[row] && occupied[row][col]);
    const markOccupied = (rowStart, colStart, rowspan, colspan)=>{
        for(let rr = rowStart; rr < rowStart + rowspan; rr++){
            if (!occupied[rr]) occupied[rr] = [];
            for(let cc = colStart; cc < colStart + colspan; cc++)occupied[rr][cc] = true;
        }
    };
    for (let row of tbody.rows){
        let c = 0;
        for (let col of row.children){
            // const s = col.style;
            // console.log('computed styles', window.getComputedStyle(col));
            while(isOccupied(r, c))c++;
            const s = window.getComputedStyle(col);
            // console.log(Array.from(col.style));
            // for(let a of col.style) {console.log(a, s.getPropertyValue(a));}
            let top = s.getPropertyValue('border-top-width'), right = s.getPropertyValue('border-right-width'), bottom = s.getPropertyValue('border-bottom-width'), left = s.getPropertyValue('border-left-width');
            // console.log(col.style, top,bottom,left,right)
            let b = 0;
            if (top && top !== '0px') b = (0, _utils.addBorderStr)(b, 'top');
            if (right && right !== '0px') b = (0, _utils.addBorderStr)(b, 'right');
            if (bottom && bottom !== '0px') b = (0, _utils.addBorderStr)(b, 'bottom');
            if (left && left !== '0px') b = (0, _utils.addBorderStr)(b, 'left');
            const cell = {
                text: col.innerText,
                row: r,
                col: c
            };
            const fontEl = col.querySelector('font');
            const fontElColor = fontEl?.getAttribute('color');
            const color = fontElColor || s.getPropertyValue('color');
            if (color && color !== 'rgb(0, 0, 0)') cell.color = (0, _utils.rgbToHex)(color);
            const bc = s.getPropertyValue('background-color');
            if (bc && bc !== 'rgba(0, 0, 0, 0)') cell.bc = s.getPropertyValue('background-color');
            if (s.getPropertyValue('text-align') && s.getPropertyValue('text-align') !== 'left') cell.ta = s.getPropertyValue('text-align');
            const fw = s.getPropertyValue('font-weight');
            if (fw && (fw === 'bold' || parseInt(fw) >= 500)) cell.bold = true;
            if (s.getPropertyValue('font-style') === 'italic') cell.italic = true;
            if (s.getPropertyValue('text-decoration') === 'underline') cell.ul = true;
            const fontSize = s.getPropertyValue('font-size');
            if (fontSize && fontSize !== '12px') {
                const match = fontSize.match(/^\d+/);
                if (match) cell.fontSize = parseInt(match[0]);
            }
            // console.log(s.getPropertyPriority('font-family'))
            if (s.getPropertyValue('font-family')) cell.ff = s.getPropertyValue('font-family');
            // const rowspan = col.getAttribute('rowspan'), colspan = col.getAttribute('colspan');
            const rowspan = parseInt(col.getAttribute('rowspan') || '1', 10);
            const colspan = parseInt(col.getAttribute('colspan') || '1', 10);
            if (rowspan > 1 || colspan > 1) {
                merges.push({
                    startRow: r,
                    startCol: c,
                    endRow: r + rowspan - 1,
                    endCol: c + colspan - 1
                });
                // c+= parseInt(colspan)-1;
                markOccupied(r, c, rowspan, colspan);
            } else markOccupied(r, c, 1, 1);
            if (b) cell.border = b;
            configs.push(cell);
            // console.log(col.innerText)
            c += colspan;
        }
        r++;
    }
    d.remove();
    const xmlCopyData = JSON.stringify({
        srcCell: {
            row: 0,
            col: 0
        },
        configs,
        merges
    });
    return xmlCopyData;
}
function toXML(cells, getMerge) {
    const root = document.createElement('gigasheet-origin');
    //     root.innerHTML = `
    //         <style>
    //         table
    // 	    {
    //             mso-displayed-decimal-separator:"\.";
    //             mso-displayed-thousand-separator:"\,";
    //         }
    //         tr
    //             {mso-height-source:auto;}
    //         col
    //             {mso-width-source:auto;}
    //         td
    //             {padding-top:1px;
    //             padding-right:1px;
    //             padding-left:1px;
    //             mso-ignore:padding;
    //             color:black;
    //             font-size:11.0pt;
    //             font-weight:400;
    //             font-style:normal;
    //             text-decoration:none;
    //             font-family:"Aptos Narrow", sans-serif;
    //             mso-font-charset:0;
    //             text-align:general;
    //             vertical-align:bottom;
    //             border:none;
    //             white-space:nowrap;
    //             mso-rotate:0;}
    // </style>
    //     `
    const table = document.createElement('table');
    // table.appendChild(document.createElement('div'))
    root.appendChild(table);
    table.appendChild(document.createElement('col'));
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    // table.children[1].rows = [];
    const grid = cells.reduce((accum, cell)=>{
        if (!accum[cell.row]) accum[cell.row] = [];
        accum[cell.row].push(cell);
        return accum;
    }, {});
    tbody.append(document.createComment('StartFragment'));
    // console.log('grouped:', grid);
    for(let rowKey in grid){
        const row = grid[rowKey];
        const tr = document.createElement('tr');
        tbody.appendChild(tr);
        for (let cell of row){
            const td = document.createElement('td');
            const fontEl = document.createElement('font'); // libreoffice
            td.appendChild(fontEl);
            const merge = getMerge(cell.row, cell.col);
            if (merge) {
                td.setAttribute('colspan', merge.endCol - merge.startCol + 1);
                td.setAttribute('rowspan', merge.endRow - merge.startRow + 1);
            }
            tr.appendChild(td);
            // const color = cell.color || '#000000';
            if (cell.color) {
                td.style.color = (0, _utils.rgbToHex)(cell.color);
                td.setAttribute('color', (0, _utils.rgbToHex)(cell.color));
                fontEl.setAttribute('color', (0, _utils.rgbToHex)(cell.color));
            }
            if (cell.bold) td.style['font-weight'] = 'bold';
            if (cell.italic) td.style['font-style'] = 'italic';
            // pt = px * (72 / 96)
            td.style['font-size'] = cell.fontSize ? `${cell.fontSize}px` : '12px';
            // td.style['font-size'] = cell.fontSize ? `${cell.fontSize*(72 / 96)}pt` : `${12*(72 / 96)}pt`;
            if (cell.ff) {
                td.style['font-family'] = cell.ff;
                fontEl.setAttribute('Face', cell.ff);
            }
            if (cell.bc) {
                td.style['background-color'] = cell.bc;
                td.setAttribute('bgcolor', (0, _utils.rgbToHex)(cell.bc));
                td.style['background'] = cell.bc;
            } // #104861;
            td.style['text-align'] = cell.ta || 'left';
            td.setAttribute('align', cell.ta || 'left');
            fontEl.innerText = cell.text || '';
            if ((0, _utils.hasBorderStr)(cell.border, 'top')) {
                td.style['border-top-width'] = '1px';
                td.style['border-top-style'] = 'solid';
                td.style['border-top-color'] = 'rgb(0, 0, 0)';
            }
            if ((0, _utils.hasBorderStr)(cell.border, 'right')) {
                td.style['border-right-width'] = '1px';
                td.style['border-right-style'] = 'solid';
                td.style['border-right-color'] = 'rgb(0, 0, 0)';
            }
            if ((0, _utils.hasBorderStr)(cell.border, 'bottom')) {
                td.style['border-bottom-width'] = '1px';
                td.style['border-bottom-style'] = 'solid';
                td.style['border-bottom-color'] = 'rgb(0, 0, 0)';
            }
            if ((0, _utils.hasBorderStr)(cell.border, 'left')) {
                td.style['border-left-width'] = '1px';
                td.style['border-left-style'] = 'solid';
                td.style['border-left-color'] = 'rgb(0, 0, 0)';
            }
        }
    }
    tbody.append(document.createComment('EndFragment'));
    // console.log(root.outerHTML);
    return root.outerHTML;
}
class CopyHandler {
    constructor(sheet){
        this.sheet = sheet;
    }
    onCopy(e) {
        const { startRow, startCol, endRow, endCol } = this.sheet.getSelectionBoundRects()[0];
        let clipboardData = '';
        for(let row = startRow; row <= endRow; row++){
            for(let col = startCol; col <= endCol; col++){
                const value = this.sheet.getCellText(row, col);
                clipboardData += value;
                if (col < endCol) clipboardData += '\t';
            }
            if (row < endRow) clipboardData += '\n';
        }
        e.clipboardData.setData('text/plain', clipboardData);
        e.clipboardData.setData('json/pasteData', JSON.stringify({
            srcCell: {
                row: startRow,
                col: startCol
            },
            configs: this.sheet.getSelectedCellDataSparse(),
            merges: this.sheet.getMergesInRange(this.sheet.selectionBoundRect)
        }));
        e.clipboardData.setData('text/html', toXML(this.sheet.getSelectedCellsOrVirtual(), this.sheet.getMerge));
        e.preventDefault();
    }
}
class PasteHandler {
    constructor(sheet){
        this.sheet = sheet;
    }
    onPaste(e) {
        if (this.sheet.editingCell) return;
        // this.handlePaste(e.clipboardData!.getData('text/plain'));
        // this.handlePasteData(e.clipboardData!.getData('json/pasteData'),e);
        // for (const type of e.clipboardData!.types) {
        // const data = e.clipboardData!.getData(type);
        // console.log(data)
        // }
        e.preventDefault();
        if (e.clipboardData.getData('json/pasteData')) this.handlePasteData(e.clipboardData.getData('json/pasteData'), e);
        else {
            const xml = e.clipboardData.getData('text/html');
            let data = parseXML(xml);
            // if (!data) {
            //     return this.sheet.handlePasteData(e.clipboardData!.getData('json/pasteData'),e);
            // }
            this.handlePasteData(data, e);
        }
        if (this.sheet.selectionBoundRect) this.sheet.selectCell({
            row: this.sheet.selectionBoundRect.startRow,
            col: this.sheet.selectionBoundRect.startCol,
            clear: true
        });
    }
    handlePastePlaintext(text) {
        if (!this.sheet.selectionBoundRect) return;
        const { startRow, startCol } = this.sheet.selectionBoundRect;
        const clipboardData = text;
        const rowsData = clipboardData.split('\n');
        const changes = []; // To record changes for undo/redo
        for(let i = 0; i < rowsData.length; i++){
            const rowData = rowsData[i].split('\t');
            for(let j = 0; j < rowData.length; j++){
                const row = startRow + i;
                const col = startCol + j;
                if (row <= this.sheet.totalRowBounds && col <= this.sheet.totalColBounds) {
                    changes.push({
                        row,
                        col,
                        prevData: Object.assign({}, this.sheet.getCell(row, col)),
                        changeKind: 'valchange'
                    });
                    this.sheet.setText(row, col, rowData[j]);
                    this.sheet.renderCell(row, col);
                }
            }
        }
        // Record the changes in the undo stack
        if (changes.length > 0) this.sheet.historyManager.recordChanges(changes);
    }
    handlePasteData(text, e) {
        let pasteData;
        try {
            pasteData = JSON.parse(text);
        } catch  {
            this.handlePastePlaintext(e.clipboardData.getData('text/plain'));
            return;
        }
        const changes = [];
        for (let rect of this.sheet.getSelectionBoundRects()){
            const { startRow, startCol, endRow, endCol } = rect;
            const destCell = {
                row: startRow,
                col: startCol
            };
            const srcCell = pasteData.srcCell;
            const offsetRow = destCell.row - srcCell.row;
            const offsetCol = destCell.col - srcCell.col;
            const configs = pasteData.configs;
            for (let merge of pasteData.merges){
                const newMerge = {
                    ...merge
                };
                newMerge.startRow = newMerge.startRow + offsetRow;
                newMerge.endRow = newMerge.endRow + offsetRow;
                newMerge.startCol = newMerge.startCol + offsetCol;
                newMerge.endCol = newMerge.endCol + offsetCol;
                this.sheet.mergeSelectedCells(newMerge, false);
                changes.push({
                    changeKind: 'merge',
                    bounds: {
                        ...newMerge
                    }
                });
            }
            for (let config of configs){
                config.row = config.row + offsetRow;
                config.col = config.col + offsetCol;
                config._id = null;
                changes.push({
                    row: config.row,
                    col: config.col,
                    prevData: Object.assign({}, this.sheet.getCell(config.row, config.col)),
                    changeKind: 'valchange'
                });
                this.sheet.putCellObj(config.row, config.col, config);
                this.sheet.renderCell(config.row, config.col);
            }
            if (changes.length > 0) this.sheet.historyManager.recordChanges(changes);
        }
    }
}

},{"./utils":"8uhD9","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"g9HFo":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Block", ()=>Block);
class Block {
    constructor(data, sheet){
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
    static{
        this.createCanvas = (idx = null)=>{
            // const canvas = this.pool.pop() || document.createElement('canvas');
            const canvas = document.createElement('canvas');
            canvas.className = 'canvas-block';
            // canvas.style.background = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`;
            return canvas;
        };
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
        for(let i = 0; i < count; i++){
            let _startRow = i < 2 ? startRow : rowMid;
            let _startCol = i % 2 === 0 ? startCol : colMid;
            let _endRow = i >= 2 || fullH ? endRow : rowMid;
            let _endCol = i % 2 === 1 || fullW ? endCol : colMid;
            this.subBlocks.push(new SubBlock({
                startRow: _startRow,
                startCol: _startCol,
                endRow: _endRow,
                endCol: _endCol
            }, this, i));
        }
    }
    render() {}
}
class SubBlock {
    constructor(dims, block, index){
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
    setBlockCtx(ctx) {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333333';
        // const scaler = 88;
        // ctx.strokeStyle = `hsl(0,0%,88%)`;
        ctx.strokeStyle = '#dddddd';
        ctx.lineWidth = 1;
    }
    renderGridlines(ctx) {
        let y;
        let x = 0;
        if (this.sheet.gridlinesOn && this.sheet.quality() !== 'performance') {
            ctx.save();
            const dpr = this.sheet.effectiveDevicePixelRatio();
            for(let row = this.startRow; row < this.endRow; row++){
                // Align stroke to half-pixel so 1px lines render sharply
                y = Math.round(this.sheet.metrics.getHeightBetweenRows(row, this.startRow) * dpr) + 0.5;
                ctx.beginPath();
                ctx.moveTo(0.5, y);
                ctx.lineTo(this.canvas.width - 0.5, y);
                ctx.stroke();
            }
            // draw col grid lines
            for(let col = this.startCol; col < this.endCol; col++){
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
        for(let col = this.startCol; col < this.endCol; col++)for(let row = this.startRow; row < this.endRow; row++)this.sheet.renderCell(row, col, true);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"gYAB7":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class HistoryManager {
    constructor(sheet){
        this.sheet = sheet;
        this.changes = [];
        this.undoStack = [];
        this.redoStack = [];
        this.MAX_HISTORY_SIZE = 100;
    }
    recordChanges(changes) {
        this.redoStack = [];
        // Add the change to the undo stack
        this.undoStack.push(changes);
        // Limit the size of the undo stack
        if (this.undoStack.length > this.MAX_HISTORY_SIZE) this.undoStack.shift(); // Remove the oldest change
    }
    flushChanges() {
        this.recordChanges(this.changes);
        this.changes = [];
    }
    undo() {
        if (this.undoStack.length === 0) return; // Nothing to undo
        const changes = this.undoStack.pop(); // Get the last change
        const redoChanges = [];
        const updatedCells = [];
        let rerender = false;
        for (const change of changes){
            const { row, col, previousValue, changeKind, prevData } = change;
            if (changeKind === 'merge') {
                this.sheet.unmergeSelectedCells(change.bounds, false);
                rerender = true;
                redoChanges.push({
                    changeKind: 'unmerge',
                    bounds: change.bounds
                });
            } else if (changeKind === 'unmerge') {
                this.sheet.mergeSelectedCells(change.bounds, false);
                rerender = true;
                redoChanges.push({
                    changeKind: 'merge',
                    bounds: change.bounds
                });
            } else if (changeKind === 'deleteEntireRow') {
                this.sheet.insertRow(change.row, change.rowData, false, change.heightOverride);
                rerender = true;
                // this.data.addRow(change.row, change.rowData);
                redoChanges.push({
                    changeKind: 'deleteEntireRow',
                    row: change.row,
                    rowData: change.rowData,
                    heightOverride: change.heightOverride
                });
            } else if (changeKind === 'deleteEntireCol') {
                this.sheet.insertCol(change.col, change.colData, false, change.widthOverride);
                rerender = true;
                redoChanges.push({
                    changeKind: 'deleteEntireCol',
                    col: change.col,
                    colData: change.colData,
                    widthOverride: change.widthOverride
                });
            } else if (changeKind === 'insertEntireRow') {
                this.sheet.deleteRow(change.row, false);
                rerender = true;
                redoChanges.push({
                    changeKind: 'insertEntireRow',
                    row: change.row
                });
            } else if (changeKind === 'insertEntireCol') {
                this.sheet.deleteCol(change.col, false);
                rerender = true;
                redoChanges.push({
                    changeKind: 'insertEntireCol',
                    col: change.col
                });
            } else if (changeKind === 'widthOverrideUpdate') {
                const prev = this.sheet.widthOverrides[change.col];
                this.sheet.setWidthOverride(change.col, change.value);
                this.sheet.updateWidthAccum();
                this.sheet.headerIdentifiers.renderHeaders();
                rerender = true;
                redoChanges.push({
                    changeKind: 'widthOverrideUpdate',
                    col: change.col,
                    value: prev
                });
            } else if (changeKind === 'heightOverrideUpdate') {
                const prev = this.sheet.heightOverrides[change.row];
                this.sheet.setHeightOverride(change.row, change.value);
                this.sheet.updateHeightAccum();
                this.sheet.rowNumbers.renderRowNumbers();
                rerender = true;
                redoChanges.push({
                    changeKind: 'heightOverrideUpdate',
                    row: change.row,
                    value: prev
                });
            } else if (changeKind === 'valchange') {
                // Record the current value for redo
                const cell = this.sheet.getCell(row, col);
                prevData._id = cell._id; // Preserve cell ID
                redoChanges.push({
                    row,
                    col,
                    prevData: Object.assign({}, cell),
                    changeKind: 'valchange'
                });
                // Revert the cell to its previous value
                if (change.attr) this.sheet.setCell(row, col, change.attr, prevData[change.attr]);
                else this.sheet.putCellObj(row, col, prevData);
                updatedCells.push([
                    row,
                    col
                ]);
            } else console.log('UNHANDLED UNDO:', changeKind);
        }
        this.redoStack.push(redoChanges);
        if (rerender) this.sheet.forceRerender();
        else this.sheet.rerenderCells(updatedCells);
        // this.sheet.updateSelection();
        if (this.sheet.selectionBoundRect) this.sheet.selectCell({
            row: this.sheet.selectionBoundRect.startRow,
            col: this.sheet.selectionBoundRect.startCol,
            clear: true
        });
    }
    redo() {
        if (this.redoStack.length === 0) return; // Nothing to redo
        const changes = this.redoStack.pop(); // Get the last undone change
        const undoChanges = [];
        const updatedCells = [];
        let rerender = false;
        for (const change of changes){
            const { row, col, newValue, previousValue, changeKind, prevData } = change;
            if (changeKind === 'unmerge') {
                this.sheet.mergeSelectedCells(change.bounds, false);
                rerender = true;
                undoChanges.push({
                    changeKind: 'merge',
                    bounds: change.bounds
                });
            } else if (changeKind === 'merge') {
                this.sheet.unmergeSelectedCells(change.bounds, false);
                rerender = true;
                undoChanges.push({
                    changeKind: 'unmerge',
                    bounds: change.bounds
                });
            } else if (changeKind === 'deleteEntireRow') {
                this.sheet.deleteRow(change.row, false);
                rerender = true;
                undoChanges.push({
                    changeKind: 'deleteEntireRow',
                    row: change.row,
                    rowData: change.rowData,
                    heightOverride: change.heightOverride
                });
            } else if (changeKind === 'deleteEntireCol') {
                this.sheet.deleteCol(change.col, false);
                rerender = true;
                undoChanges.push({
                    changeKind: 'deleteEntireCol',
                    col: change.col,
                    colData: change.colData,
                    widthOverride: change.widthOverride
                });
            } else if (changeKind === 'insertEntireRow') {
                this.sheet.insertRow(change.row, null, false);
                rerender = true;
                undoChanges.push({
                    changeKind: 'insertEntireRow',
                    row: change.row
                });
            } else if (changeKind === 'insertEntireCol') {
                this.sheet.insertCol(change.col, null, false);
                rerender = true;
                undoChanges.push({
                    changeKind: 'insertEntireCol',
                    col: change.col
                });
            } else if (changeKind === 'widthOverrideUpdate') {
                const prev = this.sheet.widthOverrides[change.col];
                this.sheet.setWidthOverride(change.col, change.value);
                this.sheet.updateWidthAccum();
                this.sheet.headerIdentifiers.renderHeaders();
                rerender = true;
                undoChanges.push({
                    changeKind: 'widthOverrideUpdate',
                    col: change.col,
                    value: prev
                });
            } else if (changeKind === 'heightOverrideUpdate') {
                const prev = this.sheet.heightOverrides[change.row];
                this.sheet.setHeightOverride(change.row, change.value);
                this.sheet.updateHeightAccum();
                this.sheet.rowNumbers.renderRowNumbers();
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
                    prevData: Object.assign({}, this.sheet.getCell(row, col)),
                    newValue,
                    changeKind: 'valchange'
                });
                // Apply the new value to the cell
                if (change.attr) this.sheet.setCell(row, col, change.attr, prevData[change.attr]);
                else this.sheet.putCellObj(row, col, prevData);
                updatedCells.push([
                    row,
                    col
                ]);
            } else console.log('UNHANDLED REDO:', changeKind);
        }
        this.undoStack.push(undoChanges);
        if (rerender) this.sheet.forceRerender();
        else this.sheet.rerenderCells(updatedCells);
        // this.sheet.updateSelection();
        if (this.sheet.selectionBoundRect) this.sheet.selectCell({
            row: this.sheet.selectionBoundRect.startRow,
            col: this.sheet.selectionBoundRect.startCol,
            clear: true
        });
    }
}
exports.default = HistoryManager;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"b3xq5":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("./utils");
var _scrollIntoView = require("../../packages/scrollIntoView");
var _scrollIntoViewDefault = parcelHelpers.interopDefault(_scrollIntoView);
class KeyboardHandler {
    constructor(sheet){
        this.sheet = sheet;
    }
    async onKeyDown(e) {
        const formulaFocus = this.sheet.formulaBar?.isEditing;
        const isEditingCellSelect = this.sheet.formulaBar?.isEditingCellSelect;
        const isLocked = this.sheet.editingCell || formulaFocus || isEditingCellSelect;
        const key = e.key.toLowerCase();
        if (key === 'f2' && this.sheet.selectionStart) {
            e.preventDefault();
            if (isLocked) return;
            this.sheet.startCellEdit(this.sheet.selectionStart.row, this.sheet.selectionStart.col);
        } else if (key === 'f3') {
            if (isLocked) return;
            this.sheet.openFormatMenu();
            e.preventDefault();
        } else if (key === 'escape' && this.sheet.editInput.style.display !== 'none') this.sheet.cancelCellEdit();
        else if (key === 'delete') {
            if (isLocked) return;
            this.sheet.clearSelectedCells();
        } else if (key === 'x' && e.ctrlKey) {
            if (isLocked) return;
            document.execCommand('copy');
            this.sheet.clearSelectedCells();
            e.preventDefault();
        } else if (key === 'b' && e.ctrlKey) {
            if (isLocked) return;
            e.preventDefault();
            const selectedCells = this.sheet.getSelectedCells();
            this.sheet.setCellsMutate(selectedCells, (cell)=>{
                cell.bold = !cell.bold;
            });
            const c = selectedCells[0];
            if (c?.row == null) return;
            const value = this.sheet.getCell(c.row, c.col)?.bold || false;
            this.sheet.toolbar?.set('bold', value);
        } else if (key === 'v' && e.shiftKey && e.ctrlKey) {
            if (isLocked) return;
            const clipboardText = await navigator.clipboard.readText();
            this.sheet.pasteHandler.handlePastePlaintext(clipboardText);
        } else if (key === 'k' && e.ctrlKey) {
            if (isLocked) return;
            let cells = this.sheet.data.getAllCells();
            cells = cells.filter((cell)=>cell.hasOwnProperty('_dims') ? Object.keys(cell).length > 4 : Object.keys(cell).length > 3);
            console.log({
                cellHeight: this.sheet.cellHeight,
                cellWidth: this.sheet.cellWidth,
                mergedCells: this.sheet.mergedCells,
                autosize: this.sheet.options?.autosize ?? false,
                heightOverrides: Object.assign({}, this.sheet.heightOverrides),
                widthOverrides: Object.assign({}, this.sheet.widthOverrides),
                gridlinesOn: this.sheet.gridlinesOn,
                initialCells: cells
            });
            // data = this.data.
            e.preventDefault();
        } else if (key === 's' && e.ctrlKey) {
            if (isLocked) return;
            const data = this.sheet.data.save();
            const save = {
                mergedCells: this.sheet.mergedCells,
                heightOverrides: Object.assign({}, this.sheet.heightOverrides),
                widthOverrides: Object.assign({}, this.sheet.widthOverrides),
                gridlinesOn: this.sheet.gridlinesOn,
                data
            };
            // localStorage.setItem('data-save', data)
            localStorage.setItem('sheet-state', JSON.stringify(save));
            e.preventDefault();
        } else if (key === 'l' && e.ctrlKey) {
            if (isLocked) return;
            this.sheet.restoreSave();
            e.preventDefault();
        } else if (e.ctrlKey || e.metaKey) {
            if (isLocked) return;
            if (key === 'y' || e.shiftKey && key === 'z') {
                e.preventDefault(); // Prevent default behavior
                this.sheet.historyManager.redo();
            } else if (key === 'z') {
                e.preventDefault(); // Prevent default behavior (e.g., browser undo)
                this.sheet.historyManager.undo();
            }
        } else if (key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright' || key === 'enter' || key === 'tab') {
            if (!this.sheet.selectionEnd || isLocked) return;
            e.preventDefault();
            this.sheet.probe.style.display = 'block';
            this.handleArrowKeyDown(e);
        } else if (this.sheet.selectionStart && e.key?.length === 1) {
            if (isLocked) return;
            this.sheet.startCellEdit(this.sheet.selectionStart.row, this.sheet.selectionStart.col, e.key);
        }
    }
    handleArrowKeyDown(e) {
        if (!this.sheet.selectionEnd || !this.sheet.selectionStart) return;
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
            ],
            'Tab': e.shiftKey ? [
                0,
                -1
            ] : [
                0,
                1
            ]
        };
        const curMerge = this.sheet.getMerge(this.sheet.selectionEnd.row, this.sheet.selectionEnd.col);
        let row = this.sheet.selectionEnd.row + deltas[e.key][0];
        let col = this.sheet.selectionEnd.col + deltas[e.key][1];
        const merge = this.sheet.getMerge(row, col);
        const corner = [
            row > this.sheet.selectionStart.row ? 'b' : 't',
            col > this.sheet.selectionStart.col ? 'r' : 'l'
        ];
        if (e.shiftKey) {
            // TODO: do in less bruteforce way
            const prevRect = JSON.stringify(this.sheet.selectionBoundRect);
            if (e.key === 'ArrowUp' || e.key === 'Enter') {
                let curRect;
                while(row > 0){
                    curRect = this.sheet.getBoundingRectCells(this.sheet.selectionStart.row, this.sheet.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    row--;
                }
            } else if (e.key === 'ArrowDown') {
                let curRect;
                while(row < this.sheet.totalRowBounds){
                    curRect = this.sheet.getBoundingRectCells(this.sheet.selectionStart.row, this.sheet.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    row++;
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'Tab') {
                let curRect;
                while(col > 0){
                    curRect = this.sheet.getBoundingRectCells(this.sheet.selectionStart.row, this.sheet.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    col--;
                }
            } else if (e.key === 'ArrowRight') {
                let curRect;
                while(col < this.sheet.totalColBounds){
                    curRect = this.sheet.getBoundingRectCells(this.sheet.selectionStart.row, this.sheet.selectionStart.col, row, col);
                    if (prevRect !== JSON.stringify(curRect)) break;
                    col++;
                }
            }
        } else if (merge && merge === curMerge) {
            if (e.key === 'ArrowUp') row = merge.startRow - 1;
            else if (e.key === 'ArrowDown' || e.key === 'Enter') row = merge.endRow + 1;
            else if (e.key === 'ArrowLeft') col = merge.startCol - 1;
            else if (e.key === 'ArrowRight' || e.key === 'Tab') col = merge.endCol + 1;
        }
        row = Math.max(0, row);
        col = Math.max(0, col);
        if (e.shiftKey || (0, _utils.arrows).has(e.key)) this.sheet.lastCol = col;
        else if (e.key === 'Enter') col = this.sheet.lastCol;
        row = Math.min(row, this.sheet.totalRowBounds);
        col = Math.min(col, this.sheet.totalColBounds);
        if (e.shiftKey && e.key !== 'Enter') this.sheet.selectionEnd = {
            row,
            col
        };
        this.sheet.selectCell({
            row,
            col,
            continuation: e.shiftKey && ![
                'Enter',
                'Tab'
            ].includes(e.key)
        });
        if (this.sheet.selectedCell) {
            this.sheet.selectedCell.appendChild(this.sheet.probe);
            this.sheet.probe.style.top = '';
            this.sheet.probe.style.left = '';
            this.sheet.probe.style.bottom = '';
            this.sheet.probe.style.right = '';
            if ((0, _utils.arrows).has(e.key) && e.shiftKey) {
                this.sheet.probe.style.width = `${this.sheet.metrics.getCellWidth(col) + 20}px`;
                this.sheet.probe.style.height = `${this.sheet.metrics.getCellHeight(row) + 20}px`;
                corner.forEach((side)=>{
                    if (side === 't') this.sheet.probe.style.top = `${-20 - this.sheet.headerRowHeight}px`;
                    else if (side === 'b') this.sheet.probe.style.bottom = '-20px';
                    else if (side === 'l') this.sheet.probe.style.left = `${-20 - this.sheet.rowNumberWidth}px`;
                    else if (side === 'r') this.sheet.probe.style.right = '-20px';
                });
                this.sheet.probe.style.display = 'block';
                (0, _scrollIntoViewDefault.default)(this.sheet.probe, {
                    scrollMode: 'if-needed',
                    block: 'nearest',
                    inline: 'nearest'
                });
            } else {
                let w = this.sheet.selectedCell.getBoundingClientRect().width + 50;
                let h = this.sheet.selectedCell.getBoundingClientRect().height + 40;
                this.sheet.probe.style.width = `${w + this.sheet.rowNumberWidth}px`;
                this.sheet.probe.style.height = `${h + this.sheet.headerRowHeight}px`;
                this.sheet.probe.style.left = `-${w / 4 + this.sheet.rowNumberWidth}px`;
                this.sheet.probe.style.top = `-${h / 4 + this.sheet.headerRowHeight}px`;
                this.sheet.probe.style.display = 'block';
                (0, _scrollIntoViewDefault.default)(this.sheet.probe, {
                    scrollMode: 'if-needed',
                    block: 'nearest',
                    inline: 'nearest'
                });
            }
        }
    }
}
exports.default = KeyboardHandler;

},{"./utils":"6XV8Q","../../packages/scrollIntoView":"4L1h3","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"6XV8Q":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "arrows", ()=>arrows);
const arrows = new Set([
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight'
]);

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"gtl53":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class Metrics {
    constructor(sheet){
        this.sheet = sheet;
    }
    getWidthBetweenColumns(col1, col2) {
        let accumulatedWidth = 0;
        for(let _col = col1; _col < col2; _col++){
            const colWidth = this.getColWidth(_col);
            accumulatedWidth += colWidth;
        }
        return accumulatedWidth;
    }
    getMergeWidth(merge) {
        return this.getWidthBetweenColumns(merge.startCol, merge.endCol + 1);
    }
    getMergeHeight(merge) {
        return this.getHeightBetweenRows(merge.startRow, merge.endRow + 1);
    }
    getHeightBetweenRows(startRow, endRow) {
        if (endRow < startRow) {
            let tmp = endRow;
            endRow = startRow;
            startRow = tmp;
        }
        return this.sheet.heightAccum[endRow] - this.sheet.heightAccum[startRow];
    }
    getColWidth(col) {
        if (col in this.sheet.widthOverrides) return this.sheet.widthOverrides[col] * this.sheet.zoomLevel;
        if (col in this.sheet.maxWidthInCol && this.sheet.maxWidthInCol[col].max > this.sheet.cellWidth) return this.sheet.maxWidthInCol[col].max * this.sheet.zoomLevel;
        return this.sheet.cellWidth * this.sheet.zoomLevel;
    }
    getCellWidth(a, b = null) {
        let col = a;
        if (typeof b === 'number') col = b;
        return this.getColWidth(col);
    }
    rowHeight(row) {
        return this.sheet.heightOverrides[row] != null ? this.sheet.heightOverrides[row] * this.sheet.zoomLevel : this.sheet.cellHeight * this.sheet.zoomLevel;
    }
    getCellHeight(row, col = null) {
        return this.rowHeight(row);
    }
    getHeight(row, col = null) {
        return this.rowHeight(row);
    }
    getWidthOffset(col, withStickyLeftBar = false) {
        return this.sheet.widthAccum[col] - (withStickyLeftBar ? 0 : this.sheet.rowNumberWidth);
    }
    getHeightOffset(row, withStickyHeader = false) {
        return this.sheet.heightAccum[row] - (withStickyHeader ? 0 : this.sheet.headerRowHeight);
    }
    getWidthOverride(col) {
        if (col in this.sheet.widthOverrides) return this.sheet.widthOverrides[col] * this.sheet.zoomLevel;
    }
    getHeightOverride(row) {
        if (row in this.sheet.heightOverrides) return this.sheet.heightOverrides[row] * this.sheet.zoomLevel;
    }
    getWidthHeight(row, col) {
        const merged = this.sheet.getMerge(row, col);
        let width, height;
        if (merged) width = this.getWidthBetweenColumns(merged.startCol, merged.endCol + 1), height = this.getHeightBetweenRows(merged.startRow, merged.endRow + 1);
        else width = this.getCellWidth(row, col), height = this.getHeight(row, col);
        return {
            width,
            height
        };
    }
    getCellCoordsContainer(row, col) {
        const merge = this.sheet.getMerge(row, col);
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
        const block = this.sheet.getSubBlock(row, col);
        // if (!block) return null;
        const merge = this.sheet.getMerge(row, col);
        let left, top, width, height;
        if (merge) {
            const cell = this.sheet.getCellOrMerge(row, col);
            // check not in bounds
            const srcblock = this.sheet.getSubBlock(row, col);
            const mergeStartBlock = this.sheet.getSubBlock(cell.row, cell.col);
            if (srcblock !== mergeStartBlock) {
                row = merge.startRow, col = merge.startCol;
                width = this.getMergeWidth(merge);
                height = this.getMergeHeight(merge);
                const _width = this.getWidthBetweenColumns(srcblock.startCol, merge.endCol + 1);
                const _height = this.getHeightBetweenRows(srcblock.startRow, merge.endRow + 1);
                left = _width - this.getMergeWidth(merge);
                top = _height - this.getMergeHeight(merge);
            } else {
                left = this.getWidthBetweenColumns(block.startCol, merge.startCol);
                top = this.getHeightBetweenRows(block.startRow, merge.startRow);
                width = this.getMergeWidth(merge);
                height = this.getMergeHeight(merge);
                row = merge.startRow, col = merge.startCol;
            }
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
    getTopLeftBounds() {
        const rect = this.sheet.container.getBoundingClientRect();
        const scrollLeft = this.sheet.container.scrollLeft;
        const scrollTop = this.sheet.container.scrollTop;
        // Adjust for header and row numbers
        let x = Math.max(0, this.sheet.rowNumberWidth + 8 - scrollLeft) - rect.left + scrollLeft - this.sheet.rowNumberWidth; // 50 for row numbers
        let y = this.sheet.headerRowHeight + 8 - rect.top + scrollTop - this.sheet.headerRowHeight;
        // console.log(x,y)
        x = scrollLeft;
        y = scrollTop;
        // console.log(scrollLeft,scrollTop)
        if (x < 0 || y < 0) return {
            row: -1,
            col: -1
        };
        // Find column
        let col = this.bsearch(this.sheet.widthAccum, x + this.sheet.rowNumberWidth) - 1;
        // Find row
        const row = this.bsearch(this.sheet.heightAccum, y + this.sheet.headerRowHeight) - 1;
        return {
            row: Math.min(row, this.sheet.totalRowBounds - 1),
            col: Math.min(col, this.sheet.totalColBounds - 1)
        };
    }
    inVisibleBounds(row, col) {
        const { row: visStartRow, col: visStartCol } = this.getTopLeftBounds();
        const { row: visEndRow, col: visEndCol } = this.getBottomRightBounds();
        return row >= visStartCol && row <= visEndRow && col >= visStartCol && col <= visEndCol;
    }
    calculateVisibleRange() {
        const { row: visStartRow, col: visStartCol } = this.getTopLeftBounds();
        const { row: visEndRow, col: visEndCol } = this.getBottomRightBounds();
        this.sheet.visibleStartRow = visStartRow;
        this.sheet.visibleStartCol = visStartCol;
        this.sheet.visibleEndRow = visEndRow;
        this.sheet.visibleEndCol = visEndCol;
    }
    getBottomRightBounds() {
        const rect = this.sheet.container.getBoundingClientRect();
        const scrollLeft = this.sheet.container.scrollLeft;
        const scrollTop = this.sheet.container.scrollTop;
        // Adjust for header and row numbers
        const x = rect.right - rect.left + scrollLeft - (this.sheet.rowNumberWidth + 8);
        const y = rect.bottom - rect.top + scrollTop - this.sheet.headerRowHeight;
        if (x < 0 || y < 0) return {
            row: -1,
            col: -1
        };
        // Find column
        let col = this.bsearch(this.sheet.widthAccum, x + this.sheet.rowNumberWidth) - 1;
        // Find row
        let row = this.bsearch(this.sheet.heightAccum, y + this.sheet.headerRowHeight) - 1;
        row = Math.min(row + 1, this.sheet.totalRowBounds);
        col = Math.min(col + 1, this.sheet.totalColBounds);
        // if (this.maxRows) row = Math.min(row, this.maxRows);
        // if (this.maxCols) col = Math.min(col, this.maxCols);
        return {
            row,
            col
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
}
exports.default = Metrics;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"7XKRd":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class RowNumbers {
    constructor(sheet){
        this.sheet = sheet;
        this.rowNumberContainer = this.sheet._container.querySelector('.row-number-container');
        if (this.sheet.options.cellHeaders !== false) {
            this.rowNumberContainer.style.width = `${this.sheet.rowNumberWidth}px`;
            this.rowNumberContainer.style.lineHeight = `${this.sheet.headerRowHeight}px`;
        }
        // this.rowNumberContainer = sheet.rowNumberContainer;
        this.rowNumberContainer.onmousedown = (e)=>{
            if (e.button !== 0) return;
            if (e.target.getAttribute('data-row') != null) this.sheet.draggingRow = {
                origTop: e.target.style.top,
                el: e.target,
                row: parseInt(e.target.getAttribute('data-row'))
            };
        };
        this.renderRowNumberPadder = document.createElement('div');
        this.renderRowNumberElems = document.createElement('div');
        this.renderRowNumberElems.style.position = 'relative';
        this.rowNumberContainer.appendChild(this.renderRowNumberPadder);
        this.rowNumberContainer.appendChild(this.renderRowNumberElems);
    }
    createRowNumber(label) {
        const el = document.createElement('div');
        el.className = 'row-number';
        // el.textContent = label;
        el.innerHTML = `<div>${label}</div>`;
        return el;
    }
    renderRowNumbers() {
        let sr = this.sheet.visibleStartRow;
        let totalHeight = 0;
        let ve = this.sheet.visibleEndRow;
        let diff = sr % this.sheet.blockRows;
        sr = sr - diff;
        ve = ve + (this.sheet.blockRows - ve % this.sheet.blockRows - 1);
        this.renderRowNumberPadder.style.height = `${this.sheet.metrics.getHeightOffset(sr)}px`;
        if (this.sheet.options.cellHeaders === false) {
            // let totalHeight = 0;
            // for (let row: any = 0; row <= this.sheet.totalRowBounds; row++) {
            //     totalHeight += this.sheet.metrics.rowHeight(row);
            // }
            // // this.totalHeight = totalHeight;
            // this.rowNumberContainer.style.height = `${totalHeight + 20}px`;
            this.rowNumberContainer.style.width = '1px';
            this.rowNumberContainer.style.position = 'absolute';
            this.rowNumberContainer.style.background = 'transparent';
            this.renderRowNumberPadder.style.height = `${this.sheet.metrics.getHeightOffset(ve)}px`;
            // this.renderRowNumberPadder.style.height = `${this.sheet.metrics.getHeightOffset(sr)}px`;
            // this.rowNumberContainer.style.height = `${this.sheet.metrics.getHeightOffset(sr)}px`;
            return;
        }
        this.renderRowNumberElems.innerHTML = '';
        for(let row = sr; row <= ve; row++){
            // if (row >= this.totalRows) break;
            const rowNumberEl = this.createRowNumber(row + 1);
            // rowNumberEl.textContent = row + 1;
            totalHeight += this.sheet.metrics.rowHeight(row);
            rowNumberEl.style.height = `${this.sheet.metrics.rowHeight(row)}px`;
            rowNumberEl.style.lineHeight = `${this.sheet.metrics.rowHeight(row)}px`;
            rowNumberEl.setAttribute('data-rnrow', row);
            this.renderRowNumberElems.appendChild(rowNumberEl);
            const rowNumberHandle = document.createElement('div');
            rowNumberHandle.className = 'row-handle';
            rowNumberHandle.setAttribute('data-row', row);
            rowNumberHandle.style.top = `${totalHeight - 5}px`;
            this.renderRowNumberElems.appendChild(rowNumberHandle);
        }
        // this.totalHeight = totalHeight;
        // const extra = (this.maxRows && this.totalRowBounds === this.maxRows-1) ? 0 : 20;
        const extra = 20;
        this.rowNumberContainer.style.height = `${this.sheet.metrics.getHeightOffset(ve + 1, true) + extra}px`; // extra pixels fixes slight alignment issue on scroll
    }
}
exports.default = RowNumbers;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"vcvFL":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class HeaderIdentifiers {
    constructor(sheet){
        this.sheet = sheet;
        this.headerContainer = this.sheet._container.querySelector('.header-container');
        this.headerContainer.innerHTML = `<div class="header-cell" style="width:${this.sheet.rowNumberWidth}px;"></div>`;
        this.headerContainer.onmousedown = (e)=>{
            if (e.button !== 0) return;
            if (e.target.getAttribute('data-col') != null) this.sheet.draggingHeader = {
                origLeft: e.target.style.left,
                el: e.target,
                col: parseInt(e.target.getAttribute('data-col'))
            };
        };
        if (this.sheet.options.cellHeaders !== false) this.headerContainer.style.lineHeight = `${this.sheet.headerRowHeight}px`;
        this.renderHeaderPadder = document.createElement('div');
        this.renderHeaderElems = document.createElement('div');
        this.renderHeaderElems.style.position = 'relative';
        this.headerContainer.appendChild(this.renderHeaderPadder);
        this.headerContainer.appendChild(this.renderHeaderElems);
    }
    renderHeaders() {
        let totalWidth = this.sheet.rowNumberWidth;
        let sc = this.sheet.visibleStartCol;
        let ec = this.sheet.visibleEndCol;
        let diff = sc % this.sheet.blockCols;
        sc = sc - diff;
        ec = ec + (this.sheet.blockCols - ec % this.sheet.blockCols - 1);
        this.renderHeaderPadder.style.width = `${this.sheet.metrics.getWidthOffset(sc)}px`;
        if (this.sheet.options.cellHeaders === false) {
            // let totalWidth = this.sheet.rowNumberWidth;
            // for (let col: any = 0; col <= this.sheet.totalColBounds; col++) {
            //     const width = this.sheet.metrics.getColWidth(col);
            //     totalWidth += width;
            // };
            // this.headerContainer.style.width = `${totalWidth + 10}px`;
            this.headerContainer.style.height = '1px';
            this.headerContainer.style.position = 'absolute';
            this.headerContainer.style.background = 'transparent';
            this.renderHeaderPadder.style.width = `${this.sheet.metrics.getWidthOffset(ec)}px`;
            return;
        }
        this.renderHeaderElems.innerHTML = `<div class="header-cell" style="width:${this.sheet.rowNumberWidth}px"></div>`; // empty first cell for corner
        for(let col = sc; col <= ec; col++){
            const width = this.sheet.metrics.getColWidth(col);
            totalWidth += width;
            let headerCell;
            // if (this.renderHeaderElems.children[(((col-sc)*2) + 1)]) {
            //     headerCell = this.renderHeaderElems.children[(((col-sc)*2) + 1)];       
            //     headerCell.classList.remove('col-selected');         
            // } else {
            headerCell = document.createElement('div');
            this.renderHeaderElems.appendChild(headerCell);
            headerCell.className = 'header-cell';
            // }
            headerCell.setAttribute('data-hccol', col);
            headerCell.textContent = this.sheet.getColumnName(col);
            headerCell.style.width = `${width}px`;
            let headerHandle;
            // if (this.renderHeaderElems.children[(((col-sc)*2) + 2)]) {
            //     headerHandle = this.renderHeaderElems.children[(((col-sc)*2) + 2)];                
            // } else {
            headerHandle = document.createElement('div');
            this.renderHeaderElems.appendChild(headerHandle);
            headerHandle.className = 'header-handle';
            headerHandle.style.height = `${this.sheet.headerRowHeight}px`;
            // }
            headerHandle.style.left = `${totalWidth - 8}px`;
            headerHandle.setAttribute('data-col', col);
        }
        // const extra = (this.maxCols && this.totalColBounds === this.maxCols-1) ? 0 : 10;
        const extra = this.sheet.rowNumberWidth;
        this.headerContainer.style.width = `${this.sheet.metrics.getWidthOffset(ec + 1) + extra}px`;
    }
}
exports.default = HeaderIdentifiers;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bhJkM":[function() {},{}]},["eZFTg","9Fk10"], "9Fk10", "parcelRequire69aa", {})

//# sourceMappingURL=gigaspreadsheet.c9112ede.js.map
