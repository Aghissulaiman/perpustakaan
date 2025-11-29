# TODO List

## Peminjaman Component Enhancement

### Completed Tasks
- [x] Add checkActiveLoans function to actions.js to query active loans for a user
- [x] Import checkActiveLoans in PeminjamanForm.jsx
- [x] Add state for confirmation modal (showConfirmModal, confirmMessage)
- [x] Modify handleSubmit to check for active loans before submission
- [x] Add logic to prevent borrowing the same book if already active
- [x] Add confirmation modal for users with existing active loans
- [x] Add submitLoan, handleConfirmSubmit, and closeConfirmModal functions
- [x] Add confirmation modal JSX with appropriate styling

### Implementation Details
- Users can borrow multiple books but will see a confirmation modal if they have active loans
- Users cannot borrow the same book twice if it's still active
- Confirmation modal shows the number of active loans and asks for confirmation
- Modal has "Tidak" (No) and "Ya, Lanjutkan" (Yes, Continue) buttons
- Styling matches the existing design with amber/orange theme for warnings

### Testing Required
- Test borrowing first book (should proceed normally)
- Test borrowing second book with active loan (should show confirmation)
- Test borrowing same book again (should show error)
- Test modal interactions (Yes/No buttons)
