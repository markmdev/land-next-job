"use client";

import { useState, useRef, useEffect } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);

  // Update line numbers when content changes
  useEffect(() => {
    const lines = value.split("\n");
    const numbers = lines.map((_, index) => (index + 1).toString());
    setLineNumbers(numbers);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert tab character
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);

      // Move cursor after the inserted tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900">
        <h2 className="text-lg font-semibold text-white">Resume Editor</h2>
        <p className="text-sm text-slate-400">Edit your resume in Markdown format</p>
      </div>

      {/* Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        <div className="bg-slate-800 px-2 py-4 text-right text-slate-500 text-sm font-mono border-r border-slate-700 min-w-[3rem]">
          {lineNumbers.map((number, index) => (
            <div key={index} className="leading-6">
              {number}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 p-4 bg-slate-900 text-slate-100 font-mono text-sm leading-6 resize-none focus:outline-none focus:ring-0 border-0"
          style={{
            lineHeight: "1.5rem",
            minHeight: "100%",
          }}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
