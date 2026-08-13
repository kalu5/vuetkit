// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { useRequest } from '@vuecraft/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useTreeV2 } from './index'

vi.mock('element-plus', () => {
  const buildNodes = (dataList: any[], optionProps: any, level = 0): Array<{ node: any, data: any }> => {
    const labelKey = optionProps?.label || 'label'
    const valueKey = optionProps?.value || 'id'
    const childrenKey = optionProps?.children || 'children'
    const result: Array<{ node: any, data: any }> = []
    for (const item of dataList || []) {
      const node = {
        key: item[valueKey],
        level,
        data: item,
        label: item[labelKey],
        isLeaf: !item[childrenKey] || !item[childrenKey].length,
        expanded: false,
      }
      result.push({ node, data: item })
      if (item[childrenKey] && item[childrenKey].length) {
        result.push(...buildNodes(item[childrenKey], optionProps, level + 1))
      }
    }
    return result
  }

  return {
    ElTreeV2: defineComponent({
      props: [
        'data',
        'props',
        'height',
        'showCheckbox',
        'highlightCurrent',
        'defaultExpandedKeys',
        'defaultCheckedKeys',
        'checkStrictly',
        'indent',
        'itemSize',
        'expandOnClickNode',
        'checkOnClickNode',
        'checkOnClickLeaf',
        'currentNodeKey',
        'accordion',
        'emptyText',
        'icon',
        'filterMethod',
        'perfMode',
        'scrollbarAlwaysOn',
      ],
      setup(props, { slots, expose }) {
        const exposed = {
          filter: vi.fn(),
          getCheckedNodes: vi.fn(() => []),
          getCheckedKeys: vi.fn(() => []),
          setCheckedKeys: vi.fn(),
          setChecked: vi.fn(),
          setExpandedKeys: vi.fn(),
          getHalfCheckedNodes: vi.fn(() => []),
          getHalfCheckedKeys: vi.fn(() => []),
          getCurrentKey: vi.fn(() => undefined),
          getCurrentNode: vi.fn(() => undefined),
          setCurrentKey: vi.fn(),
          getNode: vi.fn(() => undefined),
          expandNode: vi.fn(),
          collapseNode: vi.fn(),
          scrollTo: vi.fn(),
          scrollToNode: vi.fn(),
          setData: vi.fn(),
          toggleCheckbox: vi.fn(),
        }
        expose(exposed)

        return () => {
          const nodes = buildNodes(props.data || [], props.props)
          if (nodes.length === 0) {
            return h('div', {
              'class': 'el-tree-v2',
              'data-show-checkbox': props.showCheckbox ? 'true' : 'false',
              'data-height': props.height != null ? String(props.height) : '',
              'data-highlight-current': props.highlightCurrent ? 'true' : 'false',
              'data-indent': props.indent != null ? String(props.indent) : '',
              'data-accordion': props.accordion ? 'true' : 'false',
              'data-empty': 'true',
            }, [slots.empty?.()])
          }
          return h('div', {
            'class': 'el-tree-v2',
            'data-show-checkbox': props.showCheckbox ? 'true' : 'false',
            'data-height': props.height != null ? String(props.height) : '',
            'data-highlight-current': props.highlightCurrent ? 'true' : 'false',
            'data-indent': props.indent != null ? String(props.indent) : '',
            'data-accordion': props.accordion ? 'true' : 'false',
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

vi.mock('@vuecraft/core', () => ({
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

describe('useTreeV2', () => {
  it('returns a component and tree instance ref', () => {
    const [TreeV2Comp, treeRef] = useTreeV2({
      data: [],
    })
    expect(TreeV2Comp).toBeDefined()
    expect(typeof TreeV2Comp).toBe('object')
    expect(treeRef).toBeDefined()
    expect(treeRef.value).toBeUndefined()
  })

  it('renders basic tree data with labels', () => {
    const [TreeV2Comp] = useTreeV2({
      data: [
        { id: '1', label: 'Level one 1' },
        { id: '2', label: 'Level one 2' },
      ],
    })
    const wrapper = mount(TreeV2Comp)
    const nodes = wrapper.findAll('.el-tree-node')
    expect(nodes.length).toBe(2)
    expect(nodes[0].attributes('data-label')).toBe('Level one 1')
    expect(nodes[1].attributes('data-label')).toBe('Level one 2')
  })

  it('renders hierarchical data with children', () => {
    const [TreeV2Comp] = useTreeV2({
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
    const wrapper = mount(TreeV2Comp)
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
    const [TreeV2Comp] = useTreeV2({
      data: [
        { id: '1', label: 'Node 1', render: customRender },
        { id: '2', label: 'Node 2' },
      ],
    })
    const wrapper = mount(TreeV2Comp)
    const customNodes = wrapper.findAll('.custom-node')
    expect(customNodes.length).toBe(1)
    expect(customNodes[0].text()).toBe('Custom: Node 1')
    expect(customRender).toHaveBeenCalled()
  })

  it('uses option-level render function for all nodes', () => {
    const optionRender = vi.fn((node: any) => h('span', { class: 'option-render' }, `Option: ${node.label}`))
    const [TreeV2Comp] = useTreeV2({
      data: [
        { id: '1', label: 'Node 1' },
        { id: '2', label: 'Node 2' },
      ],
      render: optionRender,
    })
    const wrapper = mount(TreeV2Comp)
    const rendered = wrapper.findAll('.option-render')
    expect(rendered.length).toBe(2)
    expect(rendered[0].text()).toBe('Option: Node 1')
    expect(rendered[1].text()).toBe('Option: Node 2')
    expect(optionRender).toHaveBeenCalledTimes(2)
  })

  it('per-node render takes priority over option-level render', () => {
    const optionRender = vi.fn(() => h('span', { class: 'option-render' }, 'Option'))
    const nodeRender = vi.fn(() => h('span', { class: 'node-render' }, 'Node'))
    const [TreeV2Comp] = useTreeV2({
      data: [
        { id: '1', label: 'Node 1', render: nodeRender },
        { id: '2', label: 'Node 2' },
      ],
      render: optionRender,
    })
    const wrapper = mount(TreeV2Comp)
    expect(wrapper.findAll('.node-render').length).toBe(1)
    expect(wrapper.findAll('.option-render').length).toBe(1)
    expect(nodeRender).toHaveBeenCalledTimes(1)
    expect(optionRender).toHaveBeenCalledTimes(1)
  })

  it('renders default slot content when provided', () => {
    const [TreeV2Comp] = useTreeV2({
      data: [
        { id: '1', label: 'Node 1' },
        { id: '2', label: 'Node 2' },
      ],
    })
    const wrapper = mount(TreeV2Comp, {
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
    const [TreeV2Comp] = useTreeV2({
      data: [
        { id: '1', label: 'Node 1', render: () => h('span', { class: 'node-render' }, 'Node') },
      ],
      render: () => h('span', { class: 'option-render' }, 'Option'),
    })
    const wrapper = mount(TreeV2Comp, {
      slots: {
        default: ({ node }: { node: any }) => h('span', { class: 'slot-node' }, `Slot: ${node.label}`),
      },
    })
    expect(wrapper.findAll('.slot-node').length).toBe(1)
    expect(wrapper.findAll('.node-render').length).toBe(0)
    expect(wrapper.findAll('.option-render').length).toBe(0)
  })

  it('renders empty slot when data is empty', () => {
    const [TreeV2Comp] = useTreeV2({
      data: [],
    })
    const wrapper = mount(TreeV2Comp, {
      slots: {
        empty: () => h('div', { class: 'empty-slot' }, 'No data'),
      },
    })
    expect(wrapper.find('.empty-slot').exists()).toBe(true)
    expect(wrapper.find('.empty-slot').text()).toBe('No data')
    expect(wrapper.find('.el-tree-v2').attributes('data-empty')).toBe('true')
  })

  it('does not render empty slot when data is available', () => {
    const [TreeV2Comp] = useTreeV2({
      data: [{ id: '1', label: 'Node 1' }],
    })
    const wrapper = mount(TreeV2Comp, {
      slots: {
        empty: () => h('div', { class: 'empty-slot' }, 'No data'),
      },
    })
    expect(wrapper.find('.empty-slot').exists()).toBe(false)
    expect(wrapper.find('.el-tree-v2').attributes('data-empty')).toBeUndefined()
  })

  it('renders label text when no render function is provided', () => {
    const [TreeV2Comp] = useTreeV2({
      data: [
        { id: '1', label: 'Plain Node' },
      ],
    })
    const wrapper = mount(TreeV2Comp)
    const node = wrapper.find('.el-tree-node')
    expect(node.text()).toBe('Plain Node')
  })

  it('passes rest props to ElTreeV2', () => {
    const [TreeV2Comp] = useTreeV2({
      data: [{ id: '1', label: 'Node 1' }],
      showCheckbox: true,
      height: 300,
      indent: 24,
      highlightCurrent: true,
    })
    const wrapper = mount(TreeV2Comp)
    const tree = wrapper.find('.el-tree-v2')
    expect(tree.attributes('data-show-checkbox')).toBe('true')
    expect(tree.attributes('data-height')).toBe('300')
    expect(tree.attributes('data-indent')).toBe('24')
    expect(tree.attributes('data-highlight-current')).toBe('true')
  })

  it('supports component props passed during mount', () => {
    const [TreeV2Comp] = useTreeV2({
      data: [{ id: '1', label: 'Node 1' }],
    })
    const wrapper = mount(TreeV2Comp, {
      props: {
        showCheckbox: true,
        height: 500,
      },
    })
    const tree = wrapper.find('.el-tree-v2')
    expect(tree.attributes('data-show-checkbox')).toBe('true')
    expect(tree.attributes('data-height')).toBe('500')
  })

  it('component props override options props', () => {
    const [TreeV2Comp] = useTreeV2({
      data: [{ id: '1', label: 'Node 1' }],
      showCheckbox: false,
      height: 200,
    })
    const wrapper = mount(TreeV2Comp, {
      props: {
        showCheckbox: true,
        height: 400,
      },
    })
    const tree = wrapper.find('.el-tree-v2')
    expect(tree.attributes('data-show-checkbox')).toBe('true')
    expect(tree.attributes('data-height')).toBe('400')
  })

  it('supports custom props mapping (value, label, children)', () => {
    const [TreeV2Comp] = useTreeV2({
      data: [
        {
          key: '1',
          name: 'Custom Label',
          subs: [
            { key: '1-1', name: 'Child Label' },
          ],
        },
      ],
      props: {
        value: 'key',
        label: 'name',
        children: 'subs',
      },
    })
    const wrapper = mount(TreeV2Comp)
    const nodes = wrapper.findAll('.el-tree-node')
    expect(nodes.length).toBe(2)
    expect(nodes[0].attributes('data-label')).toBe('Custom Label')
    expect(nodes[1].attributes('data-label')).toBe('Child Label')
    expect(nodes[1].attributes('data-level')).toBe('1')
  })

  it('handles undefined render function gracefully', () => {
    const [TreeV2Comp] = useTreeV2({
      data: [
        { id: '1', label: 'Node 1', render: undefined },
      ],
    })
    const wrapper = mount(TreeV2Comp)
    expect(wrapper.find('.el-tree-node').text()).toBe('Node 1')
  })

  it('handles empty data array', () => {
    const [TreeV2Comp] = useTreeV2({
      data: [],
    })
    const wrapper = mount(TreeV2Comp)
    expect(wrapper.findAll('.el-tree-node').length).toBe(0)
    expect(wrapper.find('.el-tree-v2').attributes('data-empty')).toBe('true')
  })

  it('sets tree instance ref after mount', async () => {
    const [TreeV2Comp, treeRef] = useTreeV2({
      data: [{ id: '1', label: 'Node 1' }],
    })
    mount(TreeV2Comp)
    await nextTick()
    expect(treeRef.value).toBeDefined()
    expect(typeof treeRef.value?.filter).toBe('function')
    expect(typeof treeRef.value?.getCheckedKeys).toBe('function')
    expect(typeof treeRef.value?.setCheckedKeys).toBe('function')
    expect(typeof treeRef.value?.getNode).toBe('function')
  })

  it('can call exposed methods via tree ref', async () => {
    const [TreeV2Comp, treeRef] = useTreeV2({
      data: [{ id: '1', label: 'Node 1' }],
      showCheckbox: true,
    })
    mount(TreeV2Comp)
    await nextTick()
    treeRef.value?.filter('test')
    treeRef.value?.getCheckedKeys()
    treeRef.value?.getCheckedNodes()
    expect(treeRef.value?.filter).toHaveBeenCalledWith('test')
  })

  describe('async service', () => {
    it('calls useRequest with service when service is provided', () => {
      const mockService = vi.fn(() => Promise.resolve({ list: [{ id: '1', label: 'Async' }] }))
      useTreeV2({
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
      useTreeV2({
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
      useTreeV2({
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
      useTreeV2({
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
      const [TreeV2Comp] = useTreeV2({
        data: [{ id: '1', label: 'Static Node' }],
        service: mockService,
      })
      const wrapper = mount(TreeV2Comp)
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
      const [TreeV2Comp] = useTreeV2({
        data: [{ id: '1', label: 'Static Node' }],
        service: mockService,
      })
      const wrapper = mount(TreeV2Comp)
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
      const [TreeV2Comp] = useTreeV2({
        data: [{ id: '1', label: 'Static Node' }],
        service: mockService,
      })
      const wrapper = mount(TreeV2Comp)
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
      const [TreeV2Comp] = useTreeV2({
        data: [],
        service: mockService,
      })
      const wrapper = mount(TreeV2Comp)
      const tree = wrapper.find('.el-tree-v2')
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
      const [TreeV2Comp] = useTreeV2({
        data: [],
        service: mockService,
      })
      const wrapper = mount(TreeV2Comp)
      const tree = wrapper.find('.el-tree-v2')
      expect(tree.attributes('data-loading')).toBeUndefined()
    })

    it('does not apply vLoading directive when service is not provided', () => {
      const [TreeV2Comp] = useTreeV2({
        data: [],
      })
      const wrapper = mount(TreeV2Comp)
      const tree = wrapper.find('.el-tree-v2')
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
      const [TreeV2Comp] = useTreeV2({
        data: [],
        service: mockService,
      })
      const wrapper = mount(TreeV2Comp)
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
      const [TreeV2Comp] = useTreeV2({
        data: [{ id: '1', label: 'Static Node' }],
        service: mockService,
      })
      const wrapper = mount(TreeV2Comp)
      const nodes = wrapper.findAll('.el-tree-node')
      expect(nodes.length).toBe(0)
    })
  })
})
