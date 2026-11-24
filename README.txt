WAI PHYO AUNG — LOCAL-ASSET BILINGUAL PORTFOLIO
================================================

STATIC WEBSITE: HTML + CSS + VANILLA JAVASCRIPT + BOOTSTRAP 5.3.8

The site has no build step, package install, backend, React or Vite requirement.
All Bootstrap, jQuery, Bootstrap Icons, organisation photos and technology logos
are bundled locally so the core interface does not depend on third-party CDNs.

FOLDER STRUCTURE
----------------
index.html                         Main page structure
css/styles.css                     Portfolio styling, layout and animations
js/app.js                          Language, navigation, motion and photo interactions
translations/en.js                 English text
translations/my.js                 Myanmar text
assets/                            Profile, organisation and portfolio photos
assets/logos/                      Technology logos provided in LogoAndAssets.zip
vendor/bootstrap/                  Local Bootstrap 5.3.8 CSS and JS bundle
vendor/bootstrap-icons/            Local Bootstrap Icons CSS and font files
vendor/jquery/                     Local jQuery 3.7.1 source

LOCAL DEPENDENCIES
------------------
- Bootstrap CSS: vendor/bootstrap/bootstrap.min.css
- Bootstrap JS: vendor/bootstrap/bootstrap.bundle.min.js
- jQuery: vendor/jquery/jquery-3.7.1.js
- Bootstrap Icons: vendor/bootstrap-icons/bootstrap-icons.min.css
- All listed technology logos use assets/logos/*.png
- Google Fonts and Devicon/Simple Icons CDN dependencies have been removed.
- System font stacks are used, with local Myanmar font fallbacks when available.

EXTERNAL LINKS
--------------
The site intentionally keeps clickable external links to the organisations, training
provider, GitHub, LinkedIn and email contact. Those are normal destination links,
not external libraries or image dependencies.

EDITING TRANSLATIONS
--------------------
Edit translations/en.js for English copy and translations/my.js for Myanmar copy.
Keep corresponding keys aligned between both files.

PREVIEW LOCALLY
---------------
For the most reliable preview, start a local static web server from this folder:

  python -m http.server 8000

Then open http://localhost:8000. No server is needed after deployment to Netlify.

DEPLOY TO NETLIFY
-----------------
1. Extract the ZIP.
2. Open https://app.netlify.com/drop.
3. Drag the extracted portfolio folder (the folder containing index.html) to Netlify Drop.

ANIMATIONS & ACCESSIBILITY
--------------------------
Scroll reveals replay as elements leave and re-enter view in either direction. The
certificate photo triggers full-viewport fireworks when it enters view and when clicked.
Other selected milestone photos can use their own sparkle/confetti effects. The Auston
presentation and Technortal training group photos open without celebration effects.
Photo detail captions preserve clickable person and organisation links. Reduced-motion
preferences are respected.
