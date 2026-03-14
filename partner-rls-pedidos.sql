-- Ejecuta esto en Supabase → SQL Editor para que los partners puedan ver pedidos de sus chiringuitos referidos
CREATE POLICY "Partners pueden ver pedidos de sus chiringuitos"
ON pedidos FOR SELECT
TO authenticated
USING (
  chiringuito_id IN (
    SELECT id FROM chiringuitos
    WHERE ref_colaborador IN (
      SELECT codigo_ref FROM colaboradores WHERE email = (auth.jwt() ->> 'email')
    )
  )
);
