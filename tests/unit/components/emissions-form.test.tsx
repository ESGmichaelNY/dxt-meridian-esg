import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EmissionsDataForm } from '@/components/features/data-entry/EmissionsDataForm'
import userEvent from '@testing-library/user-event'

// Mock the mutation hook that will submit data
vi.mock('@/hooks/mutations/use-emissions-data', () => ({
  useEmissionsData: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  })
}))

describe('EmissionsDataForm', () => {
  const mockOnSuccess = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all required form fields', () => {
    render(<EmissionsDataForm onSuccess={mockOnSuccess} />)
    
    // Check for Scope 1 emissions input
    expect(screen.getByLabelText(/scope 1 emissions/i)).toBeInTheDocument()
    
    // Check for Scope 2 emissions input
    expect(screen.getByLabelText(/scope 2 emissions/i)).toBeInTheDocument()
    
    // Check for Scope 3 emissions input (optional)
    expect(screen.getByLabelText(/scope 3 emissions/i)).toBeInTheDocument()
    
    // Check for date period selectors
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument()
    
    // Check for unit selector
    expect(screen.getByLabelText(/unit/i)).toBeInTheDocument()
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('should validate required fields before submission', async () => {
    const user = userEvent.setup()
    render(<EmissionsDataForm onSuccess={mockOnSuccess} />)
    
    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/scope 1 emissions is required/i)).toBeInTheDocument()
    })
    
    // Should not call onSuccess
    expect(mockOnSuccess).not.toHaveBeenCalled()
  })

  it('should accept valid numeric input for emissions data', async () => {
    const user = userEvent.setup()
    render(<EmissionsDataForm onSuccess={mockOnSuccess} />)
    
    // Fill in valid data
    const scope1Input = screen.getByLabelText(/scope 1 emissions/i)
    await user.type(scope1Input, '1234.56')
    
    // Verify the input value
    expect(scope1Input).toHaveValue(1234.56)
  })

  it('should not accept negative values for emissions', async () => {
    const user = userEvent.setup()
    render(<EmissionsDataForm onSuccess={mockOnSuccess} />)
    
    const scope1Input = screen.getByLabelText(/scope 1 emissions/i)
    await user.type(scope1Input, '-100')
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/must be a positive number/i)).toBeInTheDocument()
    })
  })

  it('should handle form submission with valid data', async () => {
    const user = userEvent.setup()
    const { useEmissionsData } = await import('@/hooks/mutations/use-emissions-data')
    const mockMutate = vi.fn().mockResolvedValue({ success: true })
    
    vi.mocked(useEmissionsData).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    })
    
    render(<EmissionsDataForm onSuccess={mockOnSuccess} />)
    
    // Fill in all required fields
    await user.type(screen.getByLabelText(/scope 1 emissions/i), '1000')
    await user.type(screen.getByLabelText(/scope 2 emissions/i), '500')
    await user.type(screen.getByLabelText(/scope 3 emissions/i), '200')
    
    // Set dates
    await user.type(screen.getByLabelText(/start date/i), '2025-01-01')
    await user.type(screen.getByLabelText(/end date/i), '2025-01-31')
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)
    
    // Verify mutation was called with correct data
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        scope1: 1000,
        scope2: 500,
        scope3: 200,
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        unit: 'tCO2e', // default unit
      })
    })
  })

  it('should show loading state during submission', async () => {
    const { useEmissionsData } = await import('@/hooks/mutations/use-emissions-data')
    
    vi.mocked(useEmissionsData).mockReturnValue({
      mutate: vi.fn(),
      isPending: true, // Set loading state
      isError: false,
      error: null,
    })
    
    render(<EmissionsDataForm onSuccess={mockOnSuccess} />)
    
    // Submit button should be disabled and show loading text
    const submitButton = screen.getByRole('button', { name: /saving/i })
    expect(submitButton).toBeDisabled()
  })

  it('should display error message on submission failure', async () => {
    const { useEmissionsData } = await import('@/hooks/mutations/use-emissions-data')
    
    vi.mocked(useEmissionsData).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: true,
      error: new Error('Failed to save emissions data'),
    })
    
    render(<EmissionsDataForm onSuccess={mockOnSuccess} />)
    
    // Should show error message
    expect(screen.getByText(/failed to save emissions data/i)).toBeInTheDocument()
  })
})
