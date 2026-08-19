import React from 'react'

const App = () => {
  return (
    <div className='flex min-h-screen justify-center items-center'>
      <input className='w-100 h-12 p-2 border flex items-center '
      type="text" placeholder="Enter the text here"/>
      <button className='ml-2 bg-blue-400 w-20 p-2 text-3xl rounded-md cursor-pointer'>Send</button>
    
    </div>
  )
}

export default App
