# Agent

Marketing site for **Agent**, an AI engineering teammate that reads your repo, plans a change, and opens a pull request.

A dependency-free static site — no build step.

## Run locally

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

Then open <http://localhost:8080>.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page markup: hero, features, workflow, pricing, FAQ, CTA, footer |
| `styles.css` | Design tokens, layout, responsive rules, reveal animations |
| `script.js` | Sticky nav, mobile menu, scroll reveals, billing toggle, email validation |

## Notes

- Responsive down to small phones, with a mobile nav menu.
- Honours `prefers-reduced-motion`.
- Fonts load from Google Fonts; everything else is local.
