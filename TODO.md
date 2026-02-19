#  Roadmap de Implementación

Tareas a implementar en el backend. si realizas alguna tarea de esta lista, por favor, marca el checkbox.

##  Autenticación JWT (Prioridad Alta)

El siguiente paso crítico es implementar la seguridad mediante JSON Web Tokens.

- [ ] **Helper de Generación de Tokens**
    - Crear `src/helpers/generate-jwt.ts`
    - Implementar función `generateJWT(uid: string)` usando `jsonwebtoken`
    - Definir expiración (ej. 4 horas)

- [ ] **Middleware de Validación**
    - Crear `src/middlewares/validate-jwt.ts`
    - Leer header `x-token`
    - Verificar firma con `JWT_SECRET_KEY`
    - Inyectar usuario en `req.user`
    - Manejar errores: Token no válido, expirado, sin token

- [ ] **Actualización del Login**
    - Modificar `AuthService.validateInfoUser` para retornar el token junto con el usuario
    - Actualizar `AuthController.loginPost` para enviar el token en la respuesta JSON

- [ ] **Protección de Rutas**
    - Aplicar middleware `validateJWT` a rutas sensibles (ej. `/api/users`, `/api/employees`)
    - Verificar que solo usuarios autenticados puedan acceder

##  Mejoras de Seguridad

- [ ] **Rate Limiting**: Implementar `express-rate-limit` para prevenir fuerza bruta
- [ ] **Helmet**: Configurar headers de seguridad HTTP
- [ ] **Logs**: Mejorar sistema de logs para auditoría de accesos

##  Notificaciones (Nodemailer)

- [ ] **Configuración de Email**
    - Instalar `nodemailer` y sus tipos (`@types/nodemailer`)
    - Configurar variables de entorno (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`)
    - Crear helper de envío de correos (`src/helpers/mailer.ts`)

- [ ] **Notificación de Bienvenida**
    - Crear plantilla HTML para bienvenida de nuevos empleados
    - Integrar envío de email en `AuthService.createNewEmployee`
    - Incluir credenciales temporales o link de activación en el correo

##  Testing

- [ ] Crear tests unitarios para el generador de JWT
- [ ] Crear tests de integración para el flujo de login y acceso protegido
