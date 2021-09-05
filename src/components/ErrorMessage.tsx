import React from 'react'
export default function ErrorMessage({ message }: { message: string }): React.ReactElement {
  return <div className="error-message-container">{message}</div>
}
