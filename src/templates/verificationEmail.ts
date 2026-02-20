import { emailStyles } from "./emailStyles";
export interface VerificationEmailParams {
    url: string;
    tempPassword: string;
}

export const verificationEmailTemplate = ({
    url,
    tempPassword,
}: VerificationEmailParams): string => `
    <!DOCTYPE html>
        <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    ${emailStyles}
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h1>Verifica tu email</h1    1>
                    </div>
                    <div class"content">
                        <p>¡Bienvenido a Store System!</p>
                        <p>Hemos creado tu cuenta exitosamente. Para activarla y unirte oficialmente a esta familia (XD), necesitas verificar tu correo electrónico.</p>
                        <div class="button-container">
                            <a href="${url}" class="verify-button">
                                Verificar mi cuenta.
                            </a>
                        </div>
                        <div class="credentials-box">
                            <p>Tu contraseña temporal es: <strong>${tempPassword}</strong></p>
                            <p>Recuerda cambiarla por una que puedas recordar.</p>
                        </div>
                        <div class="warning">
                            <p>
                                <strong>
                                Importante</strong>
                                Este enlace expirará en 1 hora. Por tu seguridad, te recomendamos cambiar tu contraseña despues de iniciar sesión por primera vez.
                            </p>
                            <p style="margin-top: 30px; font-size: 14px; color: #6c757d;">Si no solicitaste esta cuenta, puedes ignorar este correo de forma segura.</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Atentamente, el equipo de Store System</p>
                    </div>
                </div>
            </body>
        </html>


`;
