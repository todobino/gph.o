import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account - GeePawHill.Org',
  description: 'Manage your account, courses, and purchases.',
};

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This layout can be expanded to include account-specific navigation,
  // like a sidebar with links to Profile, Orders, Courses, etc.
  return (
    <div>
        {children}
    </div>
  );
}
