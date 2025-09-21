"use client";

interface EditorToolbarProps {
  onProcess: () => void;
  onSave: () => void;
  isProcessing: boolean;
}

export function EditorToolbar({ onProcess, onSave, isProcessing }: EditorToolbarProps) {
  return (
    <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-white">Resume Tailoring</h1>
        <span className="text-sm text-slate-400">Optimize your resume for job postings</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Save Button */}
        <button
          onClick={onSave}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>💾</span>
          Save Draft
        </button>

        {/* Process Button */}
        <button
          onClick={onProcess}
          disabled={isProcessing}
          className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            isProcessing
              ? "bg-blue-600/50 cursor-not-allowed text-blue-300"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <span>🚀</span>
              Process Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
}
