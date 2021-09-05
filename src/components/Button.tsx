import React from 'react'
interface IButtonProps {
  onClick: (e: React.MouseEvent) => void
  children: React.ReactNode
  disabled?: boolean
  reason?: string
}
function Button({ children, onClick, disabled, reason }: IButtonProps): React.ReactElement {
  return (
    <div className="button-container">
      <button onClick={onClick} disabled={disabled === true}>
        {children}
      </button>
      {disabled === true && reason && <span>{reason}</span>}
    </div>
  )
}

export default Button
