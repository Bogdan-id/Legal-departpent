import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
// @ts-ignore
import DeclarationForm from '../../src/components/DeclarationForm.vue'

describe('DeclarationForm.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(DeclarationForm, {
      propsData: { msg }
    })
    expect(wrapper.text()).to.include(msg)
  })
})
