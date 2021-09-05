import React from 'react'
interface IButtonProps {
  onClick: (e: React.MouseEvent) => void
  children: React.ReactNode
}
function Button({ children, onClick }: IButtonProps): React.ReactElement {
  return <button onClick={onClick}>{children}</button>
}

export default Button
