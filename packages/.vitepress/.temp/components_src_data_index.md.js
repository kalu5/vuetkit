import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Data","description":"","frontmatter":{},"headers":[],"relativePath":"components/src/data/index.md","filePath":"components/src/data/index.md"}');
const _sfc_main = { name: "components/src/data/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="data" tabindex="-1">Data <a class="header-anchor" href="#data" aria-label="Permalink to “Data”">​</a></h1><ul><li><p><a href="/vuecraft/components/src/data/useCarousel/">useCarousel</a></p></li><li><p><a href="/vuecraft/components/src/data/useDescriptions/">useDescriptions</a></p></li><li><p><a href="/vuecraft/components/src/data/useCollapse/">useCollapse</a></p></li><li><p><a href="/vuecraft/components/src/data/useSegmented/">useSegmented</a></p></li><li><p><a href="/vuecraft/components/src/data/useTreeV2/">useTreeV2</a></p></li><li><p><a href="/vuecraft/components/src/data/useTree/">useTree</a></p></li><li><p><a href="/vuecraft/components/src/data/useTimeline/">useTimeline</a></p></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/src/data/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
