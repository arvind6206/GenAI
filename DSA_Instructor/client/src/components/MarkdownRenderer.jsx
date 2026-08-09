import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold text-white mt-6 mb-4">
            {children}
          </h1>
        ),

        h2: ({ children }) => (
          <h2 className="text-2xl font-bold text-white mt-6 mb-3">
            {children}
          </h2>
        ),

        h3: ({ children }) => (
          <h3 className="text-xl font-semibold text-blue-400 mt-5 mb-2">
            {children}
          </h3>
        ),

        h4: ({ children }) => (
          <h4 className="text-lg font-semibold text-white mt-4 mb-2">
            {children}
          </h4>
        ),

        p: ({ children }) => (
          <p className="text-slate-300 leading-7 mb-4">
            {children}
          </p>
        ),

        strong: ({ children }) => (
          <strong className="text-white font-semibold">
            {children}
          </strong>
        ),

        ul: ({ children }) => (
          <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
            {children}
          </ul>
        ),

        ol: ({ children }) => (
          <ol className="list-decimal pl-6 mb-4 space-y-2 text-slate-300">
            {children}
          </ol>
        ),

        li: ({ children }) => (
          <li className="text-slate-300">
            {children}
          </li>
        ),

        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-violet-500 pl-4 my-4 text-slate-400">
            {children}
          </blockquote>
        ),

        pre: ({ children }) => (
          <pre className="bg-[#101A26] p-5 rounded-lg mb-5 overflow-x-auto">
            {children}
          </pre>
        ),

        code: ({ children, className }) => {
          const isCodeBlock = className?.includes("language-");

          if (isCodeBlock) {
            return (
              <code className="text-slate-200 font-mono text-sm">
                {children}
              </code>
            );
          }

          return (
            <code className="bg-[#101A26] text-cyan-400 px-1.5 py-0.5 rounded font-mono text-sm">
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default MarkdownRenderer;