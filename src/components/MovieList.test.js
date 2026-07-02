import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MovieList from './MovieList.vue'

describe('MovieList', () => {
  it('renders the movie form', () => {
    const wrapper = mount(MovieList)

    expect(wrapper.text()).toContain('Neuen Film hinzufügen')
    expect(wrapper.text()).toContain('Film hinzufügen')
  })
})
