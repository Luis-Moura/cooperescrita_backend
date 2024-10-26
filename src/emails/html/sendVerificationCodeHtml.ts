export const sendVerificationCodeHtml = (code: string) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h1 style="color: #333;">Código de Verificação</h1>
      <p>Seu código de verificação é: <strong>${code}</strong></p>
      <p>Por favor, use este código para completar seu processo de verificação. Se você não solicitou este código, por favor ignore este email.</p>
    </div>
  `;
};
