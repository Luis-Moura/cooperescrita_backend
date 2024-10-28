export const sendVerificationEmailHtml = (url: string) => {
  return `
    <html>
      <head>
        <style>
          .container {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          .content {
            font-size: 16px;
            line-height: 1.5;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            font-size: 16px;
            color: #fff !important;
            background-color: #000000;
            text-decoration: none;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verificação de Conta</h1>
          </div>
          <div class="content">
            <p>Olá,</p>
            <p>Obrigado por se registrar! Por favor, clique no botão abaixo para verificar sua conta:</p>
            <a href="${url}" class="button">Verificar Conta</a>
            <p>Se você não se registrou em nosso site, por favor ignore este email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} CooperEscrita. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
