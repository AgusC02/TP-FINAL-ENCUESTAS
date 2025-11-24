# Poll.inc – Plataforma de Encuestas

Poll.inc es una plataforma web para **crear, responder y visualizar encuestas** en tiempo real. Está desarrollada con Next.js, React y un stack moderno orientado a frontend.

---

## 📝 Descripción breve

La aplicación permite:

- Crear encuestas con múltiples preguntas y opciones.
- Compartir el enlace de votación.
- Recibir respuestas anónimas.
- Visualizar resultados en gráficos (histograma y torta), actualizados automáticamente.

La persistencia se realiza sobre un archivo local `database.json`, adecuada para el contexto de Trabajo Práctico.

---

## ✅ Funcionalidades principales

- **Crear encuestas**
  - Definición de título.
  - Alta de preguntas y opciones.

- **Listado de encuestas**
  - Vista de encuestas recientes.
  - Acciones rápidas:
    - 🗳️ Votar.
    - 📊 Ver resultados.

- **Responder encuestas**
  - Formulario dinámico (una pregunta por bloque).
  - Validación para que todas las preguntas sean respondidas.
  - Envío de respuestas a la API.

- **Visualización de resultados**
  - Resultados en tiempo real mediante React Query (refetch periódico).
  - Gráficos:
    - Histograma (barras).
    - Gráfico de torta.
  - Detalle textual de votos y porcentajes por opción.
  - Enlace para compartir la encuesta.

---

## 🧩 Stack tecnológico

- **Framework y lenguaje**
  - Next.js 16 (App Router).
  - React 19.
  - TypeScript.

- **Estilos**
  - Tailwind CSS 4.

- **Gestión de datos**
  - @tanstack/react-query (fetching, cache, refetch de resultados).
  - axios (cliente HTTP).

- **Formularios y validación**
  - Formik (manejo de formularios).
  - Yup (validación en la API de creación de encuestas).

- **Gráficos**
  - chart.js.
  - react-chartjs-2.

- **Persistencia**
  - Archivo local `database.json`, gestionado por `app/lib/database.ts`.

---

## 🔧 Instalación y ejecución

### Requisitos

- Node.js (versión recomendada: 20.x o compatible con Next 16).
- npm o pnpm.

### Pasos

1. Clonar el repositorio:

```bash
git clone <URL_DEL_REPO>
cd TP-FINAL-ENCUESTAS
```
2. Instalar dependencias:
```bash
npm install
# o
pnpm install
```
3. Ejecutar en modo desarrollo:
```bash
npm run dev
```
4. Abrir en el navegador: http://localhost:3000

## 🧾 Notas finales
El proyecto está pensado como Trabajo Práctico, priorizando:

Claridad de código.

Documentación básica de decisiones técnicas.

Uso de un stack moderno y coherente.

La persistencia mediante database.json es adecuada para desarrollo local y demostraciones, pero no está pensada para entornos productivos.

El diseño y la arquitectura permiten extender fácilmente:

Nuevos tipos de preguntas.

Métricas adicionales en los resultados.

Integración futura con una base de datos real o despliegue en la nube.