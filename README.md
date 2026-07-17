# Jampa Durga Lakshmi Narayana Portfolio

A static, responsive portfolio site for Jampa Durga Lakshmi Narayana. It is ready for public deployment on Vercel, Cloudflare Pages, or GitHub Pages without a build step or environment variables.

## Production setup

- Entry point: `index.html` at the repository root.
- Publish directory: repository root.
- Build command: none.
- Runtime dependencies: none.
- Content data: JSON files in `data/` loaded from same-origin relative paths.
- Assets: images, SVG icons, and the resume are tracked in `assets/` and use relative paths.

Do not open the site from a `file:` URL when testing the dynamic sections. Use any local static server instead, because browsers restrict JSON requests from local files. Deployed static hosts serve these requests from the same origin, so no CORS configuration is required.

## Deploy to Vercel

1. Create a Git repository containing this project and push it to GitHub.
2. In Vercel, create a new project and import the repository.
3. Leave the framework preset as static/other.
4. Leave the build command empty and set the output directory to the repository root if Vercel asks for one.
5. Deploy the project. Vercel assigns a public HTTPS URL automatically.
6. For a custom domain, add it under the project Domains settings, then create the exact DNS records Vercel displays at your domain registrar.
7. Wait for domain verification and automatic SSL issuance, then enable the preferred-domain redirect and HTTPS enforcement.

Each push to the production branch creates a new production deployment. Use preview deployments to test changes before merging.

## Deploy to Cloudflare Pages

1. Push this project to GitHub.
2. In Cloudflare, create a Pages project from the repository.
3. Set the production branch to the branch used for releases.
4. Set the build command to `exit 0` and the build output directory to `.`.
5. Deploy the project. Cloudflare Pages assigns a public HTTPS URL automatically.
6. Add a custom domain from the Pages project settings before changing DNS. Follow the dashboard-provided DNS instructions exactly.
7. Keep the generated HTTPS certificate active and configure one canonical domain with a redirect from the alternate domain.

## Deploy to GitHub Pages

1. Push this project to a GitHub repository.
2. In repository settings, open Pages.
3. Select deployment from a branch, choose the production branch, and select the repository root as the publishing folder.
4. Save the settings and wait for the Pages deployment to finish.
5. For a custom domain, verify the domain in GitHub first, add it in the Pages settings, then create the DNS records GitHub specifies.
6. Enable HTTPS enforcement after the certificate is available.

The `.nojekyll` file ensures GitHub Pages publishes the static project without Jekyll processing.

## Custom domain and SEO

Choose one canonical public address before sharing the site. Configure the other common hostname to permanently redirect to it. DNS and certificate validation can take time to propagate; do not remove the verification records until the host confirms the domain is active.

`robots.txt` permits indexing. Add a production `sitemap.xml` only after selecting the final public domain, because sitemap entries must contain that real canonical URL.

## Updating content

- Edit project details in `data/projects.json`.
- Edit certifications, achievements, skills, experience, coding profiles, and GitHub dashboard data in their matching files in `data/`.
- Replace `hero.jpg` if the portrait changes.
- Replace the PDF in `assets/resume/` if the resume changes, keeping the existing filename or updating the resume link in `index.html`.
- Update the GitHub and LinkedIn URLs in `index.html` when those profiles change.

## Contact form behavior

The form validates the visitor's details and opens their installed email application with a pre-filled message. This is intentionally backend-free, so it works on all supported static hosts. Direct email and phone links are also provided.

## Pre-release checklist

1. Confirm every external profile and project link points to a live destination.
2. Open the production URL on desktop and mobile.
3. Check the resume, profile image, project images, JSON-rendered sections, navigation, filters, and contact form.
4. Verify the custom domain resolves over HTTPS without authentication.
5. Update `sitemap.xml` with the final canonical URL if search-engine indexing is required.
