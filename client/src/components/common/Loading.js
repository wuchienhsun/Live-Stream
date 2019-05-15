import React from 'react'
import loading from './loading.gif';

export default function Loading() {
  return (
    <div>
      <img 
      src={loading} 
      style={{width: '20px', margin: 'auto', display: 'block'}}
      alt="Loading..." />
    </div>
  )
}
