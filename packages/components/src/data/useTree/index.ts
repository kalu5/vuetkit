import type { RequestService } from '@vuetkit/core'
import type {
  RenderContentContext,
  TreeComponentProps,
  TreeData,
  TreeInstance,
  TreeNodeData,
} from 'element-plus'
import type { Component, Ref, VNode } from 'vue'
import { useRequest } from '@vuetkit/core'

import { ElTree, vLoading } from 'element-plus'
import { computed, defineComponent, h, ref, withDirectives } from 'vue'

type TreeNode = RenderContentContext['node']

export interface TreeColumn extends TreeNodeData {
  // @desc Children nodes of the current node
  children?: TreeColumn[]
  // @desc Render function of the node content, takes priority over option-level render
  render?: (node: TreeNode, data: TreeNodeData) => VNode
}

export interface TreeOptions<T> extends Partial<Omit<TreeComponentProps, 'data'>> {
  // @desc Tree data
  data?: TreeColumn[]
  // @desc Service for fetching async data
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format tree data
  formatData?: (data: T) => TreeColumn[]
  // @desc Default render function for all nodes, used when the node has no per-node render
  render?: (node: TreeNode, data: TreeNodeData) => VNode
}

export type TreeReturnType = [
  // @desc Tree component
  Component,
  // @desc Tree instance ref, can be used to call exposed methods externally (filter, getCheckedKeys, etc.)
  Ref<TreeInstance | undefined>,
]

export function useTree<T>(options: TreeOptions<T>): TreeReturnType {
  const { data = [], service, params, formatData, render, ...rest } = options

  const { data: resData, loading } = service
    ? useRequest<TreeColumn[], T>(service, {
        defaultParams: params,
        formatData: formatData || undefined,
      })
    : {
      }

  const treeData = computed<TreeData>(() => resData?.value || data)
  const treeRef = ref<TreeInstance>()

  const TreeComp = defineComponent((props, { slots }) => {
    const renderNodeContent = (node: TreeNode, nodeData: TreeNodeData) => {
      // Per-node render takes priority, then option-level render
      const columnRender = (nodeData as TreeColumn).render
      if (typeof columnRender === 'function') {
        return columnRender(node, nodeData)
      }
      if (typeof render === 'function') {
        return render(node, nodeData)
      }
      return undefined
    }

    return () => {
      return withDirectives(
        h(ElTree, {
          ...rest,
          ...props,
          ref: treeRef,
          data: treeData.value,
        }, {
          default: ({ node, data: nodeData }: { node: TreeNode, data: TreeNodeData }) => {
            if (slots.default) {
              return slots.default({ node, data: nodeData })
            }
            const content = renderNodeContent(node, nodeData)
            if (content) {
              return content
            }
            // Fall back to label text
            return h('span', {}, node.label)
          },
          empty: () => slots.empty?.(),
        }),
        [
          [vLoading, loading?.value ?? false],
        ],
      )
    }
  })

  return [
    TreeComp,
    treeRef,
  ]
}
