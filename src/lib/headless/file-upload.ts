// File upload controller for .sig-file-upload markup: click and
// drag/drop on .sig-dropzone feed the hidden input and a .sig-file-list
// renders selections with remove buttons. Framework-free.

import { destroyAll, isDisabled, on } from './dom.js'

export interface FileUploadOptions {
  files?: File[]
  onChange?: (files: File[]) => void
}

export interface FileUploadController {
  files: File[]
  clear(): void
  destroy(): void
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function attachFileUpload(
  root: HTMLElement,
  options: FileUploadOptions = {}
): FileUploadController {
  const dropzone = root.querySelector<HTMLElement>('.sig-dropzone')
  const input = root.querySelector<HTMLInputElement>('input[type="file"]')
  const list = root.querySelector<HTMLElement>('.sig-file-list')
  if (!dropzone || !input)
    throw new Error('sigil: attachFileUpload needs .sig-dropzone and input[type=file]')

  let files = [...(options.files ?? [])]

  function render() {
    if (!list) return
    list.innerHTML = ''
    for (const file of files) {
      const li = document.createElement('li')
      li.className = 'sig-file-item'
      const name = document.createElement('span')
      name.className = 'sig-file-name'
      name.textContent = file.name
      const size = document.createElement('span')
      size.className = 'sig-file-size'
      size.textContent = fmtSize(file.size)
      const rm = document.createElement('button')
      rm.type = 'button'
      rm.className = 'sig-file-remove'
      rm.setAttribute('aria-label', `Remove ${file.name}`)
      rm.textContent = '×'
      li.append(name, size, rm)
      list.append(li)
    }
    list.hidden = files.length === 0
  }

  function setFiles(next: File[]) {
    files = next
    render()
    options.onChange?.([...files])
  }

  function addFiles(incoming: Iterable<File>) {
    const merged = [...files]
    for (const f of incoming)
      if (!merged.some((m) => m.name === f.name && m.size === f.size)) merged.push(f)
    setFiles(merged)
  }

  const unsubs = [
    on(dropzone, 'click', () => {
      if (!isDisabled(root)) input.click()
    }),
    on(dropzone, 'keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && !isDisabled(root)) {
        event.preventDefault()
        input.click()
      }
    }),
    on(dropzone, 'dragover', (event) => {
      event.preventDefault()
      dropzone.dataset.dragging = ''
    }),
    on(dropzone, 'dragleave', () => {
      delete dropzone.dataset.dragging
    }),
    on(dropzone, 'drop', (event) => {
      event.preventDefault()
      delete dropzone.dataset.dragging
      if (isDisabled(root)) return
      addFiles(event.dataTransfer?.files ?? [])
    }),
    on(input, 'change', () => addFiles(input.files ?? [])),
    on(root, 'click', (event) => {
      const rm = (event.target as HTMLElement).closest<HTMLElement>('.sig-file-remove')
      if (!rm) return
      const item = rm.closest<HTMLElement>('.sig-file-item')
      const name = item?.querySelector('.sig-file-name')?.textContent
      setFiles(files.filter((f) => f.name !== name))
    })
  ]

  render()

  return {
    get files() {
      return [...files]
    },
    clear() {
      setFiles([])
    },
    destroy: destroyAll(...unsubs)
  }
}
