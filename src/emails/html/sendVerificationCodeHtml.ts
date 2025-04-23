export const sendVerificationCodeHtml = (code: string) => {
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
            <h1>Código de Verificação</h1>
            <p>Seu código de verificação é:</p>
            <h2 style="text-align: center; color: #12577B;">${code}</h2>
            <p>Por favor, use este código para completar seu processo de verificação. Se você não solicitou este código, por favor ignore este email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Cooperescrita. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
