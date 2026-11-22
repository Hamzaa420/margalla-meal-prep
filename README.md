# Margalla Meal Prep

**Student:** YOUR NAME | **Roll No:** YOUR ROLL | **Section:** YOUR SECTION | CS4032 Assignment 02

Fictional meal-prep business for university students in Islamabad (H-11, H-12, G-11, G-10, I-8). Browse meals, search/filter/sort, view details, build a cart, check out with a validated form, and get a simulated confirmation.

- GitHub: PASTE_REPO_LINK
- Live site: PASTE_VERCEL_LINK
- Final commit: PASTE_HASH

## Commands
```
npm install
npm run dev      # development
npm run build    # production build
npm test         # node --test (business rule test)
```

## Routes
`/` menu · `/items/:id` details · `/cart` · `/checkout` · `/confirmation` · `*` not found

## Features
Search, category filter, vegetarian filter, sort (all combine, stored in URL) · cart with quantities · shared state · controlled form with 4 validated fields · calculated summary · 3 business rules · localStorage cart/method/last order · async mock loader with loading/error/retry · empty states · responsive (390px/1280px) and keyboard accessible.

## Business rules
1. Max 5 per meal per order and never above stock (`checkQuantity`, tested).
2. Delivery only to H-11, H-12, G-11, G-10, I-8 (`checkDelivery`).
3. Minimum order Rs 600; delivery Rs 150, free from Rs 2000 (`calcTotals`).

## Reproduce edge cases
Use the **Demo controls** in the footer:
- *Simulate loading failure*: tick it, see error + Retry; untick, press Retry.
- *Sell out Chicken Karahi Plate*: add it to cart first, then tick it; cart shows a conflict and "Fix my cart".
- Saved cart: edit `mm_cart` in localStorage (e.g. qty 9) and refresh; the cart reports and fixes it.
- Invalid URL: open `/items/zzz` or `/nothing`.

## Simulated operations / limitations
Orders and payments are simulated; name and phone are never stored. No backend. Images are emoji.

## Concept map
| Concept | File | Function/Component |
|---|---|---|
| Routing + params | src/App.jsx, pages/MealDetails.jsx | Routes, useParams |
| Shared state, functional updates | src/App.jsx | setQty, removeItem |
| Effects + cleanup | src/App.jsx | loader useEffect |
| Async code | src/api/loadMeals.js | loadMeals |
| Persistence | src/App.jsx | localStorage effects |
| Business rules | src/rules/rules.js | checkQuantity, checkDelivery, calcTotals, reconcile |
| Controlled form/validation | src/pages/Checkout.jsx | validate, onChange |
| Search/filter/sort | src/pages/Menu.jsx | results chain |
| Test | tests/rules.test.js | node:test |
