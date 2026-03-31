import './index.css'
import { ReactNode, StrictMode } from 'react'
import { Provider } from '@cexoso/react-singleton'
export const Container: React.FC<{
  children?: ReactNode | undefined
}> = (props) => (
  <StrictMode>
    <Provider>{props.children}</Provider>
  </StrictMode>
)
