import { createContext, useCallback, useContext, useMemo } from 'react';
import { useEstadoPersistido } from '../hooks/useEstadoPersistido';
import { CHAVES } from '../armazenamento/chaves';

const FavoritosContexto = createContext(null);

export function FavoritosProvedor({ children }) {
  const [favoritos, setFavoritos] = useEstadoPersistido(CHAVES.favoritos, []);

  const alternarFavorito = useCallback(
    (evento) => {
      setFavoritos((atual) =>
        atual.includes(evento) ? atual.filter((f) => f !== evento) : [...atual, evento]
      );
    },
    [setFavoritos]
  );

  const valor = useMemo(() => ({ favoritos, alternarFavorito }), [favoritos, alternarFavorito]);
  return <FavoritosContexto.Provider value={valor}>{children}</FavoritosContexto.Provider>;
}

export function useFavoritos() {
  const contexto = useContext(FavoritosContexto);
  if (contexto === null) throw new Error('useFavoritos exige FavoritosProvedor acima na árvore');
  return contexto;
}
