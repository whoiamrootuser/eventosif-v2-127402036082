import { createContext, useCallback, useContext, useMemo } from 'react';
import { useEstadoPersistido } from '../hooks/useEstadoPersistido';
import { CHAVES } from '../armazenamento/chaves';

const FavoritosContexto = createContext(null);

export function FavoritosProvedor({ children }) {
  const [favoritos, setFavoritos] = useEstadoPersistido(CHAVES.favoritos, []);

  const alternarFavorito = useCallback(
    (evento) => {
      setFavoritos((atual) => {
        const idFavorito = (favorito) =>
          typeof favorito === 'object' && favorito !== null ? favorito.id : favorito;
        return atual.some((favorito) => idFavorito(favorito) === evento.id)
          ? atual.filter((favorito) => idFavorito(favorito) !== evento.id)
          : [...atual, evento.id];
      });
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
