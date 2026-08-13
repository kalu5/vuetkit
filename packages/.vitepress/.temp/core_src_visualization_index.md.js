import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Visualization","description":"","frontmatter":{},"headers":[],"relativePath":"core/src/visualization/index.md","filePath":"core/src/visualization/index.md"}');
const _sfc_main = { name: "core/src/visualization/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="visualization" tabindex="-1">Visualization <a class="header-anchor" href="#visualization" aria-label="Permalink to “Visualization”">​</a></h1><ul><li><p>Large screen scaling solution</p></li><li><p><a href="/vuecraft/core/src/visualization/useScale/">useScale</a></p></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("core/src/visualization/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
