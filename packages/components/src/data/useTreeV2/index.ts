import type { RequestService } from '@vuetkit/core'
import type { TreeV2Instance } from 'element-plus'
import type { TreeData, TreeNode, TreeNodeData, TreeProps } from 'element-plus/es/components/tree-v2/src/types'
import type { Component, Ref, VNode } from 'vue'
import { useRequest } from '@vuetkit/core'

import { ElTreeV2, vLoading } from 'element-plus'
import { computed, defineComponent, h, ref, withDirectives } from 'vue'

export interface TreeV2Column extends TreeNodeData {
  // @desc Children nodes of the current node
  children?: TreeV2Column[]
  // @desc Render function of the node content, takes priority over option-level render
  render?: (node: TreeNode, data: TreeNodeData) => VNode
}

export interface TreeV2Options<T> extends Omit<TreeProps, 'data'> {
  // @desc Tree data
  data?: TreeV2Column[]
  // @desc Service for fetching async data
  service?: RequestService<T>
  // @desc Service params
  params?: unknown
  // @desc Format tree data
  formatData?: (data: T) => TreeV2Column[]
  // @desc Default render function for all nodes, used when the node has no per-node render
  render?: (node: TreeNode, data: TreeNodeData) => VNode
}

export type TreeV2ReturnType = [
  // @desc TreeV2 component
  Component,
  // @desc TreeV2 instance ref, can be used to call exposed methods externally (filter, getCheckedKeys, etc.)
  Ref<TreeV2Instance | undefined>,
]

export function useTreeV2<T>(options: TreeV2Options<T>): TreeV2ReturnType {
  const { data = [], service, params, formatData, render, ...rest } = options

  const { data: resData, loading } = service
    ? useRequest<TreeV2Column[], T>(service, {
        defaultParams: params,
        formatData: formatData || undefined,
      })
    : {
      }

  const treeData = computed<TreeData>(() => resData?.value || data)
  const treeRef = ref<TreeV2Instance>()

  const TreeV2Comp = defineComponent((props, { slots }) => {
    const renderNodeContent = (node: TreeNode, nodeData: TreeNodeData) => {
      // Per-node render takes priority, then option-level render
      const columnRender = (nodeData as TreeV2Column).render
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
        h(ElTreeV2, {
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
    TreeV2Comp,
    treeRef,
  ]
}
