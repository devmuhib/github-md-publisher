"use client";

import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { Card } from "@/components/ui/card";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <div
        className="prose prose-slate max-w-none dark:prose-invert
          prose-headings:text-foreground prose-p:text-foreground 
          prose-strong:text-foreground prose-code:text-foreground
          prose-pre:bg-muted prose-pre:text-muted-foreground
          prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
          prose-a:text-primary hover:prose-a:text-primary/80"
      >
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({
              inline,
              className,
              children,
              ...props
            }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </Markdown>
      </div>
    </Card>
  );
}
