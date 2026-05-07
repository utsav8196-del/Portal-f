import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FolderKanban,
  Package,
  Users,
  Truck,
  Settings,
  ChevronLeft
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen, collapsed, setCollapsed }) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Materials', path: '/materials', icon: Package },
    { name: 'Labour', path: '/labour', icon: Users },
    { name: 'Machinery', path: '/machinery', icon: Truck },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 bg-white shadow-lg z-50
          transition-all duration-300

          ${collapsed ? 'w-20' : 'w-64'}

          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h1 className="font-bold text-lg">Manager</h1>
        </div>

        {/* Nav */}
        <nav className="p-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)} // auto close on mobile
              className={`
                flex items-center gap-3 p-3 rounded-lg mb-2 transition
                ${location.pathname === item.path
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-100'}
              `}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}