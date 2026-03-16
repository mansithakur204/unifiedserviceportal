import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LayoutDashboard, List, Upload, Shield } from 'lucide-react';

const adminLinks = [
  { path: '/admin', icon: LayoutDashboard, key: 'admin.dashboard' },
  { path: '/admin/schemes', icon: List, key: 'admin.schemes' },
  { path: '/admin/upload', icon: Upload, key: 'admin.upload' },
];

export default function AdminLayout() {
  const { isAdmin, loading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;
  if (!isAdmin) return <Navigate to="/home" />;

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="w-56 border-r bg-muted/30 p-4 hidden md:block">
        <div className="flex items-center gap-2 mb-6 text-primary font-bold">
          <Shield className="w-5 h-5" /> {t('nav.admin')}
        </div>
        <nav className="space-y-1">
          {adminLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.path ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {t(link.key)}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
