# FakerStudio

**Datos ficticios para pruebas de software y formación en ciberseguridad, gratis y en el navegador** · *Free fictitious data for software testing and security training, right in your browser*

👉 **https://unfantasmaenelsistema.github.io/FakerStudio/**

| Herramienta | Qué hace | Antes |
|---|---|---|
| 🪪 [Identidades ficticias](https://unfantasmaenelsistema.github.io/FakerStudio/identidad.html) | Personas españolas inventadas y coherentes: nombre acorde a la edad (nombres más frecuentes del INE por generación), DNI o NIE con letra de control válida, código postal de su provincia, fijo con el prefijo provincial, correo en dominios reservados. Cada una con su retrato ilustrado (Open Peeps), acorde a su sexo y edad. Lotes de hasta 1.000 con semilla repetible y exportación a CSV, JSON y SQL. Comprobador de DNI, NIE y CIF. | FakerUser |
| 💬 [Chat ficticio](https://unfantasmaenelsistema.github.io/FakerStudio/chat.html) | Simulador de conversaciones de mensajería (individual o de grupo, tema claro u oscuro) para clases de concienciación: plantillas de estafas conocidas («hijo en apuros», falso paquete), edición y reordenación de mensajes, PNG a triple resolución y guardado en `.json`. Todas las capturas llevan la marca **FICTICIO**. | WhatsappFaker |

La interfaz está en **español e inglés** y tiene tema **claro u oscuro**. Un botón pasa una identidad generada al chat como contacto, con su retrato.

**Fotos.** Los retratos de las identidades son ilustraciones, no fotos: no son la cara de nadie y salen siempre iguales con la misma semilla. Si para el chat quieres una cara fotorrealista, el editor enlaza a [thispersondoesnotexist.com](https://thispersondoesnotexist.com/) (caras generadas por IA): se guarda la imagen y se sube con «Subir foto». No se integra de forma automática porque esa web no permite leer sus imágenes desde otra página (sin CORS), no deja elegir sexo ni edad y no es nuestra.

## Para qué sirve (y para qué no)

- **Pruebas:** rellenar formularios y bases de datos de prueba con datos que pasan las validaciones, sin usar datos personales reales.
- **Formación:** ejercicios de OSINT, ingeniería social y concienciación con personajes inventados; enseñar lo fácil que es falsificar una captura de chat.
- **No sirve** para suplantar a nadie, registrarse en servicios reales, aportar «pruebas» ni engañar. Por eso la marca «FICTICIO» forma parte de la imagen exportada.

Los documentos tienen la letra de control correcta, así que un número puede coincidir por azar con el de una persona real. Los correos usan `example.com`, `example.org` y `example.net` ([RFC 2606](https://www.rfc-editor.org/rfc/rfc2606)), que no son de nadie.

## Privacidad

Web estática en GitHub Pages: sin servidor, cuentas, base de datos ni analítica. Todo se genera en tu navegador; la conversación y las opciones se guardan solo en su `localStorage`. La foto de perfil que subas se recorta a 192 px y no sale del navegador.

## Detalles técnicos

- HTML, CSS y JavaScript sin compilar. Dependencias: [html2canvas](https://html2canvas.hertzen.com/) 1.4.1 (cdnjs, con SRI) para exportar el PNG, y [DiceBear](https://www.dicebear.com/) 9.4.2 con el estilo [Open Peeps](https://www.openpeeps.com/) de Pablo Stanley (código MIT, ilustraciones CC0), empaquetado en `assets/vendor/` para no depender de un CDN (licencias en `assets/vendor/LICENSE-dicebear.txt`). El generador de identidades ya no depende de Faker ni de Skypack.
- El motor elige peinado, color de pelo (canas desde los 48, casi siempre desde los 62), barba, gafas y tono de piel con un generador propio derivado de la persona, así que no altera el lote y la misma semilla da el mismo retrato.
- `assets/persona.js` es un motor puro (sin DOM) que funciona igual en Node: generador con semilla (cyrb128 + mulberry32), 52 provincias con su código INE, comunidad, prefijos y municipios con CP real, validadores de DNI/NIE/CIF y exportadores (el CSV neutraliza fórmulas y el SQL escapa comillas).
- Todo texto del usuario se escapa antes de pintarse, y un `.json` importado se normaliza (tipos, longitudes, horas, imágenes solo `data:image/...`).
- Iconos del chat: [Material Icons](https://github.com/google/material-design-icons) (Apache 2.0) en SVG con colores literales, para que la imagen exportada sea idéntica a la vista previa.

```
index.html        portada
identidad.html    identidades ficticias   → assets/persona.js (motor) + assets/identidad.js
chat.html         chat ficticio           → assets/chat.js
assets/core.js    marca, ES/EN, tema y utilidades comunes
```

Para probarlo en local: `python -m http.server` en la carpeta y abre `http://localhost:8000`.

---

## English

**FakerStudio** joins two tools. **Fictitious identities** creates consistent made-up Spanish people (age-appropriate first names, valid DNI/NIE check letters, postcodes that match the province, landlines with the right area code, reserved-domain emails), in batches of up to 1,000 with a repeatable seed, exportable to CSV, JSON and SQL, plus a DNI/NIE/CIF checker, each with an illustrated portrait (Open Peeps, CC0) matching their sex and age. **Fictitious chat** builds messaging conversations (one-to-one or group, light or dark) for awareness training, with well-known scam templates, editable and reorderable messages, triple-resolution PNG export and `.json` saving. Every screenshot carries a **FICTITIOUS** mark. Everything runs in your browser; nothing is sent anywhere.

## Licencia · License

Código bajo licencia [MIT](LICENSE).
