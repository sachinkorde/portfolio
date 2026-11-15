# My Portfolio

A simple, dependency-free portfolio site (HTML + CSS + JS).

## Edit your content
All text lives in **`js/data.js`** — name, role, about, skills, projects, experience, and links.
To add a project, copy one of the objects in the `projects` array. Optional fields:
- `link` – live demo URL
- `repo` – source code URL
- `image` – screenshot path, e.g. `assets/project1.png`

## Resume
Save your resume as **`assets/resume.pdf`** (or change `resumeFile` in `js/data.js`).

## View it
Open `index.html` in your browser — no build step needed.

## Deploy (free)
GitHub Pages, Netlify, or Vercel — just upload this folder.

## Updating the resume
The resume source is `resume/resume.html` (ATS-friendly: single column, plain text).
After editing it, export a new PDF and copy it into `assets/`:

```bash
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --no-pdf-header-footer --print-to-pdf="resume/Sachin_Korde_Resume.pdf" "file:///D:/Personal_Projects/my_portfolio/resume/resume.html"
cp resume/Sachin_Korde_Resume.pdf assets/Sachin_Korde_Resume.pdf
```
