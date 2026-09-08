-- Preserve o cadastro rural e suas cotações históricas.
INSERT INTO public.tipos_seguro (nome)
SELECT 'Seguro de Equipamentos'
WHERE NOT EXISTS (SELECT 1 FROM public.tipos_seguro WHERE nome = 'Seguro de Equipamentos');
