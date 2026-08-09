import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Bottom from './components/Bottom'
import AIResponse from './components/AiResponse'

function App() {
  const [response, setResponse] = useState("")
  return (
   <div className="flex min-h-screen">
  <Sidebar />

  <div className="flex-1">
    <Navbar />
    <Hero/>
    <Bottom setResponse={setResponse}/>
    <AIResponse response={response}/>
  </div>
</div>
  )
}

export default App
