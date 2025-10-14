export const sendReportAlertAdminHtml = (report: string) => {
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
            background-color: #021B33;
            color: #FFFFFF;
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
            <img src="assets/cooperescrita.png" alt="Cooperescrita Logo mudou" />
          </div>
          <div class="content">
            <h1>Alerta de Segurança</h1>
            <p>Caro Administrador,</p>
            <p>Detectamos um potencial problema de segurança que requer sua atenção imediata.</p>
            <p><strong>Relatório:</strong></p>
            <p>${report}</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Cooperescrita. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
