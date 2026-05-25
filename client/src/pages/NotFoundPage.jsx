import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="container-page grid min-h-[calc(100vh-4rem)] place-items-center py-10 text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-normal text-coral">404</p>
        <h1 className="mt-2 font-serif text-4xl font-bold">Page not found</h1>
        <Link to="/" className="btn-primary mt-6">
          Back to stories
        </Link>
      </div>
    </section>
  );
}
