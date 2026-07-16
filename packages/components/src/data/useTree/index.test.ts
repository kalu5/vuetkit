// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { useRequest } from '@vuetkit/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useTree } from './index'

vi.mock('element-plus', () => {
  const buildNodes = (dataList: any[], optionProps: any, level = 0): Array<{ node: any, data: any }> => {
    const labelKey = optionProps?.label || 'label'
    const valueKey = optionProps?.nodeKey || 'id'
    const childrenKey = optionProps?.children || 'children'
    const result: Array<{ node: any, data: any }> = []
    for (const item of dataList || []) {
      const node = {
        key: item[valueKey],
        level,
        data: item,
        label: typeof labelKey === 'function' ? labelKey(item) : item[labelKey],
        isLeaf: !item[childrenKey] || !item[childrenKey].length,
        expanded: true,
      }
      result.push({ node, data: item })
      if (item[childrenKey] && item[childrenKey].length) {
        result.push(...buildNodes(item[childrenKey], optionProps, level + 1))
      }
    }
    return result
  }

  return {
    ElTree: defineComponent({
      props: [
        'data',
        'props',
        'nodeKey',
        'emptyText',
        'renderAfterExpand',
        'showCheckbox',
        'highlightCurrent',
        'defaultExpandAll',
        'expandOnClickNode',
        'checkOnClickNode',
        'checkOnClickLeaf',
        'checkStrictly',
        'checkDescendants',
        'autoExpandParent',
        'defaultExpandedKeys',
        'defaultCheckedKeys',
        'currentNodeKey',
        'renderContent',
        'draggable',
        'allowDrag',
        'allowDrop',
        'lazy',
        'load',
        'filterNodeMethod',
        'accordion',
        'indent',
        'icon',
      ],
      setup(props, { slots, expose }) {
        const exposed = {
          filter: vi.fn(),
          getCheckedNodes: vi.fn(() => []),
          getCheckedKeys: vi.fn(() => []),
          setCheckedKeys: vi.fn(),
          setChecked: vi.fn(),
          setCheckedNodes: vi.fn(),
          getHalfCheckedNodes: vi.fn(() => []),
          getHalfCheckedKeys: vi.fn(() => []),
          getCurrentKey: vi.fn(() => undefined),
          getCurrentNode: vi.fn(() => undefined),
          setCurrentKey: vi.fn(),
          setCurrentNode: vi.fn(),
          getNode: vi.fn(() => undefined),
          remove: vi.fn(),
          append: vi.fn(),
          insertBefore: vi.fn(),
          insertAfter: vi.fn(),
          updateKeyChildren: vi.fn(),
        }
        expose(exposed)

        return () => {
          const nodes = buildNodes(props.data || [], props.props)
          if (nodes.length === 0) {
            return h('div', {
              'class': 'el-tree',
              'data-show-checkbox': props.showCheckbox ? 'true' : 'false',
              'data-node-key': props.nodeKey || '',
              'data-highlight-current': props.highlightCurrent ? 'true' : 'false',
              'data-indent': props.indent != null ? String(props.indent) : '',
              'data-accordion': props.accordion ? 'true' : 'false',
              'data-lazy': props.lazy ? 'true' : 'false',
              'data-default-expand-all': props.defaultExpandAll ? 'true' : 'false',
              'data-empty': 'true',
            }, [slots.empty?.()])
          }
          return h('div', {
            'class': 'el-tree',
            'data-show-checkbox': props.showCheckbox ? 'true' : 'false',
            'data-node-key': props.nodeKey || '',
            'data-highlight-current': props.highlightCurrent ? 'true' : 'false',
            'data-indent': props.indent != null ? String(props.indent) : '',
            'data-accordion': props.accordion ? 'true' : 'false',
            'data-lazy': props.lazy ? 'true' : 'false',
            'data-default-expand-all': props.defaultExpandAll ? 'true' : 'false',
          }, nodes.map(({ node, data }) =>
            h('div', {
              'class': 'el-tree-node',
              'data-label': node.label || '',
              'data-level': String(node.level),
              'data-key': node.key != null ? String(node.key) : '',
            }, [
              slots.default ? slots.default({ node, data }) : h('span', {}, node.label),
            ]),
          ))
        }
      },
    }),
    vLoading: {
      mounted(el: HTMLElement, binding: { value: boolean }) {
        if (binding.value)
          el.setAttribute('data-loading', 'true')
        else
          el.removeAttribute('data-loading')
      },
      updated(el: HTMLElement, binding: { value: boolean }) {
        if (binding.value)
          el.setAttribute('data-loading', 'true')
        else
          el.removeAttribute('data-loading')
      },
    },
  }
})

vi.mock('@vuetkit/core', () => ({
  useRequest: vi.fn(() => ({
    data: ref(null),
    loading: ref(false),
    error: ref(undefined),
    execute: vi.fn(),
    cancel: vi.fn(),
  })),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useTree', () => {
  it('returns a component and tree instance ref', () => {
    const [TreeComp, treeRef] = useTree({
      data: [],
    })
    expect(TreeComp).toBeDefined()
    expect(typeof TreeComp).toBe('object')
    expect(treeRef).toBeDefined()
    expect(treeRef.value).toBeUndefined()
  })

  it('renders basic tree data with labels', () => {
    const [TreeComp] = useTree({
      data: [
        { id: '1', label: 'Level one 1' },
        { id: '2', label: 'Level one 2' },
      ],
    })
    const wrapper = mount(TreeComp)
    const nodes = wrapper.findAll('.el-tree-node')
    expect(nodes.length).toBe(2)
    expect(nodes[0].attributes('data-label')).toBe('Level one 1')
    expect(nodes[1].attributes('data-label')).toBe('Level one 2')
  })

  it('renders hierarchical data with children', () => {
    const [TreeComp] = useTree({
      data: [
        {
          id: '1',
          label: 'Level one 1',
          children: [
            { id: '1-1', label: 'Level two 1-1' },
            { id: '1-2', label: 'Level two 1-2' },
          ],
        },
        { id: '2', label: 'Level one 2' },
      ],
    })
    const wrapper = mount(TreeComp)
    const nodes = wrapper.findAll('.el-tree-node')
    expect(nodes.length).toBe(4)
    expect(nodes[0].attributes('data-label')).toBe('Level one 1')
    expect(nodes[1].attributes('data-label')).toBe('Level two 1-1')
    expect(nodes[2].attributes('data-label')).toBe('Level two 1-2')
    expect(nodes[3].attributes('data-label')).toBe('Level one 2')
    expect(nodes[0].attributes('data-level')).toBe('0')
    expect(nodes[1].attributes('data-level')).toBe('1')
  })

  it('uses custom per-node render function', () => {
    const customRender = vi.fn((node: any) => h('span', { class: 'custom-node' }, `Custom: ${node.label}`))
    const [TreeComp] = useTree({
      data: [
        { id: '1', label: 'Node 1', render: customRender },
        { id: '2', label: 'Node 2' },
      ],
    })
    const wrapper = mount(TreeComp)
    const customNodes = wrapper.findAll('.custom-node')
    expect(customNodes.length).toBe(1)
    expect(customNodes[0].text()).toBe('Custom: Node 1')
    expect(customRender).toHaveBeenCalled()
  })

  it('uses option-level render function for all nodes', () => {
    const optionRender = vi.fn((node: any) => h('span', { class: 'option-render' }, `Option: ${node.label}`))
    const [TreeComp] = useTree({
      data: [
        { id: '1', label: 'Node 1' },
        { id: '2', label: 'Node 2' },
      ],
      render: optionRender,
    })
    const wrapper = mount(TreeComp)
    const rendered = wrapper.findAll('.option-render')
    expect(rendered.length).toBe(2)
    expect(rendered[0].text()).toBe('Option: Node 1')
    expect(rendered[1].text()).toBe('Option: Node 2')
    expect(optionRender).toHaveBeenCalledTimes(2)
  })

  it('per-node render takes priority over option-level render', () => {
    const optionRender = vi.fn(() => h('span', { class: 'option-render' }, 'Option'))
    const nodeRender = vi.fn(() => h('span', { class: 'node-render' }, 'Node'))
    const [TreeComp] = useTree({
      data: [
        { id: '1', label: 'Node 1', render: nodeRender },
        { id: '2', label: 'Node 2' },
      ],
      render: optionRender,
    })
    const wrapper = mount(TreeComp)
    expect(wrapper.findAll('.node-render').length).toBe(1)
    expect(wrapper.findAll('.option-render').length).toBe(1)
    expect(nodeRender).toHaveBeenCalledTimes(1)
    expect(optionRender).toHaveBeenCalledTimes(1)
  })

  it('renders default slot content when provided', () => {
    const [TreeComp] = useTree({
      data: [
        { id: '1', label: 'Node 1' },
        { id: '2', label: 'Node 2' },
      ],
    })
    const wrapper = mount(TreeComp, {
      slots: {
        default: ({ node }: { node: any }) => h('span', { class: 'slot-node' }, `Slot: ${node.label}`),
      },
    })
    const slotNodes = wrapper.findAll('.slot-node')
    expect(slotNodes.length).toBe(2)
    expect(slotNodes[0].text()).toBe('Slot: Node 1')
    expect(slotNodes[1].text()).toBe('Slot: Node 2')
  })

  it('default slot takes priority over render functions', () => {
    const [TreeComp] = useTree({
      data: [
        { id: '1', label: 'Node 1', render: () => h('span', { class: 'node-render' }, 'Node') },
      ],
      render: () => h('span', { class: 'option-render' }, 'Option'),
    })
    const wrapper = mount(TreeComp, {
      slots: {
        default: ({ node }: { node: any }) => h('span', { class: 'slot-node' }, `Slot: ${node.label}`),
      },
    })
    expect(wrapper.findAll('.slot-node').length).toBe(1)
    expect(wrapper.findAll('.node-render').length).toBe(0)
    expect(wrapper.findAll('.option-render').length).toBe(0)
  })

  it('renders empty slot when data is empty', () => {
    const [TreeComp] = useTree({
      data: [],
    })
    const wrapper = mount(TreeComp, {
      slots: {
        empty: () => h('div', { class: 'empty-slot' }, 'No data'),
      },
    })
    expect(wrapper.find('.empty-slot').exists()).toBe(true)
    expect(wrapper.find('.empty-slot').text()).toBe('No data')
    expect(wrapper.find('.el-tree').attributes('data-empty')).toBe('true')
  })

  it('does not render empty slot when data is available', () => {
    const [TreeComp] = useTree({
      data: [{ id: '1', label: 'Node 1' }],
    })
    const wrapper = mount(TreeComp, {
      slots: {
        empty: () => h('div', { class: 'empty-slot' }, 'No data'),
      },
    })
    expect(wrapper.find('.empty-slot').exists()).toBe(false)
    expect(wrapper.find('.el-tree').attributes('data-empty')).toBeUndefined()
  })

  it('renders label text when no render function is provided', () => {
    const [TreeComp] = useTree({
      data: [
        { id: '1', label: 'Plain Node' },
      ],
    })
    const wrapper = mount(TreeComp)
    const node = wrapper.find('.el-tree-node')
    expect(node.text()).toBe('Plain Node')
  })

  it('passes rest props to ElTree', () => {
    const [TreeComp] = useTree({
      data: [{ id: '1', label: 'Node 1' }],
      showCheckbox: true,
      nodeKey: 'id',
      indent: 24,
      highlightCurrent: true,
      defaultExpandAll: true,
      accordion: true,
    })
    const wrapper = mount(TreeComp)
    const tree = wrapper.find('.el-tree')
    expect(tree.attributes('data-show-checkbox')).toBe('true')
    expect(tree.attributes('data-node-key')).toBe('id')
    expect(tree.attributes('data-indent')).toBe('24')
    expect(tree.attributes('data-highlight-current')).toBe('true')
    expect(tree.attributes('data-default-expand-all')).toBe('true')
    expect(tree.attributes('data-accordion')).toBe('true')
  })

  it('supports component props passed during mount', () => {
    const [TreeComp] = useTree({
      data: [{ id: '1', label: 'Node 1' }],
    })
    const wrapper = mount(TreeComp, {
      props: {
        showCheckbox: true,
        highlightCurrent: true,
      },
    })
    const tree = wrapper.find('.el-tree')
    expect(tree.attributes('data-show-checkbox')).toBe('true')
    expect(tree.attributes('data-highlight-current')).toBe('true')
  })

  it('component props override options props', () => {
    const [TreeComp] = useTree({
      data: [{ id: '1', label: 'Node 1' }],
      showCheckbox: false,
      highlightCurrent: false,
    })
    const wrapper = mount(TreeComp, {
      props: {
        showCheckbox: true,
        highlightCurrent: true,
      },
    })
    const tree = wrapper.find('.el-tree')
    expect(tree.attributes('data-show-checkbox')).toBe('true')
    expect(tree.attributes('data-highlight-current')).toBe('true')
  })

  it('supports custom props mapping (label, children)', () => {
    const [TreeComp] = useTree({
      data: [
        {
          key: '1',
          name: 'Custom Label',
          subs: [
            { key: '1-1', name: 'Child Label' },
          ],
        },
      ],
      nodeKey: 'key',
      props: {
        label: 'name',
        children: 'subs',
      },
    })
    const wrapper = mount(TreeComp)
    const nodes = wrapper.findAll('.el-tree-node')
    expect(nodes.length).toBe(2)
    expect(nodes[0].attributes('data-label')).toBe('Custom Label')
    expect(nodes[1].attributes('data-label')).toBe('Child Label')
    expect(nodes[1].attributes('data-level')).toBe('1')
  })

  it('supports default expanded and checked keys', () => {
    const [TreeComp] = useTree({
      data: [
        {
          id: '1',
          label: 'Level one 1',
          children: [
            { id: '1-1', label: 'Level two 1-1' },
          ],
        },
        { id: '2', label: 'Level one 2' },
      ],
      nodeKey: 'id',
      showCheckbox: true,
      defaultExpandedKeys: ['1'],
      defaultCheckedKeys: ['1-1'],
    })
    const wrapper = mount(TreeComp)
    const tree = wrapper.find('.el-tree')
    expect(tree.attributes('data-node-key')).toBe('id')
    expect(tree.attributes('data-show-checkbox')).toBe('true')
    const nodes = wrapper.findAll('.el-tree-node')
    expect(nodes.length).toBe(3)
  })

  it('handles undefined render function gracefully', () => {
    const [TreeComp] = useTree({
      data: [
        { id: '1', label: 'Node 1', render: undefined },
      ],
    })
    const wrapper = mount(TreeComp)
    expect(wrapper.find('.el-tree-node').text()).toBe('Node 1')
  })

  it('handles empty data array', () => {
    const [TreeComp] = useTree({
      data: [],
    })
    const wrapper = mount(TreeComp)
    expect(wrapper.findAll('.el-tree-node').length).toBe(0)
    expect(wrapper.find('.el-tree').attributes('data-empty')).toBe('true')
  })

  it('sets tree instance ref after mount', async () => {
    const [TreeComp, treeRef] = useTree({
      data: [{ id: '1', label: 'Node 1' }],
    })
    mount(TreeComp)
    await nextTick()
    expect(treeRef.value).toBeDefined()
    expect(typeof treeRef.value?.filter).toBe('function')
    expect(typeof treeRef.value?.getCheckedKeys).toBe('function')
    expect(typeof treeRef.value?.setCheckedKeys).toBe('function')
    expect(typeof treeRef.value?.getNode).toBe('function')
  })

  it('can call exposed methods via tree ref', async () => {
    const [TreeComp, treeRef] = useTree({
      data: [{ id: '1', label: 'Node 1' }],
      showCheckbox: true,
    })
    mount(TreeComp)
    await nextTick()
    treeRef.value?.filter('test')
    treeRef.value?.getCheckedKeys()
    treeRef.value?.getCheckedNodes()
    expect(treeRef.value?.filter).toHaveBeenCalledWith('test')
  })

  it('exposes all tree instance methods via ref', async () => {
    const [TreeComp, treeRef] = useTree({
      data: [{ id: '1', label: 'Node 1' }],
    })
    mount(TreeComp)
    await nextTick()
    const methods = [
      'filter',
      'getCheckedNodes',
      'getCheckedKeys',
      'setCheckedKeys',
      'setChecked',
      'setCheckedNodes',
      'getHalfCheckedNodes',
      'getHalfCheckedKeys',
      'getCurrentKey',
      'getCurrentNode',
      'setCurrentKey',
      'setCurrentNode',
      'getNode',
      'remove',
      'append',
      'insertBefore',
      'insertAfter',
      'updateKeyChildren',
    ]
    for (const method of methods) {
      expect(typeof (treeRef.value as any)?.[method]).toBe('function')
    }
  })

  describe('async service', () => {
    it('calls useRequest with service when service is provided', () => {
      const mockService = vi.fn(() => Promise.resolve({ list: [{ id: '1', label: 'Async' }] }))
      useTree({
        data: [],
        service: mockService,
      })
      expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
        defaultParams: undefined,
        formatData: undefined,
      }))
    })

    it('passes params as defaultParams to useRequest', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockParams = { id: 1 }
      useTree({
        data: [],
        service: mockService,
        params: mockParams,
      })
      expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
        defaultParams: mockParams,
      }))
    })

    it('passes formatData to useRequest', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockFormatData = vi.fn(() => [{ id: '1', label: 'test' }])
      useTree({
        data: [],
        service: mockService,
        formatData: mockFormatData,
      })
      expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
        formatData: mockFormatData,
      }))
    })

    it('passes formatData as undefined when formatData is undefined', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      useTree({
        data: [],
        service: mockService,
        formatData: undefined,
      })
      expect(useRequest).toHaveBeenCalledWith(mockService, expect.objectContaining({
        formatData: undefined,
      }))
    })

    it('uses data.value from service when data is available', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        { id: 'a1', label: 'Async Node 1' },
        { id: 'a2', label: 'Async Node 2' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [TreeComp] = useTree({
        data: [{ id: '1', label: 'Static Node' }],
        service: mockService,
      })
      const wrapper = mount(TreeComp)
      const nodes = wrapper.findAll('.el-tree-node')
      expect(nodes.length).toBe(2)
      expect(nodes[0].attributes('data-label')).toBe('Async Node 1')
      expect(nodes[1].attributes('data-label')).toBe('Async Node 2')
    })

    it('falls back to static data when data.value is null', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref(null)
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [TreeComp] = useTree({
        data: [{ id: '1', label: 'Static Node' }],
        service: mockService,
      })
      const wrapper = mount(TreeComp)
      const nodes = wrapper.findAll('.el-tree-node')
      expect(nodes.length).toBe(1)
      expect(nodes[0].attributes('data-label')).toBe('Static Node')
    })

    it('falls back to static data when data.value is undefined', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref(undefined)
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [TreeComp] = useTree({
        data: [{ id: '1', label: 'Static Node' }],
        service: mockService,
      })
      const wrapper = mount(TreeComp)
      const nodes = wrapper.findAll('.el-tree-node')
      expect(nodes.length).toBe(1)
      expect(nodes[0].attributes('data-label')).toBe('Static Node')
    })

    it('applies vLoading directive when loading is true', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      vi.mocked(useRequest).mockReturnValue({
        data: ref(null),
        loading: ref(true),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [TreeComp] = useTree({
        data: [],
        service: mockService,
      })
      const wrapper = mount(TreeComp)
      const tree = wrapper.find('.el-tree')
      expect(tree.attributes('data-loading')).toBe('true')
    })

    it('does not apply vLoading directive when loading is false', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      vi.mocked(useRequest).mockReturnValue({
        data: ref(null),
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [TreeComp] = useTree({
        data: [],
        service: mockService,
      })
      const wrapper = mount(TreeComp)
      const tree = wrapper.find('.el-tree')
      expect(tree.attributes('data-loading')).toBeUndefined()
    })

    it('does not apply vLoading directive when service is not provided', () => {
      const [TreeComp] = useTree({
        data: [],
      })
      const wrapper = mount(TreeComp)
      const tree = wrapper.find('.el-tree')
      expect(tree.attributes('data-loading')).toBeUndefined()
    })

    it('renders async data when static data is empty but async data is available', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([
        { id: 'a1', label: 'Async Node' },
      ])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [TreeComp] = useTree({
        data: [],
        service: mockService,
      })
      const wrapper = mount(TreeComp)
      const nodes = wrapper.findAll('.el-tree-node')
      expect(nodes.length).toBe(1)
      expect(nodes[0].attributes('data-label')).toBe('Async Node')
    })

    it('uses data.value as empty array when data is empty array', () => {
      const mockService = vi.fn(() => Promise.resolve({}))
      const mockData = ref([])
      vi.mocked(useRequest).mockReturnValue({
        data: mockData,
        loading: ref(false),
        error: ref(undefined),
        execute: vi.fn(),
        cancel: vi.fn(),
      })
      const [TreeComp] = useTree({
        data: [{ id: '1', label: 'Static Node' }],
        service: mockService,
      })
      const wrapper = mount(TreeComp)
      const nodes = wrapper.findAll('.el-tree-node')
      expect(nodes.length).toBe(0)
    })
  })
})
