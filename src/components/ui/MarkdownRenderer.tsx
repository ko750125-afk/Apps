import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose max-w-none ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-[#1d1d1f] text-3xl font-bold mb-8 border-b border-[#f5f5f7] pb-4 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-[#1d1d1f] text-xl font-semibold mt-12 mb-6 border-l-4 border-[#0066cc] pl-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[#1d1d1f] text-lg font-semibold mt-8 mb-4 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-[#0066cc]" /> {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-[#424245] leading-relaxed mb-6 text-[16px]">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-3 mb-8 ml-5 text-[#424245]">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          code: ({ children }) => (
            <code className="bg-[#f5f5f7] text-[#0066cc] px-1.5 py-0.5 rounded text-sm font-medium">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-[#1d1d1f] text-white p-6 my-8 overflow-x-auto rounded-2xl relative shadow-lg">
              <div className="absolute top-0 right-0 px-3 py-1 bg-white/10 text-[10px] text-white/40 font-bold tracking-widest uppercase rounded-bl-lg">
                CODE
              </div>
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#e5e5ea] bg-[#f5f5f7] pl-6 py-4 my-8 italic text-[#86868b] rounded-r-lg">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="text-[#1d1d1f] font-bold">
              {children}
            </strong>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#0066cc] hover:underline transition-all font-medium"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
