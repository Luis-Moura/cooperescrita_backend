export function sendReportResolvedNotificationHtml(
  reportId: string,
  reportType: 'redacao' | 'correcao',
  resolution: 'analisado' | 'rejeitado',
  wasContentDeleted: boolean,
  adminNote?: string,
): string {
  const subjectMap = {
    analisado: 'Report Analisado',
    rejeitado: 'Report Rejeitado',
  };

  const actionMap = {
    analisado: wasContentDeleted
      ? 'procedente e o conteúdo foi removido'
      : 'procedente',
    rejeitado: 'improcedente',
  };

  const contentTypeMap = {
    redacao: 'redação',
    correcao: 'correção',
  };

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="cid:logo" alt="Cooperescrita" style="max-width: 200px; height: auto;">
      </div>
      
      <h2 style="color: #333; text-align: center;">Atualização do seu Report</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>ID do Report:</strong> ${reportId}</p>
        <p><strong>Tipo:</strong> Report de ${contentTypeMap[reportType]}</p>
        <p><strong>Status:</strong> ${subjectMap[resolution]}</p>
        <p><strong>Resultado:</strong> Seu report foi considerado ${actionMap[resolution]}.</p>
        
        ${
          adminNote
            ? `
          <div style="margin-top: 15px; padding: 15px; background-color: #e9ecef; border-left: 4px solid #007bff; border-radius: 4px;">
            <h4 style="margin: 0 0 10px 0; color: #495057;">Observações do Administrador:</h4>
            <p style="margin: 0; color: #6c757d;">${adminNote}</p>
          </div>
        `
            : ''
        }
      </div>

      ${
        wasContentDeleted
          ? `
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;">
            <strong>Atenção:</strong> O conteúdo reportado foi removido da plataforma.
          </p>
        </div>
      `
          : ''
      }

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
        <p style="color: #6c757d; font-size: 14px;">
          Obrigado por ajudar a manter a qualidade da Cooperescrita!
        </p>
        <p style="color: #6c757d; font-size: 12px;">
          Esta é uma notificação automática. Por favor, não responda este email.
        </p>
      </div>
    </div>
  `;
}
