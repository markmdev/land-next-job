"use client";

import { useState, useEffect } from "react";
import { MarkdownEditor } from "../../../components/editor/markdown-editor";
import { ResumePreview } from "../../../components/editor/resume-preview";
import { EditorToolbar } from "../../../components/editor/editor-toolbar";

export default function EditorPage() {
  const [markdownContent, setMarkdownContent] = useState("");
  const [formattedOutput, setFormattedOutput] = useState<{
    rewritten_resume: string;
    implementation_notes: string[];
    unaddressed_items: string[];
    keyword_summary: {
      high_priority_keywords: string[];
      still_missing_keywords: string[];
    };
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load initial resume content
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll load from the data file
    fetch("/resume.md")
      .then((response) => response.text())
      .then((content) => setMarkdownContent(content))
      .catch((error) => console.error("Error loading resume:", error));
  }, []);

  const handleProcessResume = async () => {
    setIsProcessing(true);
    try {
      // In a real app, this would call the AI agents workflow
      // For now, we'll load the sample output
      const response = await fetch("/003-resume-writer.json");
      const data = await response.json();
      setFormattedOutput(data);
    } catch (error) {
      console.error("Error processing resume:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveResume = () => {
    // In a real app, this would save to backend
    console.log("Saving resume:", markdownContent);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <EditorToolbar
        onProcess={handleProcessResume}
        onSave={handleSaveResume}
        isProcessing={isProcessing}
      />

      {/* Two-Panel Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Markdown Editor */}
        <div className="flex-1 border-r border-slate-800">
          <MarkdownEditor
            value={markdownContent}
            onChange={setMarkdownContent}
            placeholder="Enter your resume in Markdown format..."
          />
        </div>

        {/* Right Panel - Formatted Output */}
        <div className="flex-1">
          <ResumePreview
            data={formattedOutput}
            isLoading={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}
