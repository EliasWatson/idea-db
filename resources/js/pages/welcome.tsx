import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Archive, ArrowRight, Lightbulb, Plus, Search } from 'lucide-react';

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;

  return (
    <>
      <Head title="Welcome to IdeaDB">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <header className="w-full px-6 py-4">
          <nav className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              IdeaDB
            </div>
            <div className="flex items-center gap-4">
              {auth.user ? (
                <Link
                  href={route('dashboard')}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href={route('login')}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                  >
                    Log in
                  </Link>
                  <Link
                    href={route('register')}
                    className="rounded-lg border border-blue-200 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-16">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <Lightbulb className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-slate-100">
              Your Ideas,
              <span className="text-blue-600 dark:text-blue-400"> Organized</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Capture, organize, and develop your ideas with IdeaDB. Never lose a brilliant thought again. From quick notes to detailed concepts, keep
              all your creativity in one place.
            </p>

            {!auth.user && (
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={route('register')}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href={route('login')}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-green-100 p-2 dark:bg-green-900">
                <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Capture Ideas</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Quickly jot down ideas as they come to you. Add individual thoughts or import multiple ideas at once.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                <Search className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Find & Search</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Powerful search functionality helps you quickly find any idea, no matter how many you've collected.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-orange-100 p-2 dark:bg-orange-900">
                <Archive className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Organize & Track</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Categorize ideas by status: draft, active, completed, or archived. Track your creative journey.
              </p>
            </div>
          </div>

          <div className="mt-20 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">Ready to organize your creativity?</h2>
              <p className="mb-6 text-slate-600 dark:text-slate-400">
                Join thousands of creators, entrepreneurs, and thinkers who trust IdeaDB with their ideas.
              </p>
              {!auth.user && (
                <Link
                  href={route('register')}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Start Collecting Ideas
                  <ArrowRight className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </main>

        <footer className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="flex items-center justify-center text-sm text-slate-600 dark:text-slate-400">Built with Laravel & React</div>
          </div>
        </footer>
      </div>
    </>
  );
}
