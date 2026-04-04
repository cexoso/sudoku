import { createRoot } from 'react-dom/client'
import App from './ui/app'
import { Container } from './container'

document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false })
document.body.style.cssText = `
  overflow: hidden;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  margin: 0;
`
window.onscroll = () => window.scrollTo(0, 0)

createRoot(document.getElementById('root')!).render(
  <Container>
    <App />
  </Container>
)
