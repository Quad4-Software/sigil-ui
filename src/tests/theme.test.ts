import { fireEvent, render, screen } from '@testing-library/svelte'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Fixture from './fixtures/theme-fixture.svelte'

describe('createTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  it('resolves system to light under the matchMedia mock', async () => {
    render(Fixture)
    expect(screen.getByRole('button')).toHaveTextContent('light')
    await vi.waitFor(() => expect(document.documentElement.dataset.theme).toBe('light'))
  })

  it('toggles, stamps data-theme, and persists the mode', async () => {
    render(Fixture)
    await fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveTextContent('dark')
    await vi.waitFor(() => expect(document.documentElement.dataset.theme).toBe('dark'))
    expect(localStorage.getItem('sig-test-theme')).toContain('dark')
  })
})
