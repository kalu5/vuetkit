import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Composable Components","description":"","frontmatter":{},"headers":[],"relativePath":"components/index.md","filePath":"components/README.md"}');
const _sfc_main = { name: "components/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="composable-components" tabindex="-1">Composable Components <a class="header-anchor" href="#composable-components" aria-label="Permalink to “Composable Components”">​</a></h1><h2 id="description" tabindex="-1">Description <a class="header-anchor" href="#description" aria-label="Permalink to “Description”">​</a></h2><p>Collection of business development Composable Components for Vue3 + ElementPlus projects.</p><h2 id="all-composable-components" tabindex="-1">All Composable Components <a class="header-anchor" href="#all-composable-components" aria-label="Permalink to “All Composable Components”">​</a></h2><h3 id="feedback" tabindex="-1">Feedback <a class="header-anchor" href="#feedback" aria-label="Permalink to “Feedback”">​</a></h3><ul><li><p><a href="/vuecraft/components/src/feedback/useMessage/">useMessage</a></p></li><li><p><a href="/vuecraft/components/src/feedback/useAsyncConfirm/">useAsyncConfirm</a></p></li><li><p><a href="/vuecraft/components/src/feedback/useDialog/">useDialog</a></p></li><li><p><a href="/vuecraft/components/src/feedback/useNotification/">useNotification</a></p></li></ul><h3 id="form" tabindex="-1">Form <a class="header-anchor" href="#form" aria-label="Permalink to “Form”">​</a></h3><ul><li><a href="/vuecraft/components/src/form/useForm/">useForm</a></li></ul><h3 id="table" tabindex="-1">Table <a class="header-anchor" href="#table" aria-label="Permalink to “Table”">​</a></h3><ul><li><a href="/vuecraft/components/src/table/useTable/">useTable</a></li></ul><h3 id="data" tabindex="-1">Data <a class="header-anchor" href="#data" aria-label="Permalink to “Data”">​</a></h3><ul><li><p><a href="/vuecraft/components/src/data/useDescriptions/">useDescriptions</a></p></li><li><p><a href="/vuecraft/components/src/data/useCollapse/">useCollapse</a></p></li><li><p><a href="/vuecraft/components/src/data/useSegmented/">useSegmented</a></p></li><li><p><a href="/vuecraft/components/src/data/useTreeV2/">useTreeV2</a></p></li><li><p><a href="/vuecraft/components/src/data/useTree/">useTree</a></p></li><li><p><a href="/vuecraft/components/src/data/useTimeline/">useTimeline</a></p></li></ul><h3 id="navigation" tabindex="-1">Navigation <a class="header-anchor" href="#navigation" aria-label="Permalink to “Navigation”">​</a></h3><ul><li><p><a href="/vuecraft/components/src/navigation/useBreadcrumb/">useBreadcrumb</a></p></li><li><p><a href="/vuecraft/components/src/navigation/useDropdown/">useDropdown</a></p></li><li><p><a href="/vuecraft/components/src/navigation/useMenu/">useMenu</a></p></li><li><p><a href="/vuecraft/components/src/navigation/useSteps/">useSteps</a></p></li><li><p><a href="/vuecraft/components/src/navigation/useTabs/">useTabs</a></p></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
