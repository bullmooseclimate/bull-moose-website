# Bull Moose Climate Systems website

This is the first design/build draft for Bull Moose Climate Systems.

## Hosting
Designed for Cloudflare Pages with the repository connected to GitHub.

## Current status
- Responsive marketing-site front end included.
- Editable content data files included under `content/`.
- Contact form currently creates an email draft; connect a real form-delivery service before launch.
- Product specifications and testimonials are intentionally not fabricated.
- Admin dashboard/API is a next implementation step. Do not expose an admin route publicly until authentication and GitHub write access have been configured.

## Local preview
Open `index.html` in a browser, or run a static server from this folder.

## Before launch
1. Add the approved company logo asset.
2. Confirm phone number, service towns, social links, and Google review URL.
3. Add verified product specifications from exact manufacturer submittals.
4. Connect secure admin authentication and content-save API.
5. Connect reliable form delivery and test it.
6. Test on mobile and desktop.


## Admin editor (implementation draft)
The `/admin/` editor UI and Pages Function API are included. Before exposing it:
1. Create a Cloudflare Access self-hosted application protecting both `/admin/*` and `/api/admin/*` on the production hostname; allow only your own login identity.
2. In Pages project Settings → Variables and Secrets, add encrypted secrets:
   - `GITHUB_TOKEN`: fine-grained GitHub token restricted to `bull-moose-website`, with Contents read/write permission.
   - `GITHUB_OWNER`: `bullmooseclimate`
   - `GITHUB_REPO`: `bull-moose-website`
   - `GITHUB_BRANCH`: `main`
3. Deploy the Pages project. Confirm Access blocks unauthenticated requests to both paths.
4. Test editor read/save and confirm a commit appears in GitHub.
The API relies on Cloudflare Access protecting both URL patterns and fails closed if the Access assertion header is absent. Do not publish the editor until the Access application and secrets are configured and tested.
