# 📝 Roadmap de Implementación

Este documento rastrea las tareas pendientes para completar el sistema de autenticación y seguridad.

## 🔐 Autenticación JWT (Prioridad Alta)

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

## 🛡️ Mejoras de Seguridad

- [ ] **Rate Limiting**: Implementar `express-rate-limit` para prevenir fuerza bruta
- [ ] **Helmet**: Configurar headers de seguridad HTTP
- [ ] **Logs**: Mejorar sistema de logs para auditoría de accesos

## 🧪 Testing

- [ ] Crear tests unitarios para el generador de JWT
- [ ] Crear tests de integración para el flujo de login y acceso protegido
