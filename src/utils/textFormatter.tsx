import React from 'react';

/**
 * Strips raw markdown syntax characters (###, ####, **, ***, $, $$) from text strings.
 */
export const stripMarkdownSyntax = (text: string): string => {
  if (!text) return '';
  return text
    // Replace LaTeX math dollars $h$ or $$h$$ with h
    .replace(/\$\$([^\$]+)\$\$/g, '$1')
    .replace(/\$([^\$]+)\$/g, '$1')
    // Remove header markers ### or #### or ##
    .replace(/^#+\s*/gm, '')
    // Remove bold/italic markers *** or ** or *
    .replace(/\*{2,3}/g, '')
    // Remove blockquote markers > 💡
    .replace(/^>\s*💡?\s*/gm, '')
    .trim();
};

/**
 * Renders raw text containing Markdown/LaTeX math into clean React JSX elements
 * without displaying raw symbols like ###, $$, $, **, ***.
 */
export const renderCleanFormattedText = (text: string): React.ReactNode => {
  if (!text) return null;

  // First replace LaTeX math $...$ or $$...$$ with clean text representation
  const cleanMathText = text
    .replace(/\$\$([^\$]+)\$\$/g, '$1')
    .replace(/\$([^\$]+)\$/g, '$1');

  const lines = cleanMathText.split('\n');

  return (
    <div className="space-y-2 font-sans leading-relaxed">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Remove blockquote markers
        if (trimmed.startsWith('>')) {
          trimmed = trimmed.replace(/^>\s*💡?\s*\**\s*/, '').replace(/\**$/, '');
        }

        // Heading detection (#, ##, ###, ####)
        if (trimmed.startsWith('#')) {
          const cleanHeading = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
          return (
            <h4 key={idx} className="font-extrabold text-indigo-200 text-sm mt-3 mb-1 tracking-tight border-b border-indigo-500/20 pb-1">
              {cleanHeading}
            </h4>
          );
        }

        // Bullet detection (*, -, 1.)
        const isBullet = /^[*-]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed);
        if (/^[*-]\s+/.test(trimmed)) {
          trimmed = trimmed.replace(/^[*-]\s+/, '');
        }

        // Parse inline **bold** text into strong elements
        const parts = trimmed.split(/(\*\*[\s\S]*?\*\*|\*\*\*[\s\S]*?\*\*\*)/g);
        const formattedParts = parts.map((part, pIdx) => {
          if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('***') && part.endsWith('***'))) {
            const cleanBold = part.replace(/\*/g, '');
            return (
              <strong key={pIdx} className="font-bold text-white">
                {cleanBold}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 my-1 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
              <span className="text-slate-200">{formattedParts}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-slate-200">
            {formattedParts}
          </p>
        );
      })}
    </div>
  );
};
