export const sendReportAlertAdminHtml = (report: string) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
          .container {
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
            margin-bottom: 20px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Alerta de Segurança</h1>
          </div>
          <div class="content">
            <p>Caro Administrador,</p>
            <p>Detectamos um potencial problema de segurança que requer sua atenção imediata.</p>
            <p>Por favor, revise os detalhes e tome as ações necessárias para garantir a segurança do nosso sistema.</p>
            <p>Relatório: ${report} </p>
          </div>
          <div class="footer">
            <p>Esta é uma mensagem automática. Por favor, não responda a este e-mail.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
