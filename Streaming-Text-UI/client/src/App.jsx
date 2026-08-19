import React, { useState } from 'react'

const App = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    setOutput('')       // clear previous response
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // SSE messages are separated by \n\n
        const parts = buffer.split('\n\n')
        buffer = parts.pop() // keep incomplete chunk for next loop

        for (const part of parts) {
          if (!part.startsWith('data: ')) continue
          const dataStr = part.replace('data: ', '').trim()

          if (dataStr === '[DONE]') {
            setLoading(false)
            continue
          }

          try {
            const parsed = JSON.parse(dataStr)
            if (parsed.text) {
              setOutput(prev => prev + parsed.text)
            }
          } catch (err) {
            console.error('Failed to parse chunk:', dataStr)
          }
        }
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col min-h-screen justify-center items-center gap-4'>
      <div className='flex'>
        <input
          className='w-100 h-12 p-2 border flex items-center'
          type="text"
          placeholder="Enter the text here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className='ml-2 bg-blue-400 w-20 p-2 text-3xl rounded-md cursor-pointer'
          onClick={handleSend}
          disabled={loading}
        >
          Send
        </button>
      </div>

      <div className='w-100 min-h-20 p-2 border whitespace-pre-wrap'>
        {output}
        {loading && <span className='animate-pulse'>▍</span>}
      </div>
    </div>
  )
}

export default App