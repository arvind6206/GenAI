import { Bot } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

function AIResponse({ response }) {
  if (!response) return null;

  return (
    <div className="bg-[#101A26] px-4 pb-4">
      
      <div className="bg-[#202E40] border border-slate-700 rounded-xl p-6">

        {/* Heading */}
        <div className="flex items-center gap-3 mb-5">
          <Bot
            className="text-violet-400"
            size={25}
          />

          <h2 className="text-xl font-bold text-white">
            AI Instructor
          </h2>
        </div>

        {/* AI Response */}
        <MarkdownRenderer content={response} />

      </div>

    </div>
  );
}

export default AIResponse;