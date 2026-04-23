import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AssistantPage from '@/app/assistant/page';

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  Send: () => <div data-testid="send-icon" />,
  User: () => <div data-testid="user-icon" />,
  Bot: () => <div data-testid="bot-icon" />,
  Sparkles: () => <div data-testid="sparkles-icon" />,
}));

// Mock the global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ reply: 'This is a mocked response from the AI.' }),
  })
) as jest.Mock;

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('Assistant Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the chat interface and initial message', () => {
    render(<AssistantPage />);
    expect(screen.getByText('AI Election Assistant')).toBeInTheDocument();
    expect(screen.getByText(/Hello! I am your AI Election Assistant/i)).toBeInTheDocument();
  });

  it('allows user to type and send a message', async () => {
    render(<AssistantPage />);

    const input = screen.getByPlaceholderText(/Ask about voter ID/i);
    const sendButton = screen.getByRole('button');

    // Type a message
    fireEvent.change(input, { target: { value: 'How do I register?' } });
    expect(input).toHaveValue('How do I register?');

    // Send the message
    fireEvent.click(sendButton);

    // The user's message should appear in the chat
    expect(screen.getByText('How do I register?')).toBeInTheDocument();

    // The input should be cleared
    expect(input).toHaveValue('');

    // Wait for the mock response to be added to the chat
    await waitFor(() => {
      expect(screen.getByText('This is a mocked response from the AI.')).toBeInTheDocument();
    });

    // Verify fetch was called correctly
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ message: 'How do I register?' }),
      })
    );
  });

  it('disables the send button when input is empty', () => {
    render(<AssistantPage />);
    const sendButton = screen.getByRole('button');
    expect(sendButton).toBeDisabled();
  });
});
