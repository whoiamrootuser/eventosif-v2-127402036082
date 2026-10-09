import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { buscarEventos } from '../api/eventosApi';
import { lerCache, salvarCache } from '../armazenamento/cacheEventos';

const EventosContexto = createContext(null);

export function EventosProvedor({ children }) {
  const [eventos, setEventos] = useState([]);
  const [status, setStatus] = useState('carregando'); // 'carregando' | 'sucesso' | 'falha'

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      // 1) abre rápido com o que estiver salvo
      const cache = await lerCache();
      if (ativo && cache) {
        setEventos(cache);
        setStatus('sucesso');
      }
      // 2) atualiza com a API
      try {
        const frescos = await buscarEventos();
        if (!ativo) return;
        setEventos(frescos);
        setStatus('sucesso');
        salvarCache(frescos);
      } catch (erro) {
        if (ativo && !cache) setStatus('falha');
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const valor = useMemo(() => ({ eventos, status }), [eventos, status]);
  return <EventosContexto.Provider value={valor}>{children}</EventosContexto.Provider>;
}

export function useEventos() {
  const contexto = useContext(EventosContexto);
  if (contexto === null) throw new Error('useEventos exige EventosProvedor acima na árvore');
  return contexto;
}
