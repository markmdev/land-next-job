"use client";

import { useState, useEffect } from "react";
import { MarkdownEditor } from "../../../components/editor/markdown-editor";

export default function MasterResumePage() {
  const [markdownContent, setMarkdownContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load master resume content
  useEffect(() => {
    // In a real app, this would fetch from an API
    fetch("/resume.md")
      .then((response) => response.text())
      .then((content) => setMarkdownContent(content))
      .catch((error) => console.error("Error loading resume:", error));
  }, []);

  const handleSaveResume = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would save to backend
      console.log("Saving master resume:", markdownContent);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Master resume saved successfully!");
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Error saving resume. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-white">Master Resume</h1>
          <span className="text-sm text-slate-400">Your complete resume with all experience</span>
        </div>

        <button
          onClick={handleSaveResume}
          disabled={isSaving}
          className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            isSaving
              ? "bg-green-600/50 cursor-not-allowed text-green-300"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <span>💾</span>
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <MarkdownEditor
          value={markdownContent}
          onChange={setMarkdownContent}
          placeholder="Enter your complete resume in Markdown format..."
        />
      </div>
    </div>
  );
}
