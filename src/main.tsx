import { createRoot } from 'react-dom/client'
import App from './ui/app'
import { Container } from './container'

createRoot(document.getElementById('root')!).render(
  <Container>
    <App />
  </Container>
)
