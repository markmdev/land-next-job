"use client";

interface ResumeData {
  rewritten_resume: string;
  implementation_notes: string[];
  unaddressed_items: string[];
  keyword_summary: {
    high_priority_keywords: string[];
    still_missing_keywords: string[];
  };
}

interface ResumePreviewProps {
  data: ResumeData | null;
  isLoading: boolean;
}

export function ResumePreview({ data, isLoading }: ResumePreviewProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Processing resume...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex flex-col bg-slate-900">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900">
          <h2 className="text-lg font-semibold text-white">Resume Preview</h2>
          <p className="text-sm text-slate-400">AI-optimized resume will appear here</p>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-slate-500">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-lg mb-2">No resume processed yet</p>
            <p className="text-sm">Click "Process Resume" to see the AI-optimized version</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900">
        <h2 className="text-lg font-semibold text-white">Resume Preview</h2>
        <p className="text-sm text-slate-400">AI-optimized resume output</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Rewritten Resume */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Rewritten Resume</h3>
            <div className="bg-slate-900 rounded p-4 border border-slate-700">
              <pre className="text-slate-100 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {data.rewritten_resume}
              </pre>
            </div>
          </div>

          {/* Implementation Notes */}
          {data.implementation_notes && data.implementation_notes.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Implementation Notes</h3>
              <ul className="space-y-2">
                {data.implementation_notes.map((note: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className="text-slate-300 text-sm">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Unaddressed Items */}
          {data.unaddressed_items && data.unaddressed_items.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Unaddressed Items</h3>
              <ul className="space-y-2">
                {data.unaddressed_items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">⚠</span>
                    <span className="text-slate-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Keyword Summary */}
          {data.keyword_summary && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Keyword Analysis</h3>

              {/* High Priority Keywords */}
              {data.keyword_summary.high_priority_keywords && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-green-400 mb-2">High Priority Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.keyword_summary.high_priority_keywords.map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-900/30 border border-green-700 rounded-full text-green-300 text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Still Missing Keywords */}
              {data.keyword_summary.still_missing_keywords && data.keyword_summary.still_missing_keywords.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-red-400 mb-2">Still Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.keyword_summary.still_missing_keywords.map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-900/30 border border-red-700 rounded-full text-red-300 text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
