import { compileToFunctions } from 'vue-template-compiler'
import Vue from 'vue'
import shallow from '~src/shallow'
import mount from '~src/mount'
import VueWrapper from '~src/wrappers/vue-wrapper'
import Component from '~resources/components/component.vue'
import ComponentWithChildComponent from '~resources/components/component-with-child-component.vue'
import ComponentWithNestedChildren from '~resources/components/component-with-nested-children.vue'
import ComponentWithLifecycleHooks from '~resources/components/component-with-lifecycle-hooks.vue'

describe('shallow', () => {
  it('returns new VueWrapper of Vue localVue if no options are passed', () => {
    const compiled = compileToFunctions('<div><input /></div>')
    const wrapper = shallow(compiled)
    expect(wrapper).to.be.instanceOf(VueWrapper)
    expect(wrapper.vm).to.be.an('object')
  })

  it('returns new VueWrapper of Vue localVue with all children stubbed', () => {
    const wrapper = shallow(ComponentWithNestedChildren)
    expect(wrapper).to.be.instanceOf(VueWrapper)
    expect(wrapper.findAll(Component).length).to.equal(0)
    expect(wrapper.findAll(ComponentWithChildComponent).length).to.equal(1)
  })

  it('returns new VueWrapper of Vue localVue with all children stubbed', () => {
    const wrapper = shallow(ComponentWithNestedChildren)
    expect(wrapper).to.be.instanceOf(VueWrapper)
    expect(wrapper.findAll(Component).length).to.equal(0)
    expect(wrapper.findAll(ComponentWithChildComponent).length).to.equal(1)
  })

  it('does not modify component directly', () => {
    const wrapper = shallow(ComponentWithNestedChildren)
    expect(wrapper.findAll(Component).length).to.equal(0)
    const mountedWrapper = mount(ComponentWithNestedChildren)
    expect(mountedWrapper.findAll(Component).length).to.equal(1)
  })

  it('stubs globally registered components when options.localVue is provided', () => {
    const localVue = Vue.extend()
    const info = sinon.stub(console, 'info')
    localVue.component('registered-component', ComponentWithLifecycleHooks)
    const Component = {
      render: h => h('registered-component')
    }
    shallow(Component, { localVue })
    mount(Component, { localVue })

    expect(info.callCount).to.equal(4)
    info.restore()
  })

  it('stubs globally registered components', () => {
    const info = sinon.stub(console, 'info')
    Vue.component('registered-component', ComponentWithLifecycleHooks)
    const Component = {
      render: h => h('registered-component')
    }
    shallow(Component)
    mount(Component)

    expect(info.callCount).to.equal(4)
    info.restore()
  })

  it('does not call stubbed children lifecycle hooks', () => {
    const info = sinon.stub(console, 'info')
    shallow(ComponentWithNestedChildren)
    expect(info.called).to.equal(false)
    info.restore()
  })
})

