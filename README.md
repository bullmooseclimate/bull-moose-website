# Bull Moose Climate Systems website

## Included
- Responsive, warm residential HVAC website using the exact owner-supplied logo at `assets/logo.jpg`.
- Automatic homepage slideshow with topic/category buttons that highlight with each slide; selecting a topic pauses automatic rotation.
- Dashboard controls to add, remove, reorder, show/hide and edit slide categories, images, text, CTA labels and links.
- Admin image upload to `assets/uploads/` (5 MB maximum; JPG/JPEG/PNG/WEBP/GIF).
- Dashboard editors for services, heat-pump products, project gallery, testimonials, business details, about and maintenance text.
- Preliminary BTU range estimator (not Manual J).
- Quote form can use a Formspree endpoint; if none is configured it falls back to an email draft.
- Cloudflare Pages Functions use GitHub Contents API to save content and images.

## GitHub layout
The repository root must contain `index.html`, `styles.css`, `script.js`, `efficiency-maine.html`, and the folders `assets/`, `content/`, `admin/`, `functions/`. Preserve this folder structure.

## Cloudflare Pages
Connect the GitHub repository. Framework preset: None. Build command: blank. Build output directory: `.`.

Set these environment variables:
- `GITHUB_TOKEN`: fine-grained token limited to this repository with Contents read/write
- `GITHUB_OWNER`: `bullmooseclimate`
- `GITHUB_REPO`: `bull-moose-website`
- `GITHUB_BRANCH`: `main`

## Security — required before launch
Configure Cloudflare Access applications and allow policies for BOTH:
- `https://YOUR-DOMAIN/admin/*`
- `https://YOUR-DOMAIN/api/admin/*`

Allow only the owner's identity. Cloudflare Access must validate the JWT at the edge. The function checks for the Access assertion header but does not independently verify the JWT signature; do not deploy the admin editor publicly without the Access policies.

## Quote form
To enable direct online submission, create a Formspree form and enter its endpoint in Admin → Business information → Online quote form endpoint. Until then, the form opens an email draft. Do not consider it a live server-side form until a real endpoint is configured and tested.

## BTU estimator
The calculator uses a simplified square-footage rule of thumb adjusted by user-selected ceiling height, insulation and window exposure. It is only a conversation starter; it is not Manual J, does not account for all Maine design conditions, and must not be used alone to select equipment.

## Before public launch
- Add and verify business phone number.
- Add only manufacturer-verified product data and real project photos.
- Add genuine customer testimonials only with permission.
- Configure and test Cloudflare Access and GitHub credentials.
- Configure and test the online quote form endpoint.
- Test admin save, image upload, slideshow and all links on the deployed site.
