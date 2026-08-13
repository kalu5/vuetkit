import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Network","description":"","frontmatter":{},"headers":[],"relativePath":"core/src/network/index.md","filePath":"core/src/network/index.md"}');
const _sfc_main = { name: "core/src/network/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="network" tabindex="-1">Network <a class="header-anchor" href="#network" aria-label="Permalink to “Network”">​</a></h1><ul><li><p>handle async request</p></li><li><p><a href="/vuecraft/core/src/network/useRequest/">useRequest</a></p></li><li><p>handle websocket connection</p></li><li><p><a href="/vuecraft/core/src/network/useSocket/">useSocket</a></p></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("core/src/network/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
