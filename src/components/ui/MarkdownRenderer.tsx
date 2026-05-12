import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { ChevronRight } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  /** 상세 페이지(다크 배경)용. 기본은 밝은 배경용 색상 */
  variant?: 'light' | 'dark';
}

export default function MarkdownRenderer({
  content,
  className = '',
  variant = 'light',
}: MarkdownRendererProps) {
  const isDark = variant === 'dark';

  return (
    <div className={`prose max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          h1: ({ children }) => (
            <h1
              className={
                isDark
                  ? 'text-zinc-50 text-3xl md:text-4xl font-semibold mb-8 border-b border-zinc-800 pb-5 tracking-tight leading-tight'
                  : 'text-[#1d1d1f] text-4xl font-black mb-10 border-b border-[#f5f5f7] pb-6 tracking-tight leading-tight'
              }
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className={
                isDark
                  ? 'text-zinc-100 text-xl md:text-2xl font-semibold mt-12 mb-6 border-l-4 border-blue-500 pl-5 tracking-tight'
                  : 'text-[#1d1d1f] text-2xl font-bold mt-16 mb-8 border-l-4 border-[#0066cc] pl-6 tracking-tight'
              }
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className={
                isDark
                  ? 'text-zinc-100 text-lg md:text-xl font-semibold mt-8 mb-4 flex items-center gap-2 tracking-tight'
                  : 'text-[#1d1d1f] text-xl font-bold mt-10 mb-6 flex items-center gap-3 tracking-tight'
              }
            >
              <ChevronRight
                className={isDark ? 'w-5 h-5 shrink-0 text-blue-400' : 'w-5 h-5 text-[#0066cc]'}
              />
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p
              className={
                isDark
                  ? 'text-zinc-300 leading-relaxed mb-6 text-[17px] font-normal whitespace-pre-wrap'
                  : 'text-[#424245] leading-[1.8] mb-8 text-[17px] font-medium whitespace-pre-wrap'
              }
            >
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul
              className={
                isDark
                  ? 'list-disc space-y-3 mb-8 ml-5 text-zinc-300 marker:text-zinc-500'
                  : 'list-disc space-y-4 mb-10 ml-6 text-[#424245]'
              }
            >
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className={isDark ? 'leading-relaxed text-[16px]' : 'leading-[1.7] text-[16px]'}>
              {children}
            </li>
          ),
          code: ({ children }) => (
            <code
              className={
                isDark
                  ? 'bg-zinc-800/90 text-blue-300 px-2 py-0.5 rounded-md text-[14px] font-medium border border-zinc-700/80'
                  : 'bg-[#f5f5f7] text-[#0066cc] px-2 py-0.5 rounded-md text-[14px] font-bold'
              }
            >
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre
              className={`p-6 md:p-8 my-8 overflow-x-auto rounded-2xl relative shadow-xl border ${
                isDark
                  ? 'bg-zinc-950 text-zinc-200 border-zinc-800'
                  : 'bg-[#1d1d1f] text-white border-white/5'
              }`}
            >
              {!isDark && (
                <>
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-white/5 text-[10px] text-white/30 font-black tracking-[0.2em] uppercase rounded-bl-xl border-l border-b border-white/5">
                    Terminal
                  </div>
                  <div className="flex gap-1.5 mb-6 opacity-30">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                </>
              )}
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className={
                isDark
                  ? 'border-l-4 border-blue-500/50 bg-zinc-900/60 pl-6 py-5 my-8 text-zinc-400 rounded-r-xl text-base leading-relaxed'
                  : 'border-l-4 border-[#0066cc]/20 bg-[#f5f5f7] pl-8 py-6 my-10 italic text-[#6e6e73] rounded-r-2xl text-lg leading-relaxed font-medium'
              }
            >
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong
              className={
                isDark
                  ? 'text-zinc-100 font-semibold'
                  : 'text-[#1d1d1f] font-black underline decoration-[#0066cc]/20 decoration-4 underline-offset-4'
              }
            >
              {children}
            </strong>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                isDark
                  ? 'text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-500/40 font-medium'
                  : 'text-[#0066cc] hover:text-[#004499] underline decoration-[#0066cc]/30 underline-offset-4 transition-all font-bold'
              }
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
