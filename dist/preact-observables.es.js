var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { batch, effect, computed, signal, Signal } from "@preact/signals-core";
import { ObjectAdministration, createGraph, setAdministrationType, getInternalNode, getObservable, getSource, getObservableClassInstance, getAdministration } from "nu-observables";
import { isObservable } from "nu-observables";
class PreactObjectAdministration extends ObjectAdministration {
}
__publicField(PreactObjectAdministration, "proxyTraps", Object.assign(
  {},
  ObjectAdministration.proxyTraps,
  {
    get(target, prop, proxy) {
      var _a;
      if (!(prop in target) && (typeof prop === "string" || typeof prop === "number") && String(prop)[0] === "$") {
        return getSignal(proxy, prop.substring(1));
      }
      return (_a = ObjectAdministration.proxyTraps.get) == null ? void 0 : _a.apply(
        null,
        arguments
      );
    }
  }
));
const graph = createGraph({
  batch,
  effect,
  createComputed(fn, context) {
    const c = computed(fn.bind(context));
    return {
      node: c,
      get() {
        return c.value;
      }
    };
  },
  createAtom() {
    let value = 0;
    const s = signal(value);
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
setAdministrationType({ object: PreactObjectAdministration }, graph);
function observable(obj) {
  return getObservable(obj, graph);
}
function source(obj) {
  return getSource(obj);
}
class Observable {
  constructor() {
    return getObservableClassInstance(this, graph);
  }
}
function reportChanged(obj) {
  const adm = getAdministration(obj);
  adm.reportChanged();
  return obj;
}
function reportObserved(obj, opts) {
  const adm = getAdministration(obj);
  adm.reportObserved(opts == null ? void 0 : opts.deep);
  return obj;
}
const signalMap = /* @__PURE__ */ new WeakMap();
function getSignal(obj, key) {
  const node = getInternalNode(obj, key);
  if (node instanceof Signal) {
    let signal2 = signalMap.get(node);
    if (!signal2) {
      signal2 = new Signal();
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
export {
  Observable,
  getSignal,
  graph,
  isObservable,
  observable,
  reportChanged,
  reportObserved,
  source
};
