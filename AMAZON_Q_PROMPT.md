# VYOM VOID — Design Studio Feature Integration Prompt for Amazon Q

## CONTEXT
I am building VYOM VOID, a dark aesthetic Gen Z streetwear e-commerce platform.
Stack: Node.js + Express backend, Vanilla HTML/CSS/JS frontend, JSON file-based storage.
I already have an admin dashboard with inventory management (full CRUD).

## TASK
Integrate a new "Design Studio" page into my existing admin panel.
I have two ready-made files:
- `design-studio.html` — the full UI (already built)
- `design-api.js` — the Express backend route (already built)

---

## STEP 1 — Add the backend route in server.js

Find my main server file (likely `server.js` or `app.js`) and add these lines
after the existing route imports:

```js
const designRoutes = require('./design-api');
app.use('/api/design', designRoutes);

// Serve the Design Studio admin page
app.get('/admin/design-studio', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'design-studio.html')));
```

Make sure `path` is already imported at the top (`const path = require('path')`).
If not, add it.

---

## STEP 2 — Copy the two new files

1. Copy `design-studio.html` into the `public/` folder
   (same folder as index.html and other frontend pages)

2. Copy `design-api.js` into the project root
   (same level as server.js)

---

## STEP 3 — Add Design Studio link to the existing admin dashboard

In my existing admin HTML file (likely `admin.html` or `admin/index.html`),
find the sidebar navigation or top nav menu and add this new menu item:

```html
<a href="/admin/design-studio" class="nav-item">
  ✦ Design Studio
</a>
```

Match the exact class names and style of existing nav links so it looks consistent.

---

## STEP 4 — Add HF_API_KEY to .env (optional fallback)

In my `.env` file, add this line if it doesn't already exist:
```
HF_API_KEY=
```
Leave the value blank for now. It is used as a fallback only.
Primary image generation uses Pollinations which needs no key.

---

## STEP 5 — Verify the inventory API endpoint

The Design Studio's "Add to Store" button sends a POST request to `/api/products`.

Check my existing server.js:
- If my inventory/products POST endpoint is at `/api/products` → no change needed
- If it is at a different path (e.g. `/api/inventory` or `/admin/api/products`)
  → open `design-studio.html` and find this line:
  ```js
  const res = await fetch('/api/products', {
  ```
  Replace `/api/products` with the correct endpoint path from my server.

---

## EXPECTED RESULT

After these changes:
1. Admin can visit: `http://localhost:PORT/admin/design-studio`
2. The Design Studio page loads with VYOM VOID dark aesthetic UI
3. Admin can generate AI t-shirt designs using prompts
4. Background is removed automatically in the browser (no API cost)
5. Design previews on a t-shirt mockup
6. One-click adds the product to the store inventory

---

## DO NOT CHANGE
- Do not modify the contents of `design-studio.html` or `design-api.js`
- Do not change existing routes or inventory logic
- Do not install any new npm packages
- Do not change the frontend stack (keep vanilla JS)

---

## NOTES FOR AMAZON Q
- The background removal uses `@imgly/background-removal` loaded via CDN (no install needed)
- Image generation hits `https://image.pollinations.ai` — free, no API key
- HuggingFace is a fallback only, triggered from the browser if Pollinations fails
- All processing is client-side except the HF fallback route in design-api.js
