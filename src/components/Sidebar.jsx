import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Home,
  FolderKanban,
  Package,
  Users,
  Truck,
  Settings,
  ChevronDown,
  X,
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen, collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [materialNames, setMaterialNames] = useState([]);

  const [machineryOpen, setMachineryOpen] = useState(false);
  const [machineryNames, setMachineryNames] = useState([]);

  const navItems = [
    { name: 'Dashboard', path: '/',         icon: Home },
    { name: 'Projects',  path: '/projects', icon: FolderKanban },
    { name: 'Materials',                    icon: Package },
    { name: 'Labour',    path: '/labour',   icon: Users },
    { name: 'Machinery',                    icon: Truck },
    { name: 'Settings',  path: '/settings', icon: Settings },
  ];

  const isActive = (path) => path && location.pathname === path;
  const fetchMaterialNames = async () => {
    try {
      const res = await axios.get('/api/materials/names', { withCredentials: true });
      setMaterialNames(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load material names:', err);
      setMaterialNames([]);
    }
  };

  const fetchMachineryNames = async () => {
    try {
      const res = await axios.get('/api/machinery', { withCredentials: true });
      const entries = res.data;
      const uniqueNames = [...new Set(entries.map((e) => e.machineryName))].sort();
      setMachineryNames(uniqueNames);
    } catch (err) {
      console.error('Failed to load machinery names:', err);
      setMachineryNames([]);
    }
  };

  useEffect(() => {
    fetchMaterialNames();
    fetchMachineryNames();
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith('/material')) {
      setMaterialsOpen(true);
    } else if (location.pathname.startsWith('/machinery-detail')) {
      setMachineryOpen(true);
    }
  }, []);

  const handleMaterialsToggle = () => {
    const willBeOpen = !materialsOpen;
    if (willBeOpen) {
      setMachineryOpen(false);
      if (!location.pathname.startsWith('/material')) {
        const firstMaterial = materialNames[0];
        if (firstMaterial) {
          navigate(`/material/${encodeURIComponent(firstMaterial)}`);
          if (window.innerWidth < 1024) setIsOpen(false);
        }
      }
    }
    setMaterialsOpen(willBeOpen);
  };

  const handleMachineryToggle = () => {
    setMachineryOpen((prev) => {
      if (!prev) setMaterialsOpen(false);
      return !prev;
    });
  };

  const closeOnMobile = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const handleViewMaterial = (name) => {
    navigate(`/material/${encodeURIComponent(name)}`);
    closeOnMobile();
  };

  const handleViewMachinery = (name) => {
    navigate(`/machinery-detail/${encodeURIComponent(name)}`);
    closeOnMobile();
  };

  const DropdownContent = ({ open, children }) => (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="ml-9 mt-1 mb-1 space-y-0.5">{children}</div>
    </div>
  );

  const subItemClass = (active) =>
    `w-full text-left px-3 py-1.5 rounded-md text-sm truncate transition-all duration-150 ${
      active
        ? 'bg-blue-50 text-blue-700 font-semibold'
        : 'text-gray-600 hover:bg-white hover:text-gray-900'
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          role="presentation"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          bg-gradient-to-b from-gray-50 to-gray-100
          border-r border-gray-200 shadow-xl
          transition-all duration-300 ease-in-out overflow-hidden
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between px-4 py-[14px] border-b border-gray-200 bg-white shrink-0">
          {!collapsed && (
            <h1 className="font-bold text-base text-gray-900 tracking-tight">Portal</h1>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors ml-auto"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const active = isActive(item.path);

            if (item.name === 'Materials') {
              const sectionActive = location.pathname.startsWith('/material');
              return (
                <div key="materials">
                  <button
                    type="button"
                    onClick={handleMaterialsToggle}
                    aria-expanded={materialsOpen}
                    title={collapsed ? 'Materials' : undefined}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-all duration-200 group
                      ${sectionActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-white hover:shadow-sm'}
                    `}
                  >
                    <item.icon
                      size={20}
                      className={`flex-shrink-0 ${
                        sectionActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                    {!collapsed && (
                      <>
                        <span className="font-medium text-sm flex-1 text-left">Materials</span>
                        <ChevronDown
                          size={15}
                          className={`flex-shrink-0 transition-transform duration-200 ${
                            materialsOpen ? 'rotate-180' : ''
                          } ${sectionActive ? 'text-white/80' : 'text-gray-400'}`}
                        />
                      </>
                    )}
                  </button>

                  {!collapsed && (
                    <DropdownContent open={materialsOpen}>
                      {materialNames.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-gray-400 italic">Loading...</p>
                      ) : (
                        materialNames.map((name) => {
                          const itemActive =
                            location.pathname === `/material/${encodeURIComponent(name)}`;
                          return (
                            <button
                              key={name}
                              onClick={() => handleViewMaterial(name)}
                              title={name}
                              className={subItemClass(itemActive)}
                            >
                              {name}
                            </button>
                          );
                        })
                      )}
                    </DropdownContent>
                  )}
                </div>
              );
            }

            if (item.name === 'Machinery') {
              const sectionActive = location.pathname.startsWith('/machinery-detail');
              return (
                <div key="machinery">
                  <button
                    type="button"
                    onClick={handleMachineryToggle}
                    aria-expanded={machineryOpen}
                    title={collapsed ? 'Machinery' : undefined}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-all duration-200 group
                      ${sectionActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-white hover:shadow-sm'}
                    `}
                  >
                    <item.icon
                      size={20}
                      className={`flex-shrink-0 ${
                        sectionActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                    {!collapsed && (
                      <>
                        <span className="font-medium text-sm flex-1 text-left">Machinery</span>
                        <ChevronDown
                          size={15}
                          className={`flex-shrink-0 transition-transform duration-200 ${
                            machineryOpen ? 'rotate-180' : ''
                          } ${sectionActive ? 'text-white/80' : 'text-gray-400'}`}
                        />
                      </>
                    )}
                  </button>

                  {!collapsed && (
                    <DropdownContent open={machineryOpen}>
                      {machineryNames.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-gray-400 italic">No machinery found</p>
                      ) : (
                        machineryNames.map((name) => {
                          const itemActive =
                            location.pathname === `/machinery-detail/${encodeURIComponent(name)}`;
                          return (
                            <button
                              key={name}
                              onClick={() => handleViewMachinery(name)}
                              title={name}
                              className={subItemClass(itemActive)}
                            >
                              {name}
                            </button>
                          );
                        })
                      )}
                    </DropdownContent>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeOnMobile}
                aria-current={active ? 'page' : undefined}
                title={collapsed ? item.name : undefined}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 group
                  ${active
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm'}
                `}
              >
                <item.icon
                  size={20}
                  className={`flex-shrink-0 ${
                    active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />
                {!collapsed && (
                  <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}