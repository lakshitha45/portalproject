# Project Development Log — Recent Fixes & Updates

## 1. Version Control & Synchronization
* **Action taken:** Synchronized local work with the remote GitHub repository.
* **Details:** Added all recent enhancements natively (including the `localityService` logic, search improvements, and styling), and successfully pushed the codebase to the `origin/main` branch on `https://github.com/lakshitha45/portalproject`.

## 2. Dropdown Stacking Context Bug (Z-Index Issue)
* **Error:** The job role and skill filter dropdowns (`SearchableDropdown`) were rendering behind the candidate profile cards.
* **Root Cause:** The dropdowns were nested inside the `.filter-section` container, which utilized a CSS animation (`animate-slide-in`). Applying animations in CSS automatically forces the browser to create a new "CSS stacking context". This trapped the dropdown's `z-index` natively within the section, causing it to flow underneath subsequent sibling elements (the candidate cards).
* **Fix Applied:** 
  * Refactored `SearchableDropdown.jsx` entirely to utilize **React Portals** (`ReactDOM.createPortal`). 
  * Portals detach the dropdown panel from the immediate DOM parents and render it directly to `document.body`. 
  * Implemented dynamic screen positioning using `getBoundingClientRect()` to ensure it hovers seamlessly above all layers and ignores any grid/animation stacking constraints.
  * Corrected the `handleClickOutside` listener to track the detached portal ref (`dropdownRef`) so clicks within the panel don't accidentally close the dropdown.

## 3. Candidate Modal Cleanup
* **Issue/Request:** The "Similar Candidates" feature nested inside individual Candidate Profile modals was unnecessary and requested for removal.
* **Fix Applied:** 
  * Removed the asynchronous API fetching hook (`useEffect` requesting `/candidates/search`) and deleted the `similarCandidates` and `loadingSimilar` state variables.
  * Stripped out the bottom profile section that housed the UI card grid and loading skeletons for similar candidates.
  * Cleaned up the file to remove dormant imports (`api/config`, unused icons) to reduce bundle weight and optimize `CandidateModal.jsx`. 

## 4. Brand Logo & Favicon Modernization
* **Issue/Request:** Implement a new primary logo and deploy it across both the tab favicon and the primary navigation UI.
* **Fix Applied:**
  * Carefully reverse-engineered the newly supplied image into a pixel-perfect, scalable **SVG graphic** composed of flat-topped hexadecimal paths (`public/favicon.svg`), utilizing the exact hex colors (Teal, Green, Orange, Yellow).
  * Injected the new SVG into the `<head>` of `public/index.html` via a modern `<link type="image/svg+xml">` tag. 
  * Safely deleted the legacy `favicon.ico` artifact left behind by Create React App to eliminate aggressive browser cache conflicts.
  * Edited `src/components/Sidebar.jsx` to replace the old hardcoded circular SVG logo with a centralized `<img>` tag pointing to the new `/favicon.svg` file, establishing a single source of truth for the brand.
