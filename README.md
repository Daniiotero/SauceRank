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