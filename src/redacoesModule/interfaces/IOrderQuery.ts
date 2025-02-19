export interface IOrderQuery {
  order?: 'crescente' | 'decrescente';
  statusEnvio?: 'rascunho' | 'enviada';
  statusCorrecao?: 'corrigidas' | 'nao-corrigidas';
}
