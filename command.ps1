function dev {
    Write-Host "Deteniendo contenedores..." -ForegroundColor Cyan
    docker compose -f docker-compose.dev.yml down

    Write-Host "Construyendo imagen..." -ForegroundColor Cyan
    docker compose -f docker-compose.dev.yml build

    Write-Host "Iniciando en modo desarrollo..." -ForegroundColor Green
    docker compose -f docker-compose.dev.yml up
}

function dev-clean {
    Write-Host "Limpiando contenedores y volúmenes..." -ForegroundColor Yellow
    docker compose -f docker-compose.dev.yml down -v

    Write-Host "Construyendo imagen desde cero..." -ForegroundColor Cyan
    docker compose -f docker-compose.dev.yml build --no-cache

    Write-Host "Iniciando en modo desarrollo..." -ForegroundColor Green
    docker compose -f docker-compose.dev.yml up
}

function prod {
    Write-Host "Deteniendo contenedores..." -ForegroundColor Cyan
    docker compose down

    Write-Host "Construyendo imagen de producción..." -ForegroundColor Cyan
    docker compose build

    Write-Host "Iniciando en modo producción..." -ForegroundColor Green
    docker compose up
}

$choice = Read-Host "¿Deseas iniciar en modo dev, dev-clean o prod? (dev/dev-clean/prod)"

switch ($choice) {
    "dev" { dev }
    "dev-clean" { dev-clean }
    "prod" { prod }
    default { Write-Host "Opción no válida. Por favor, elige 'dev', 'dev-clean' o 'prod'." -ForegroundColor Red }
}
