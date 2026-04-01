import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="max-w-lg mx-auto px-4 text-center">
        <p className="text-sm font-display font-semibold text-polinar-red uppercase tracking-wider mb-3">
          404
        </p>
        <h1 className="font-display font-extrabold text-heading text-3xl sm:text-4xl tracking-tight-heading mb-4">
          Page Not Found
        </h1>
        <p className="text-body-muted font-body text-base leading-relaxed-body mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Back to Home
        </Link>
      </div>
    </section>
  )
}
