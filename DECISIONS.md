# Frontend Decisions

## 1. Filters stay when navigating (interaction/state)
- **Problem:** On the reference site, opening an item and going back resets search/filters.
- **Decision:** Store search, category, veg and sort in URL query params (`useSearchParams`).
- **Alternative:** Keep filters in React state in App.
- **Reason:** Back button, refresh and shared links keep the customer's place.
- **Tradeoff:** URL handling is slightly more complex; every filter change must update params.
- **Code:** `src/pages/Menu.jsx` - `update()` and `useSearchParams`.
- **Evidence:** Filter "Protein", open a meal, press Back - filter remains. (screenshot)

## 2. Charges and minimum shown before checkout (information hierarchy/mobile)
- **Problem:** Delivery fee and minimum order appear only at the last step.
- **Decision:** Sticky bottom cart bar plus fee text on menu, details and cart showing total, fee, minimum and free-delivery threshold.
- **Alternative:** Show fees only on the cart page.
- **Reason:** Customers see the real cost early and can add items to reach the minimum.
- **Tradeoff:** Uses screen space on mobile (bar is compact and stacked at 390px).
- **Code:** `src/components/CartBar.jsx`, `src/components/Summary.jsx`.
- **Evidence:** Add one item; bar shows "Add Rs X more". (screenshot)

## 3. Useful empty results (interaction)
- **Problem:** Searches with no results show a blank page.
- **Decision:** Empty state explains the problem, offers "Clear all filters" and a link to bundles; empty dataset has a separate message.
- **Alternative:** Show a toast only.
- **Reason:** Gives a way forward so customers do not leave.
- **Tradeoff:** Extra branch of conditional rendering to maintain.
- **Code:** `src/pages/Menu.jsx` - `results.length === 0` block.
- **Evidence:** Search "xyz" - guidance and buttons appear. (screenshot)
