export const emailStyles = `
    body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background-color: #f4f4f7;
    }
    .email-container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px 20px;
        text-align: center;
        color: #ffffff;
    }
    .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 600;
    }
    .content {
        padding: 40px 30px;
    }
    .content p {
        color: #51545e;
        font-size: 16px;
        line-height: 1.6;
        margin: 0 0 20px;
    }
    .button-container {
        text-align: center;
        margin: 30px 0;
    }
    .verify-button {
        display: inline-block;
        padding: 14px 40px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 16px;
        transition: transform 0.2s;
    }
    .verify-button:hover {
        transform: translateY(-2px);
    }
    .credentials-box {
        background-color: #f8f9fa;
        border-left: 4px solid #667eea;
        padding: 20px;
        margin: 20px 0;
        border-radius: 4px;
    }
    .credentials-box p {
        margin: 0;
        color: #51545e;
    }
    .temp-password {
        font-family: 'Courier New', monospace;
        font-size: 18px;
        font-weight: bold;
        color: #667eea;
        letter-spacing: 1px;
        margin-top: 10px;
    }
    .warning {
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 15px;
        margin: 20px 0;
        border-radius: 4px;
    }
    .warning p {
        margin: 0;
        color: #856404;
        font-size: 14px;
    }
    .footer {
        background-color: #f8f9fa;
        padding: 20px 30px;
        text-align: center;
        border-top: 1px solid #e9ecef;
    }
    .footer p {
        margin: 0;
        color: #6c757d;
        font-size: 14px;
    }
    @media only screen and (max-width: 600px) {
        .email-container {
            margin: 20px;
        }
        .content {
            padding: 30px 20px;
        }
        .header h1 {
            font-size: 24px;
        }
    }
`;
