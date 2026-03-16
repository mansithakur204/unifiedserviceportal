import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EligibilityChecker from '@/pages/EligibilityChecker';

// Deep mock for Supabase chaining
const mockOrderResult = vi.fn();

const createChainMock = () => {
  const chain: any = {
    select: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    or: vi.fn(() => chain),
    order: vi.fn(() => mockOrderResult()),
    then: vi.fn(),
    maybeSingle: vi.fn(() => Promise.resolve({ data: null })),
  };
  return chain;
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => createChainMock(),
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
      getSession: () => Promise.resolve({ data: { session: null } }),
    },
  },
}));

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
    lang: 'en',
    setLang: vi.fn(),
  }),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    session: null,
    isAdmin: false,
    loading: false,
  }),
}));

// Mock SchemeCard to avoid its internal supabase calls
vi.mock('@/components/SchemeCard', () => ({
  default: ({ schemeName }: { schemeName: string }) => <div data-testid="scheme-card">{schemeName}</div>,
}));

const renderComponent = () =>
  render(
    <BrowserRouter>
      <EligibilityChecker />
    </BrowserRouter>
  );

describe('EligibilityChecker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOrderResult.mockReturnValue(Promise.resolve({ data: [] }));
  });

  it('renders the heading and form fields', () => {
    renderComponent();
    expect(screen.getByText('Eligibility Checker')).toBeInTheDocument();
    expect(screen.getByText('Enter Your Details')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('State')).toBeInTheDocument();
    expect(screen.getByText('Occupation')).toBeInTheDocument();
  });

  it('renders the Check Eligibility button', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /check eligibility/i })).toBeInTheDocument();
  });

  it('shows no results message after clicking check with no data', async () => {
    mockOrderResult.mockReturnValue(Promise.resolve({ data: [] }));
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /check eligibility/i }));

    await waitFor(() => {
      expect(screen.getByText('No matching schemes found')).toBeInTheDocument();
    });
  });

  it('shows result count when schemes are returned', async () => {
    mockOrderResult.mockReturnValue(Promise.resolve({
      data: [
        { id: '1', scheme_name: 'Test Scheme', category: 'Farmers', type: 'Central', details: 'test' },
        { id: '2', scheme_name: 'Another Scheme', category: 'Women', type: 'State', details: 'test2' },
      ],
    }));
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /check eligibility/i }));

    await waitFor(() => {
      expect(screen.getByText('2 Eligible Scheme(s) Found')).toBeInTheDocument();
    });
  });

  it('renders occupation input field', () => {
    renderComponent();
    const input = screen.getByPlaceholderText(/farmer, student/i);
    expect(input).toBeInTheDocument();
  });
});
