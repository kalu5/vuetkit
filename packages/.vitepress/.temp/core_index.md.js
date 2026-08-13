import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Composables","description":"","frontmatter":{},"headers":[],"relativePath":"core/index.md","filePath":"core/README.md"}');
const _sfc_main = { name: "core/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="composables" tabindex="-1">Composables <a class="header-anchor" href="#composables" aria-label="Permalink to “Composables”">​</a></h1><h2 id="description" tabindex="-1">Description <a class="header-anchor" href="#description" aria-label="Permalink to “Description”">​</a></h2><p>Collection of business development Composable Utilities for Vue3 projects.</p><h2 id="composable-utilities-list" tabindex="-1">Composable Utilities List <a class="header-anchor" href="#composable-utilities-list" aria-label="Permalink to “Composable Utilities List”">​</a></h2><h3 id="network" tabindex="-1">Network <a class="header-anchor" href="#network" aria-label="Permalink to “Network”">​</a></h3><ul><li><p><a href="/vuecraft/core/src/network/useRequest/">useRequest</a></p></li><li><p><a href="/vuecraft/core/src/network/useSocket/">useSocket</a></p></li></ul><h3 id="file" tabindex="-1">File <a class="header-anchor" href="#file" aria-label="Permalink to “File”">​</a></h3><ul><li><a href="/vuecraft/core/src/file/useAsyncDownloadFile/">useAsyncDownloadFile</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("core/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
