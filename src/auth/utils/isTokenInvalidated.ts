export const isTokenInvalidated = (
  token: string,
  invalidatedTokens: Set<string>,
) => {
  return invalidatedTokens.has(token);
};
