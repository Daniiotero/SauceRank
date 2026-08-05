# SauceRank

App para votar y rankear la discografia de Eladio Carrion.

## Stack

- **Frontend:** React + Vite (nginx, puerto 5173)
- **Backend:** Spring Boot 3 + Java 21 (puerto 8080)
- **Base de datos:** PostgreSQL 16 (puerto 5432)
- **Admin DB:** pgAdmin (puerto 5050)

## Requisitos

- Docker + Docker Compose

## Iniciar la app

```bash
git clone <repo>
cd SauceRank
docker-compose up -d
```

Esperar a que todos los contenedores esten healthy:

| Servicio   | URL                            |
|------------|--------------------------------|
| Frontend   | http://localhost:5173          |
| Backend    | http://localhost:8080          |
| pgAdmin    | http://localhost:5050          |

### pgAdmin

- Email: `admin@saucerank.com`
- Password: `admin123`
- Al entrar, registrar el servidor PostgreSQL:
  - Host: `postgres`
  - Port: `5432`
  - Database: `saucerank`
  - User: `postgres`
  - Password: `<tu-password>`

## Reconstruir un servicio

```bash
docker-compose up --build -d frontend    # solo frontend
docker-compose up --build -d backend     # solo backend
docker-compose up --build -d             # todo
```

## Estructura

```
SauceRank/
├── frontend/            # React + Vite
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/       # Paginas
│   │   ├── context/     # AuthContext
│   │   └── services/    # Llamadas a la API
│   ├── nginx.conf       # Configuracion del servidor
│   ├── vite.config.js   # Vite + optimizacion de imagenes
│   └── Dockerfile
├── backend/             # Spring Boot 3
│   ├── src/
│   └── Dockerfile
├── docker-compose.yml   # Orquestacion de servicios
└── README.md
```

## Tests

Los tests deben pasar antes de cada commit.

### Frontend (Vitest + Testing Library)

```bash
cd frontend
npm test
```

Los ficheros de test viven junto al codigo que prueban
(`*.test.jsx` en `src/`). La configuracion esta en
`vite.config.js` (entorno `jsdom`) y el setup en
`src/test/setup.js`.

### Backend (JUnit 5 + Mockito)

Requisito: tener `JAVA_HOME` apuntando a un JDK (Java 21+).

```bash
cd backend
# Windows
.\mvnw.cmd test
# Linux / macOS
./mvnw test
```

Los tests estan en `backend/src/test/java/`. Usan mocks de los
repositorios, asi que no requieren base de datos ni levantar el
servidor.

## Seguridad

### Hasheo de contraseñas

Las contraseñas se guardan con **bcrypt** (factor de coste **10**,
nunca cifrado reversible ni MD5/SHA1 plano). bcrypt incorpora un
**salt aleatorio único por usuario** embebido en el hash, por lo que
dos usuarios con la misma contraseña obtienen hashes distintos. La
verificación se hace con `matches()`, que es resistente a timing
attacks.

### Verificación de email

Al registrarse la cuenta queda **inactiva** (`enabled=false`) y no
puede iniciar sesión hasta verificar el email con un **token de un
solo uso** (32 bytes aleatorios, guardado como SHA-256, expira en 24
horas). El endpoint `GET /api/auth/verify?token=...` la activa y
borra el token.

La respuesta del registro es siempre la misma ("Revisa tu correo"),
tanto si la cuenta se creó como si el usuario o el email ya existían
(no se confirma que exista → evita *user enumeration*). El login usa
un mensaje único neutro ("Usuario o contraseña incorrectos") tanto
para usuario inexistente, contraseña incorrecta o cuenta sin activar.

**Envío del correo** (`backend/src/main/resources/application.yml`):

```yaml
app:
  mail:
    enabled: ${MAIL_ENABLED:false}    # true en producción
    from: ${MAIL_FROM:noreply@saucerank.com}
  frontend-url: ${FRONTEND_URL:http://localhost:5173}

spring:
  mail:
    host: ${SMTP_HOST:}
    port: ${SMTP_PORT:587}
    username: ${SMTP_USERNAME:}
    password: ${SMTP_PASSWORD:}
```

En desarrollo (`MAIL_ENABLED=false`) los correos se imprimen en el
log del backend: busca la línea
`[DEV] Email a <correo> — Asunto: ... — Cuerpo: ...` (incluye el
enlace de verificación).

### Rate limiting y bloqueo de cuenta

**Rate limiting por IP** (`RateLimitFilter`): limita `POST
/api/auth/login` y `/api/auth/register` a 10 peticiones por IP cada
15 minutos (ventana deslizante in-memory). Al superarlo responde 429
"Demasiadas solicitudes". Configurable en `application.yml`:

```yaml
app:
  security:
    rate-limit:
      max-per-window: 10
      window-minutes: 15
```

**Bloqueo progresivo por cuenta** (`LoginAttemptService`): tras
intentos fallidos consecutivos de login se bloquea temporalmente la
cuenta, con duración que escala:

| Intentos fallidos | Bloqueo |
|---|---|
| 5 | 5 minutos |
| 10 | 15 minutos |
| 15+ | 30 minutos |

- Los intentos durante un bloqueo **lo extienden** (escala a la
  siguiente duración) pero no reenvían el correo.
- El login exitoso **resetea** el contador.
- Al activarse el bloqueo se notifica al usuario **por email**
  (canal distinto al de autenticación) usando la infraestructura de
  `app.mail.*`; en dev se loguea como el resto de correos.
- Durante el bloqueo el login responde 429 con mensaje genérico, sin
  confirmar si la cuenta existe.
- El estado es in-memory: se pierde al reiniciar el backend
  (suficiente para un solo contenedor).

### Contraseñas filtradas (Have I Been Pwned)

Al registrar, el backend rechaza (HTTP 400) las contraseñas que
aparezcan en listas de brechas conocidas. Usa la API
[Pwned Passwords](https://haveibeenpwned.com/Passwords) con el
modelo **k-anonymity**: solo se envía el prefijo de 5 caracteres
hexadecimales del SHA-1 de la contraseña, nunca el hash completo
ni la contraseña en sí. La respuesta incluye el header
`Add-Padding: true` para reducir la información filtrada.

Configuración en `backend/src/main/resources/application.yml`:

```yaml
app:
  security:
    pwned-passwords:
      enabled: true    # false desactiva el chequeo
      timeout-ms: 3000 # timeout de la llamada a la API
```

Si la API no responde (timeout o error), el registro **falla abierto**
(se permite) y se registra un warning en el log, para no bloquear a
usuarios por un problema de disponibilidad externo.