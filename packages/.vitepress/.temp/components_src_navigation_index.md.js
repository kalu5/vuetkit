import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Navigation","description":"","frontmatter":{},"headers":[],"relativePath":"components/src/navigation/index.md","filePath":"components/src/navigation/index.md"}');
const _sfc_main = { name: "components/src/navigation/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="navigation" tabindex="-1">Navigation <a class="header-anchor" href="#navigation" aria-label="Permalink to “Navigation”">​</a></h1><ul><li><p><a href="/vuecraft/components/src/navigation/useBreadcrumb/">useBreadcrumb</a></p></li><li><p><a href="/vuecraft/components/src/navigation/useDropdown/">useDropdown</a></p></li><li><p><a href="/vuecraft/components/src/navigation/useMenu/">useMenu</a></p></li><li><p><a href="/vuecraft/components/src/navigation/useSteps/">useSteps</a></p></li><li><p><a href="/vuecraft/components/src/navigation/useTabs/">useTabs</a></p></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/src/navigation/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
