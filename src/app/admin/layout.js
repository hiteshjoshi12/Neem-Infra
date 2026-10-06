import AdminClientLayout from './AdminClientLayout';

export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminRootLayout({ children }) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
