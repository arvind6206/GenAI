import React, { useState } from "react";
import axios from 'axios'

import {
  CircleQuestionMark,
  Info,
  Terminal,
  Send,
} from "lucide-react";

function Bottom({setResponse}) {
  const [query, setQuery] = useState("");

  const handleSend = async () => {
    if (!query.trim()) return;

   try {
    const res = await axios.post("http://localhost:3000/api/instructor", {
        
            question: query
    
    })
    console.log(res.data)
    setResponse(res.data.answer)
   } catch (error) {
    console.log(error)
   }
  };

  return (
    <div className="w-full bg-[#101A26] px-4 pb-4">

      <div className="w-full bg-[#202E40] border border-slate-700 rounded-xl overflow-hidden">

        <div className="flex items-center gap-3 px-7 py-5 border-b border-slate-700">
          <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
            <CircleQuestionMark
              size={16}
              className="text-[#202E40]"
            />
          </div>

          <h2 className="text-slate-100 text-xl font-bold">
            Ask a Coding Question
          </h2>
        </div>

        <div className="px-7 py-7">

          <div className="flex gap-4 border-l-4 border-violet-500 rounded-l-xl px-5 py-5 mb-7">

            <Info
              size={25}
              className="text-violet-400 shrink-0 mt-1"
            />

            <div className="text-slate-200">
              <p className="leading-7">
                <span className="font-bold">How to use:</span>{" "}
                Ask any coding-related question in any programming
                language. The AI is specialized to help with
                programming problems.
              </p>

              <p className="mt-1">
                For non-coding questions, responses may be unpredictable!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Terminal
              size={24}
              className="text-slate-200"
            />

            <h3 className="text-lg font-bold text-slate-100">
              Your Coding Question
            </h3>
          </div>

          <div className="relative">

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Explain closures in JavaScript, How to implement binary search in Python..."
              className="
                w-full
                h-44
                bg-[#202E40]
                border
                border-violet-500
                rounded-lg
                px-6
                py-5
                pr-16
                pb-16
                text-slate-200
                placeholder:text-slate-500
                placeholder:font-mono
                outline-none
                resize-none
                focus:border-violet-400
              "
            />

            <button
              onClick={handleSend}
              disabled={!query.trim()}
              className="
                absolute
                bottom-5
                right-5
                w-11
                h-11
                flex
                items-center
                justify-center
                bg-violet-600
                rounded-lg
                text-white
                hover:bg-violet-500
                transition
                cursor-pointer
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              <Send size={20} />
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Bottom;