export interface OrderQueryPrivateRedacoes {
  order?: 'crescente' | 'decrescente';
  statusEnvio?: 'enviado' | 'rascunho';
  statusCorrecao?: 'corrigidas' | 'nao-corrigidas';
}
