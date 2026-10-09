import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apagarToken, guardarToken, lerToken } from '../armazenamento/sessao';

const SessaoContexto = createContext(null);

export function SessaoProvedor({ children }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    lerToken().then(setToken);
  }, []);

  const entrar = useCallback(async () => {
    // Em produção o token viria do servidor de autenticação do campus.
    const novo = 'tok_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    await guardarToken(novo);
    setToken(novo);
  }, []);

  const sair = useCallback(async () => {
    await apagarToken();
    setToken(null);
  }, []);

  const valor = useMemo(() => ({ autenticado: token !== null, entrar, sair }), [token, entrar, sair]);
  return <SessaoContexto.Provider value={valor}>{children}</SessaoContexto.Provider>;
}

export function useSessao() {
  const contexto = useContext(SessaoContexto);
  if (contexto === null) throw new Error('useSessao exige SessaoProvedor acima na árvore');
  return contexto;
}
