import { ReactNode, StrictMode } from 'react'
export const Container: React.FC<{
  children?: ReactNode | undefined
}> = (props) => <StrictMode>{props.children}</StrictMode>
