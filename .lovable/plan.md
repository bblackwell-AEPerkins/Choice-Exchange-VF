# Backend Simplification: Demo Mode ✅ COMPLETED

## Status: Implemented on 2025-01-27

### Overview
Convert the app to run in "demo mode" where authentication still works, but all data operations use rich mock data instead of real database queries. This gives you a fully functional demo experience without database complexity.

---

### Phase 1: Create Mock Data Layer

**New file: `src/lib/mockData.ts`**
- Define comprehensive mock datasets for:
  - **Member profile** (Banks Blackwell with full demographics)
  - **Member events** (~20 events: claims, prescriptions, appointments)
  - **ICHRA plans** (5-8 diverse plans with different metal tiers)
  - **Employers and offers** (1-2 sample employers with ICHRA offers)
  - **Coverage enrollments** (active PPO coverage)
- All data will be typed and realistic for demos

---

### Phase 2: Create Demo Data Hook

**New file: `src/hooks/useDemoMode.ts`**
- Central hook that provides all mock data
- Simulates loading delays (200-500ms) for realistic UX
- Tracks enrollment progress in localStorage
- Provides methods like:
  - `getMemberProfile()`
  - `getMemberEvents()`
  - `getPlans(zipCode)` - filters mock plans
  - `saveEnrollmentStep(data)` - persists to localStorage
  - `submitEnrollment()` - generates confirmation number

---

### Phase 3: Simplify Existing Hooks

**Modify: `src/hooks/useEnrollmentDB.ts`**
- Remove all Supabase queries
- Replace with demo mode hook integration
- Keep the same interface so pages don't need changes
- Enrollment state saved to localStorage instead of database

**Modify: `src/hooks/useICHRAEnrollment.ts`**
- Return mock employer, offer, and enrollment data
- Plan selection still works with mock plans
- Attestation/waiver simulated with local state

**Modify: `src/hooks/useMemberEvents.ts`**
- Return mock events directly
- Keep filtering capabilities working on mock data

---

### Phase 4: Update Dashboard & Plan Pages

**Modify: `src/pages/MemberDashboard.tsx`**
- Remove direct Supabase queries
- Use demo hook for member data and events
- Everything else stays the same

**Modify: `src/pages/enrollment/EnrollPlans.tsx`**
- Plan search uses mock data filtered by ZIP
- Subscription and voluntary plan tabs work with mock data

**Modify: `src/pages/ICHRAPlans.tsx`**
- Same approach - mock plan data filtered by ZIP

---

### Phase 5: Optional Database Toggle

**Add: Demo mode toggle (optional)**
- Environment variable or localStorage flag
- `const DEMO_MODE = true` at the top of each hook
- Allows easy switch back to real database later

---

### What Stays the Same
- Authentication (Supabase Auth) - keeps login/logout working
- All UI components and pages
- Navigation and routing
- Form validation and step progression
- User experience and animations

### What Gets Simplified
- No database writes for enrollment
- No RLS policy complexity
- No individual/household/address table joins
- Events and plans are predictable mock data

---

### Benefits
- Demos work reliably every time
- No data corruption or missing records
- Fast loading (no network latency)
- Easy to customize mock data for specific demos
- Can switch back to real database when ready for production

---

### Files to Create
1. `src/lib/mockData.ts` - All mock data definitions
2. `src/hooks/useDemoMode.ts` - Demo mode orchestration

### Files to Modify
1. `src/hooks/useEnrollmentDB.ts` - Use demo data
2. `src/hooks/useICHRAEnrollment.ts` - Use demo data
3. `src/hooks/useMemberEvents.ts` - Use demo data
4. `src/pages/MemberDashboard.tsx` - Remove Supabase queries
5. `src/pages/enrollment/EnrollPlans.tsx` - Use demo plans
6. `src/pages/ICHRAPlans.tsx` - Use demo plans
7. `src/components/NotificationDropdown.tsx` - Use demo events

