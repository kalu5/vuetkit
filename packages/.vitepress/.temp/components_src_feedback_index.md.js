import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Feedback","description":"","frontmatter":{},"headers":[],"relativePath":"components/src/feedback/index.md","filePath":"components/src/feedback/index.md"}');
const _sfc_main = { name: "components/src/feedback/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="feedback" tabindex="-1">Feedback <a class="header-anchor" href="#feedback" aria-label="Permalink to “Feedback”">​</a></h1><ul><li><p><a href="/vuecraft/components/src/feedback/useMessage/">useMessage</a></p></li><li><p><a href="/vuecraft/components/src/feedback/useAsyncConfirm/">useAsyncConfirm</a></p></li><li><p><a href="/vuecraft/components/src/feedback/useDialog/">useDialog</a></p></li><li><p><a href="/vuecraft/components/src/feedback/useNotification/">useNotification</a></p></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/src/feedback/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
