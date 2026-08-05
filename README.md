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