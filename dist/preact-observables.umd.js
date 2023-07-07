var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("@preact/signals-core"), require("nu-observables")) : typeof define === "function" && define.amd ? define(["exports", "@preact/signals-core", "nu-observables"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global["preact-observables"] = {}, global.signalsCore, global.nuObservables));
})(this, function(exports2, signalsCore, nuObservables) {
  "use strict";
  class PreactObjectAdministration extends nuObservables.ObjectAdministration {
  }
  __publicField(PreactObjectAdministration, "proxyTraps", Object.assign(
    {},
    nuObservables.ObjectAdministration.proxyTraps,
    {
      get(target, prop, proxy) {
        var _a;
        if (!(prop in target) && (typeof prop === "string" || typeof prop === "number") && String(prop)[0] === "$") {
          return getSignal(proxy, prop.substring(1));
        }
        return (_a = nuObservables.ObjectAdministration.proxyTraps.get) == null ? void 0 : _a.apply(
          null,
          arguments
        );
      }
    }
  ));
  const graph = nuObservables.createGraph({
    batch: signalsCore.batch,
    effect: signalsCore.effect,
    createComputed(fn, context) {
      const c = signalsCore.computed(fn.bind(context));
      return {
        node: c,
        get() {
          return c.value;
        }
      };
    },
    createAtom() {
      let value = 0;
      const s = signalsCore.signal(value);
      return {
        node: s,
        reportChanged() {
          s.value = ++value;
          return value;
        },
        reportObserved() {
          return s.value;
        }
      };
    }
  });
  nuObservables.setAdministrationType({ object: PreactObjectAdministration }, graph);
  function observable(obj) {
    return nuObservables.getObservable(obj, graph);
  }
  function source(obj) {
    return nuObservables.getSource(obj);
  }
  class Observable {
    constructor() {
      return nuObservables.getObservableClassInstance(this, graph);
    }
  }
  function reportChanged(obj) {
    const adm = nuObservables.getAdministration(obj);
    adm.reportChanged();
    return obj;
  }
  function reportObserved(obj, opts) {
    const adm = nuObservables.getAdministration(obj);
    adm.reportObserved(opts == null ? void 0 : opts.deep);
    return obj;
  }
  const signalMap = /* @__PURE__ */ new WeakMap();
  function getSignal(obj, key) {
    const node = nuObservables.getInternalNode(obj, key);
    if (node instanceof signalsCore.Signal) {
      let signal2 = signalMap.get(node);
      if (!signal2) {
        signal2 = new signalsCore.Signal();
        Object.defineProperties(signal2, {
          value: {
            get() {
              return obj[key];
            },
            set(v) {
              return obj[key] = v;
            }
          },
          peek: {
            value() {
              return source(obj)[key];
            }
          }
        });
        signalMap.set(node, signal2);
      }
      return signal2;
    }
    return node;
  }
  Object.defineProperty(exports2, "isObservable", {
    enumerable: true,
    get: () => nuObservables.isObservable
  });
  exports2.Observable = Observable;
  exports2.getSignal = getSignal;
  exports2.graph = graph;
  exports2.observable = observable;
  exports2.reportChanged = reportChanged;
  exports2.reportObserved = reportObserved;
  exports2.source = source;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
});
