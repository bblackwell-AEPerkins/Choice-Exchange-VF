

## Plan: Univision Employer Code → New Edge + Voluntary Benefits Path

### Summary

When "UNIVISION" is typed on RoleSelect, the user enters a streamlined enrollment: Intent (voluntary-only) → Household → Plans page. The Plans page shows a featured New Edge Health card ($249/mo) at the top, ICHRA at $0, no ICHRA tab — just New Edge + voluntary benefits accordion below it.

### Changes by File

**1. `src/pages/RoleSelect.tsx`** (~line 49-58)
- In `handleInviteSubmit`: check if `inviteCode.toUpperCase() === "UNIVISION"` → navigate to `/enroll/entry?source=univision` instead of `/individual/intake`

**2. `src/stores/enrollmentConfigStore.ts`**
- Add `employerCode: string | null` to state and `setEmployerCode` action
- Add `"univision"` to `entryChannel` union type

**3. `src/pages/enrollment/EnrollEntry.tsx`**
- Add `"univision"` channel detection in the `useEffect`: if `source === "univision"`, set channel to `"univision"` and store employer code
- Add `CHANNEL_INFO.univision` with Univision-branded welcome copy
- On continue, navigate to `/enroll/intent` (same as current)

**4. `src/hooks/useEnrollmentStore.ts`**
- Extend `EnrollmentIntent.coverageType` to `"health" | "voluntary_only" | null`
- In `canAccessStep`: when `coverageType === "voluntary_only"`, allow direct access to `household` and `plans` (skip account/about/coverage validation)

**5. `src/pages/enrollment/EnrollIntent.tsx`**
- Add a new radio option: `"voluntary_only"` — "Voluntary Benefits Enrollment" with description "I want to enroll in wellness programs and voluntary benefits"
- Update the type cast to accept `"voluntary_only"`
- In `handleNext`: if `coverageType === "voluntary_only"`, navigate to `/enroll/household` (skip account/about)

**6. `src/pages/enrollment/EnrollHousehold.tsx`**
- In `handleNext` (~line 88-92): if `intent.coverageType === "voluntary_only"`, navigate to `/enroll/plans` instead of `/enroll/coverage`

**7. `src/pages/enrollment/EnrollPlans.tsx`** (the main work)
- Read `intent.coverageType` from the store
- Define `NEW_EDGE_HEALTH` constant at top of file:
  ```
  id: "new-edge-health", name: "Get Fit PHMP Now Program",
  carrier: "New Edge Health", monthlyPremium: 249,
  features: ["Monthly telehealth visits", "Semaglutide prescription delivered home",
             "Dedicated wellness coach", "Pre-tax through payroll"]
  ```
- Add `newEdgeEnrolled` boolean state
- When `coverageType === "voluntary_only"`:
  - Hide the ICHRA/Voluntary tabs entirely
  - Show a single-page layout: New Edge featured card at top, then voluntary benefits accordion below
  - New Edge card: prominent styling with Leaf icon, $249/mo, feature list, "Enroll" / "Enrolled ✓" toggle button
  - Voluntary accordion renders exactly as current voluntary tab content (reuse existing code)
  - Cost summary at top shows New Edge ($249 if enrolled) + voluntary selections, labeled "Employee-paid"
  - Back button goes to `/enroll/household`
  - Next button labeled "Review & Submit" → navigates to `/enroll/review`
- When `coverageType === "health"`: everything works exactly as today (no changes to ICHRA path)

### Flow

```text
RoleSelect ("UNIVISION")
  → EnrollEntry (Univision welcome)
    → EnrollIntent (selects "Voluntary Only")
      → EnrollHousehold
        → EnrollPlans (New Edge card + voluntary benefits below, $0 ICHRA)
          → EnrollReview → EnrollSubmit
```

### What stays the same
- Existing ICHRA enrollment path is completely untouched
- Voluntary benefits accordion UI is reused as-is
- No new files created
- No database changes

