import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { ChevronRight } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose max-w-none ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-[#1d1d1f] text-4xl font-black mb-10 border-b border-[#f5f5f7] pb-6 tracking-tight leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-[#1d1d1f] text-2xl font-bold mt-16 mb-8 border-l-4 border-[#0066cc] pl-6 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[#1d1d1f] text-xl font-bold mt-10 mb-6 flex items-center gap-3 tracking-tight">
              <ChevronRight className="w-5 h-5 text-[#0066cc]" /> {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-[#424245] leading-[1.8] mb-8 text-[17px] font-medium whitespace-pre-wrap">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-4 mb-10 ml-6 text-[#424245]">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="leading-[1.7] text-[16px]">
              {children}
            </li>
          ),
          code: ({ children }) => (
            <code className="bg-[#f5f5f7] text-[#0066cc] px-2 py-0.5 rounded-md text-[14px] font-bold">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-[#1d1d1f] text-white p-8 my-10 overflow-x-auto rounded-[1.5rem] relative shadow-2xl border border-white/5">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-white/5 text-[10px] text-white/30 font-black tracking-[0.2em] uppercase rounded-bl-xl border-l border-b border-white/5">
                Terminal
              </div>
              <div className="flex gap-1.5 mb-6 opacity-30">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#0066cc]/20 bg-[#f5f5f7] pl-8 py-6 my-10 italic text-[#6e6e73] rounded-r-2xl text-lg leading-relaxed font-medium">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="text-[#1d1d1f] font-black underline decoration-[#0066cc]/20 decoration-4 underline-offset-4">
              {children}
            </strong>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#0066cc] hover:text-[#004499] underline decoration-[#0066cc]/30 underline-offset-4 transition-all font-bold"
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
