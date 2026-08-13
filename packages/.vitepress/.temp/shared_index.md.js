import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Functions","description":"","frontmatter":{},"headers":[],"relativePath":"shared/index.md","filePath":"shared/README.md"}');
const _sfc_main = { name: "shared/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="functions" tabindex="-1">Functions <a class="header-anchor" href="#functions" aria-label="Permalink to “Functions”">​</a></h1><h2 id="description" tabindex="-1">Description <a class="header-anchor" href="#description" aria-label="Permalink to “Description”">​</a></h2><p>Collection of business development Shared Utilities for Vue3 projects.</p><h2 id="all-shared-utilities" tabindex="-1">All Shared Utilities <a class="header-anchor" href="#all-shared-utilities" aria-label="Permalink to “All Shared Utilities”">​</a></h2><h3 id="data-type" tabindex="-1">Data Type <a class="header-anchor" href="#data-type" aria-label="Permalink to “Data Type”">​</a></h3><ul><li><a href="/vuecraft/shared/src/dataType/getDataType/">getDataType</a></li><li><a href="/vuecraft/shared/src/dataType/isObj/">isObj</a></li><li><a href="/vuecraft/shared/src/dataType/realObj/">realObj</a></li><li><a href="/vuecraft/shared/src/dataType/isFunc/">isFunc</a></li><li><a href="/vuecraft/shared/src/dataType/isArr/">isArr</a></li></ul><h3 id="file" tabindex="-1">File <a class="header-anchor" href="#file" aria-label="Permalink to “File”">​</a></h3><ul><li><a href="/vuecraft/shared/src/file/downloadFile/">downloadFile</a></li><li><a href="/vuecraft/shared/src/file/getFileExt/">getFileExt</a></li><li><a href="/vuecraft/shared/src/file/getFileMediaTypeByExt/">getFileMediaTypeByExt</a></li><li><a href="/vuecraft/shared/src/file/getFileMediaTypes/">getFileMediaTypes</a></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("shared/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
