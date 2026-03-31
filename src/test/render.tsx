import { Container } from '@/container'
import App from '@/ui/App'
import { render as reactRender, cleanup } from '@testing-library/react'

type ReactRenderArgs = Parameters<typeof reactRender>

function destroyIfNeed() {
  cleanup()
  document.body.innerHTML = ''
}
export function render(maybeComponent?: ReactRenderArgs[0], options?: ReactRenderArgs[1]) {
  destroyIfNeed()
  const Component = maybeComponent ?? <App />
  const dom = document.createElement('div')
  document.body.appendChild(dom)
  return reactRender(<Container>{Component}</Container>, {
    ...options,
    container: dom,
  })
}
