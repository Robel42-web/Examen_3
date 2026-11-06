# Sistema de Información Interactiva (SII ITC)

Frontend moderno para la consulta de información académica del **Instituto Tecnológico de Celaya (TecNM)**. Desarrollado con **React + Vite**, estilizado con **Tailwind CSS v4** y conectado a **Supabase** a través de Edge Functions (`sync-sii`) para sincronización en tiempo real.

---

## 🛠️ Tecnologías Utilizadas

* **React (v18+)**: Librería principal para la construcción de interfaces de usuario basadas en componentes reactivos y eficientes.
* **Vite**: Build tool rápido de última generación que optimiza el servidor de desarrollo y la compilación de producción.
* **Supabase**: Backend-as-a-Service (BaaS) utilizado para la gestión de base de datos PostgreSQL en tiempo real y consumo de Edge Functions.
* **Tailwind CSS (v4)**: Framework de CSS orientado a utilidades para un diseño visual moderno, fluido y responsivo.
* **Lucide React**: Colección de iconos vectoriales para una navegación intuitiva.

---

## 🔒 Arquitectura y Seguridad

* **Cero almacenamiento privado en el navegador:** Siguiendo los requerimientos arquitectónicos de seguridad del sistema, no se almacena información sensible (como tokens, número de control o credenciales) en `localStorage` o `sessionStorage`.
* **Memoria Volátil (React AuthContext):** La sesión del estudiante se maneja exclusivamente en memoria RAM a través del `AuthContext`, destruyéndose automáticamente al cerrar la sesión o refrescar la página.

---

## 🚀 Instrucciones de Instalación y Ejecución Local

Sigue estos pasos para clonar y ejecutar el proyecto en tu entorno local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/Robel42-web/Examen_3.git
cd Examen_3
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
VITE_SUPABASE_URL=[Aquí la URL de tu SUPERBASE]
VITE_SUPABASE_ANON_KEY= Aquí la key de tu SUPERBASE
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

---

## 📸 Capturas de Pantalla del Funcionamiento

### 1. Clonar el repositorio
<img width="1908" height="953" alt="image" src="https://github.com/user-attachments/assets/df66fb80-b11c-4f18-bed0-ea2ecd800af3" />

### 2. Dashboard y Perfil del Estudiante
<img width="933" height="942" alt="image" src="https://github.com/user-attachments/assets/55492790-e504-4437-8cad-6b77c1263df2" />

### 3. Calificaciones y Kardex Académico
<img width="842" height="577" alt="image" src="https://github.com/user-attachments/assets/c1a1c7c3-4929-4761-9978-974d87772315" />

<img width="876" height="465" alt="image" src="https://github.com/user-attachments/assets/342cb9c8-0dac-421b-b728-a555c115aa02" />


### 4. Horario de Clases y Widget del Calendario Oficial (PDF)
<img width="1901" height="795" alt="image" src="https://github.com/user-attachments/assets/bf5b831d-aa0c-4c88-b5bc-8ac1741fbd14" />

<img width="1902" height="951" alt="image" src="https://github.com/user-attachments/assets/1cfb8615-6172-4535-96b8-ca1a84b1a9cd" />

---

📄 Funcionalidades Destacadas

* Widget de Calendario Institucional: Widget flotante que muestra actividades, asuetos y evaluaciones en tiempo real, permitiendo exportar e imprimir directamente el formato oficial en PDF del TecNM.
* Fondo Personalizable: Los alumnos pueden personalizar el diseño visual aplicando su propio fondo mediante URL.
