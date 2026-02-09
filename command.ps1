function dev {
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up
}

function prod {
    docker-compose up --build
}

$choice = Read-Host "¿Deseas iniciar en modo dev o prod? (dev/prod)"

switch ($choice) {
    "dev" { dev }
    "prod" { prod }
    default { Write-Host "Opción no válida. Por favor, elige 'dev' o 'prod'." }
}
