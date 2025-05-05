import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} GeePawHill.Org. All rights reserved.
        </p>
        {/* Add Admin Login link */}
        <Link href="/admin" className="text-sm text-primary hover:underline">
            Admin Login
        </Link>
      </div>
    </footer>
  );
}
