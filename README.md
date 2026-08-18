# AOC Façades — landing scroll-driven

Landing page pilotée au scroll : vidéo de fond scrubbée, titre display qui s'efface,
panneau « À propos » en verre dépoli qui remonte, navigation en pastilles.

## Lancer en local

```bash
npm install
npm run dev      # http://localhost:5720
npm run build    # build de production dans dist/
```

## Stack

React 19 · Vite 6 · Tailwind CSS v4 (`@tailwindcss/vite`) · GSAP (ScrollTrigger + ScrollToPlugin) · react-router-dom

## Vidéo

`public/hero.mp4` — ré-encodée depuis la source (H.264, CRF 20, GOP 15) pour que le
scrub au scroll reste fluide : sans keyframes rapprochées, chaque `currentTime` force
le décodeur à repartir d'une image-clé lointaine et l'animation saccade.

## Structure

- `src/components/ScrollVideo.jsx` — vidéo plein écran, position de lecture liée au scroll + parallaxe souris
- `src/components/ScrollFloat.jsx` — titre découpé en caractères, disparition au scroll
- `src/components/GlassPanel.jsx` — panneau « À propos » + bandeau défilant de marques
- `src/components/PillNav.jsx` — navigation pastilles avec remplissage liquide au survol
