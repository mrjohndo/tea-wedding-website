# Khoa & John — Wedding Website

A single-page, mobile-friendly wedding website for GitHub Pages.

## Deploy to GitHub Pages

1. **Create a GitHub repository** (e.g. `wedding-website` or `username.github.io`).

2. **Push this code** to the repository:

   ```bash
   git init
   git add .
   git commit -m "Add wedding website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/wedding-website.git
   git push -u origin main
   ```

3. **Enable GitHub Pages** in your repo:
   - Go to **Settings → Pages**
   - Under **Source**, select **Deploy from a branch**
   - Choose branch: `main`, folder: `/ (root)`
   - Click **Save**

4. Your site will be live at:
   - `https://YOUR_USERNAME.github.io/wedding-website/` (project repo)
   - `https://YOUR_USERNAME.github.io/` (if repo is named `YOUR_USERNAME.github.io`)

## Connect the RSVP Form

The RSVP form uses [Formspree](https://formspree.io) (free tier available):

1. Sign up at [formspree.io](https://formspree.io) and create a new form.
2. Copy your form ID (e.g. `xyzabcde`).
3. In `index.html`, replace `YOUR_FORM_ID` in the form action:

   ```html
   action="https://formspree.io/f/xyzabcde"
   ```

RSVP responses will be emailed to you via Formspree.

## Customize

- Edit content in `index.html` and translations in `js/i18n.js`
- Adjust colors in `css/style.css` (`:root` variables)
- Update event details as arrangements are confirmed (e.g. tea ceremony buses)

## Local Preview

Open `index.html` in a browser, or run a simple server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
