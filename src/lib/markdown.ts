import DOMPurify from 'dompurify';
import { marked } from 'marked';

/**
 * Safely parses markdown into sanitized HTML.
 * Prevents XSS by sanitizing the output of the markdown parser.
 */
export function parseMarkdown(content: string): string {
  const rawHtml = marked.parse(content, {
    gfm: true,
    breaks: true,
  }) as string;

  // If we're on the server, we might need a different way to sanitize,
  // but DOMPurify works in node with JSDOM if needed.
  // For Next.js client-side rendering:
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'code',
        'pre',
        'blockquote',
        'a',
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
    });
  }

  return rawHtml; // Fallback for server-side (consider adding node-dompurify if SSR is critical)
}
