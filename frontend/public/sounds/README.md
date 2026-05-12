# Audio para escenas VR

Esta carpeta debe contener los archivos de sonido ambiente que reproducen las
escenas de Realidad Virtual de MindVenture.

## Archivos esperados

| Archivo | Usado por | Sugerencia |
| --- | --- | --- |
| `olas.mp3` | Escena Playa | Loop de olas suaves del oceano |
| `bosque.mp3` | Escena Bosque (proximamente) | Loop de pajaros y viento entre arboles |
| `espacio.mp3` | Escena Espacio (proximamente) | Loop ambient/drone espacial |

## Como obtener `olas.mp3`

1. Visita https://pixabay.com/sound-effects/search/ocean%20waves/
2. Filtra por duracion mayor a 30 segundos para que el loop no sea repetitivo.
3. Descarga uno con atribucion libre (Pixabay License).
4. Renombralo `olas.mp3` y guardalo en esta carpeta.

Alternativa: https://freesound.org/search/?q=ocean+waves+loop (requiere registro
gratuito y suele exigir atribucion).

## Comportamiento si falta el archivo

`EscenaPlaya` intenta cargar `/sounds/olas.mp3` y reproducirlo en loop con
volumen 0.3. Si el archivo no existe (o el navegador bloquea autoplay), el
catch silencia el error y la escena visual sigue funcionando sin sonido.
