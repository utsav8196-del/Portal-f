// import { Outlet } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';
// import { useState } from 'react';

// export default function DashboardLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
//         <main className="flex-1 overflow-y-auto p-4">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }



// import { Outlet } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';
// import { useState } from 'react';

// export default function DashboardLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-100">

//       {/* Sidebar */}
//       <Sidebar
//         isOpen={sidebarOpen}
//         closeSidebar={() => setSidebarOpen(false)}
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//       />

//       {/* Main */}
//       <div
//         className={`
//           flex-1 flex flex-col transition-all duration-300
//           ${collapsed ? 'md:ml-20' : 'md:ml-64'}
//         `}
//       >
//         <Header
//           toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
//           toggleCollapse={() => setCollapsed(!collapsed)}
//         />

//         {/* Content */}
//         <main className="flex-1 overflow-y-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }


import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useState, useEffect } from 'react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // ✅ AUTO HANDLE SCREEN SIZE
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true); // always open on laptop
      } else {
        setSidebarOpen(false); // hidden on tablet/mobile
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content */}
      <div
        className={`
          flex-1 flex flex-col transition-all duration-300
          ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}
      >
        <Header toggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
}