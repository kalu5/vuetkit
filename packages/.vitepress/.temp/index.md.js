import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"VueCraft","text":"Collection of business development tools for Vue3 projects","tagline":"Collect commonly used Composable Utilities, Shared Utilities, and Composable Components in development.","image":"/images/logo-tech.svg","actions":[{"theme":"brand","text":"Get Started","link":"/guide/get-started"},{"theme":"alt","text":"useUtils","link":"/core/index"},{"theme":"alt","text":"sharedUtils","link":"/shared/index"},{"theme":"alt","text":"useComponents","link":"/components/index"}]},"features":[{"icon":"🚀","title":"Composable Utilities","details":"Collect common Composable Utilities. e.g. useRequest, useAsyncDownloadFile, etc."},{"icon":"🛠️","title":"Shared Utilities","details":"Collect common Shared Utilities. e.g. downloadFile, getDataType,etc."},{"icon":"🎛","title":"Composable Components","details":"Collect common Composable Components. e.g. useForm, useAsyncConfirm, etc."}]},"headers":[],"relativePath":"index.md","filePath":"index.md"}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
