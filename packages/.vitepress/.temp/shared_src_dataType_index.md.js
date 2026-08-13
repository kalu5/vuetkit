import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"DataType","description":"","frontmatter":{},"headers":[],"relativePath":"shared/src/dataType/index.md","filePath":"shared/src/dataType/index.md"}');
const _sfc_main = { name: "shared/src/dataType/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="datatype" tabindex="-1">DataType <a class="header-anchor" href="#datatype" aria-label="Permalink to “DataType”">​</a></h1><ul><li>Get variable all data type</li></ul><p><a href="/vuecraft/shared/src/dataType/getDataType/">getDataType</a></p><ul><li>Check variable is object</li></ul><p><a href="/vuecraft/shared/src/dataType/isObj/">isObj</a></p><ul><li>Check variable is real object</li></ul><p><a href="/vuecraft/shared/src/dataType/realObj/">realObj</a></p><ul><li>Check variable is function</li></ul><p><a href="/vuecraft/shared/src/dataType/isFunc/">isFunc</a></p><ul><li>Check variable is array</li></ul><p><a href="/vuecraft/shared/src/dataType/isArr/">isArr</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("shared/src/dataType/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
