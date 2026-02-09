function dev {
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up
}

function prod {
    docker-compose up --build
}

read -p "¿Deseas iniciar en modo dev o prod? (dev/prod): " choice

case $choice in
    dev)
        dev
        ;;
    prod)
        prod
        ;;
    *)
        echo "Opción no válida. Por favor, elige 'dev' o 'prod'."
        ;;
esac
