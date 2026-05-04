import { MainLayout } from './components/layout/MainLayout';

export const App = () => {
  return (
    <MainLayout>
      <section>
        <h2 className="text-xl font-semibold">Bienvenido</h2>
        <p className="mt-2 text-sm text-slate-600">
          Este contenido se renderiza dentro de <code>MainLayout</code> vía
          <code>children</code>.
        </p>
      </section>
    </MainLayout>
  );
};
