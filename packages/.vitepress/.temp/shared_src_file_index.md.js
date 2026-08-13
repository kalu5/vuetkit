import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"File","description":"","frontmatter":{},"headers":[],"relativePath":"shared/src/file/index.md","filePath":"shared/src/file/index.md"}');
const _sfc_main = { name: "shared/src/file/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="file" tabindex="-1">File <a class="header-anchor" href="#file" aria-label="Permalink to “File”">​</a></h1><ul><li>Download file by file blob and file name</li></ul><p><a href="/vuecraft/shared/src/file/downloadFile/">downloadFile</a></p><ul><li>Get file extension name by file name</li></ul><p><a href="/vuecraft/shared/src/file/getFileExt/">getFileExt</a></p><ul><li>Get file media type by file extension name</li></ul><p><a href="/vuecraft/shared/src/file/getFileMediaTypeByExt/">getFileMediaTypeByExt</a></p><ul><li>Get commonly used file media types.</li></ul><p><a href="/vuecraft/shared/src/file/getFileMediaTypes/">getFileMediaTypes</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("shared/src/file/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
