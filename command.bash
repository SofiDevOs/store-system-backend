#!/bin/bash

function dev {
    echo "Deteniendo contenedores..."
    sudo docker compose -f docker-compose.dev.yml down

    echo "Construyendo imagen..."
    sudo docker compose -f docker-compose.dev.yml build

    echo "Iniciando en modo desarrollo..."
    sudo docker compose -f docker-compose.dev.yml up
}

function dev_clean {
    echo "Limpiando contenedores y volúmenes..."
    sudo docker compose -f docker-compose.dev.yml down -v

    echo "Construyendo imagen desde cero..."
    sudo docker compose -f docker-compose.dev.yml build --no-cache

    echo "Iniciando en modo desarrollo..."
    sudo docker compose -f docker-compose.dev.yml up
}

function prod {
    echo "Deteniendo contenedores..."
    sudo docker compose down

    echo "Construyendo imagen de producción..."
    sudo docker compose build

    echo "Iniciando en modo producción..."
    sudo docker compose up
}

read -p "¿Deseas iniciar en modo dev, dev-clean o prod? (dev/dev-clean/prod): " choice

case $choice in
    dev)
        dev
        ;;
    dev-clean)
        dev_clean
        ;;
    prod)
        prod
        ;;
    *)
        echo "Opción no válida. Por favor, elige 'dev', 'dev-clean' o 'prod'."
        ;;
esac
