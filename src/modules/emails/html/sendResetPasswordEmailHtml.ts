export const sendResetPasswordEmailHtml = (url: string) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #021B33;
            color: #FFFFFF;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #FFFFFF;
            color: #021B33;
            border-radius: 8px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header img {
            max-width: 150px;
          }
          .content {
            font-size: 16px;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            font-size: 16px;
            color: #FFFFFF !important;
            background-color: #12577B;
            text-decoration: none;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="cid:logo" alt="Cooperescrita Logo" />
          </div>
          <div class="content">
            <h1>Redefinição de Senha</h1>
            <p>Olá,</p>
            <p>Recebemos uma solicitação para redefinir sua senha. Por favor, clique no botão abaixo para redefinir sua senha:</p>
            <a href="${url}" class="button">Redefinir Senha</a>
            <p>Se você não solicitou a redefinição de senha, por favor ignore este email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Cooperescrita. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
