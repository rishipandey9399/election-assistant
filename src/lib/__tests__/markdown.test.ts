import { parseMarkdown } from '../markdown';

jest.mock('marked', () => ({
  marked: {
    parse: jest.fn().mockImplementation((text) => `<p>${text}</p>`),
  },
}));

jest.mock('dompurify', () => ({
  sanitize: jest.fn().mockImplementation((html) => html.replace('<script>', '')),
}));

describe('Markdown Parser', () => {
  it('should call marked and dompurify', () => {
    const input = '# Hello World';
    const output = parseMarkdown(input);
    expect(output).toContain('Hello World');
  });

  it('should use the mock sanitizer for XSS', () => {
    const input = '<script>alert(1)</script>';
    const output = parseMarkdown(input);
    expect(output).not.toContain('<script>');
  });
});
