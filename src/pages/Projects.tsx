// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { Search, Plus, Edit, Trash2, X } from 'lucide-react';

// interface Project {
//   _id: string;
//   name: string;
//   description: string;
//   progress: number;
//   startDate?: string;
//   endDate?: string;
//   createdAt?: string;
// }

// export default function Projects() {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [form, setForm] = useState({
//     name: '',
//     description: '',
//     progress: 0,
//     startDate: '',
//     endDate: '',
//   });

//   const fetchProjects = async () => {
//     try {
//       const res = await axios.get('/api/projects', { withCredentials: true });
//       const data = Array.isArray(res.data) ? res.data : [];
//       setProjects(data);
//       setFilteredProjects(data);
//     } catch (err) {
//       console.error(err);
//       Swal.fire('Error', 'Failed to load projects', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredProjects(projects);
//     } else {
//       const filtered = projects.filter((p) =>
//         p.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredProjects(filtered);
//     }
//   }, [searchTerm, projects]);

//   const resetForm = () => {
//     setForm({
//       name: '',
//       description: '',
//       progress: 0,
//       startDate: '',
//       endDate: '',
//     });
//     setEditingId(null);
//   };

//   const openAddModal = () => {
//     resetForm();
//     setShowModal(true);
//   };

//   const openEditModal = (project: Project) => {
//     setForm({
//       name: project.name,
//       description: project.description || '',
//       progress: project.progress,
//       startDate: project.startDate ? project.startDate.slice(0, 10) : '',
//       endDate: project.endDate ? project.endDate.slice(0, 10) : '',
//     });
//     setEditingId(project._id);
//     setShowModal(true);
//   };

//   const validateDates = (start: string, end: string): boolean => {
//     if (!start || !end) return true;
//     if (new Date(end) < new Date(start)) {
//       Swal.fire('Invalid Dates', 'End date cannot be earlier than start date', 'warning');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!form.name.trim()) {
//       Swal.fire('Validation Error', 'Project name is required', 'warning');
//       return;
//     }
//     if (form.progress < 0 || form.progress > 100) {
//       Swal.fire('Validation Error', 'Progress must be between 0 and 100', 'warning');
//       return;
//     }
//     if (!validateDates(form.startDate, form.endDate)) return;

//     try {
//       if (editingId) {
//         await axios.put(`/api/projects/${editingId}`, form, { withCredentials: true });
//         Swal.fire('Success', 'Project updated', 'success');
//       } else {
//         await axios.post('/api/projects', form, { withCredentials: true });
//         Swal.fire('Success', 'Project created', 'success');
//       }
//       setShowModal(false);
//       resetForm();
//       fetchProjects();
//     } catch (err: any) {
//       Swal.fire('Error', err.response?.data?.message || 'Operation failed', 'error');
//     }
//   };

//   const handleDelete = async (id: string) => {
//     const confirm = await Swal.fire({
//       title: 'Delete project?',
//       text: 'This action cannot be undone',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//     });

//     if (confirm.isConfirmed) {
//       try {
//         await axios.delete(`/api/projects/${id}`, { withCredentials: true });
//         Swal.fire('Deleted', 'Project removed', 'success');
//         fetchProjects();
//       } catch (err: any) {
//         Swal.fire('Error', err.response?.data?.message || 'Delete failed', 'error');
//       }
//     }
//   };

//   const getStatusBadge = (progress: number) => {
//     if (progress === 100)
//       return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>;
//     if (progress > 0)
//       return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">In Progress</span>;
//     return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Not Started</span>;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 px-3 sm:px-6 lg:px-8">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between gap-3">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold">Projects</h1>
//           <p className="text-sm text-gray-500">Manage all construction projects</p>
//         </div>

//         <button
//           onClick={openAddModal}
//           className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
//         >
//           <Plus size={18} /> New Project
//         </button>
//       </div>

//       {/* Search */}
//       <div className="relative w-full sm:max-w-md">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//         <input
//           type="text"
//           placeholder="Search..."
//           className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-[700px] w-full">
//             <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
//               <tr>
//                 <th className="p-3 text-left">Name</th>
//                 <th className="p-3 text-left">Description</th>
//                 <th className="p-3 text-left">Progress</th>
//                 <th className="p-3 text-left">Timeline</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredProjects.map((p) => (
//                 <tr key={p._id} className="border-t hover:bg-gray-50">
//                   <td className="p-3 font-medium">{p.name}</td>

//                   <td className="p-3 max-w-[150px] sm:max-w-xs truncate">
//                     {p.description || '-'}
//                   </td>

//                   <td className="p-3">
//                     <div className="flex items-center gap-2">
//                       <div className="w-16 sm:w-24 bg-gray-200 h-2 rounded-full">
//                         <div
//                           className="bg-blue-600 h-2 rounded-full"
//                           style={{ width: `${p.progress}%` }}
//                         />
//                       </div>
//                       <span className="text-xs">{p.progress}%</span>
//                     </div>
//                   </td>

//                   <td className="p-3 text-sm">
//                     {p.startDate ? new Date(p.startDate).toLocaleDateString() : '—'}
//                   </td>

//                   <td className="p-3">{getStatusBadge(p.progress)}</td>

//                   <td className="p-3 text-right">
//                     <button onClick={() => openEditModal(p)} className="mr-2 text-blue-600">
//                       <Edit size={18} />
//                     </button>
//                     <button onClick={() => handleDelete(p._id)} className="text-red-600">
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50">
//           <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">

//             <div className="flex justify-between p-4 border-b">
//               <h2 className="font-bold">{editingId ? 'Edit Project' : 'New Project'}</h2>
//               <button onClick={() => setShowModal(false)}>
//                 <X />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="p-4 space-y-4">

//               <input
//                 type="text"
//                 placeholder="Project Name"
//                 className="w-full border p-2 rounded"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//               />

//               <textarea
//                 placeholder="Description"
//                 className="w-full border p-2 rounded"
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//               />

//               <input
//                 type="number"
//                 className="w-full border p-2 rounded"
//                 value={form.progress}
//                 onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
//               />

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                 <input
//                   type="date"
//                   className="border p-2 rounded"
//                   value={form.startDate}
//                   onChange={(e) => setForm({ ...form, startDate: e.target.value })}
//                 />
//                 <input
//                   type="date"
//                   className="border p-2 rounded"
//                   value={form.endDate}
//                   onChange={(e) => setForm({ ...form, endDate: e.target.value })}
//                 />
//               </div>

//               <div className="flex flex-col sm:flex-row gap-2">
//                 <button type="button" onClick={() => setShowModal(false)} className="border p-2 rounded w-full">
//                   Cancel
//                 </button>
//                 <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
//                   {editingId ? 'Update' : 'Create'}
//                 </button>
//               </div>

//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Search, Plus, Edit, Trash2, X, MapPin, Calendar } from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  location: string;
  projectType: string;
  description: string;
  progress: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    location: '',
    projectType: '',
    description: '',
    progress: 0,
    startDate: '',
    endDate: '',
  });

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects', { withCredentials: true });
      const data = Array.isArray(res.data) ? res.data : [];
      setProjects(data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on search
  const filteredProjects = projects.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.location?.toLowerCase().includes(term) ||
      p.projectType?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
  });

  const resetForm = () => {
    setForm({
      name: '',
      location: '',
      projectType: '',
      description: '',
      progress: 0,
      startDate: '',
      endDate: '',
    });
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setForm({
      name: project.name,
      location: project.location || '',
      projectType: project.projectType || '',
      description: project.description || '',
      progress: project.progress,
      startDate: project.startDate ? project.startDate.slice(0, 10) : '',
      endDate: project.endDate ? project.endDate.slice(0, 10) : '',
    });
    setEditingId(project._id);
    setShowModal(true);
  };

  const validateDates = (start: string, end: string): boolean => {
    if (!start || !end) return true;
    if (new Date(end) < new Date(start)) {
      Swal.fire('Invalid Dates', 'End date cannot be earlier than start date', 'warning');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      Swal.fire('Validation Error', 'Project name is required', 'warning');
      return;
    }
    if (form.progress < 0 || form.progress > 100) {
      Swal.fire('Validation Error', 'Progress must be between 0 and 100', 'warning');
      return;
    }
    if (!validateDates(form.startDate, form.endDate)) return;

    try {
      if (editingId) {
        await axios.put(`/api/projects/${editingId}`, form, { withCredentials: true });
        Swal.fire('Success', 'Project updated', 'success');
      } else {
        await axios.post('/api/projects', form, { withCredentials: true });
        Swal.fire('Success', 'Project created', 'success');
      }
      setShowModal(false);
      resetForm();
      fetchProjects();
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Delete project?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'Cancel',
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/projects/${id}`, { withCredentials: true });
        Swal.fire('Deleted', 'Project removed', 'success');
        fetchProjects();
      } catch (err: any) {
        Swal.fire('Error', err.response?.data?.message || 'Delete failed', 'error');
      }
    }
  };

  const getStatusBadge = (progress: number) => {
    if (progress === 100)
      return <span className="px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Completed</span>;
    if (progress > 0)
      return <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">In Progress</span>;
    return <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">Not Started</span>;
  };

  const getProjectTypeBadge = (type?: string) => {
    if (!type) return <span className="text-gray-400 text-xs">—</span>;
    const lower = type.toLowerCase();
    if (lower.includes('residential'))
      return <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold border border-amber-200">{type}</span>;
    if (lower.includes('commercial'))
      return <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 rounded-full text-xs font-semibold border border-blue-200">{type}</span>;
    if (lower.includes('industrial'))
      return <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold border border-gray-300">{type}</span>;
    if (lower.includes('infrastructure'))
      return <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold border border-emerald-200">{type}</span>;
    if (lower.includes('renovation'))
      return <span className="px-2.5 py-0.5 bg-pink-50 text-pink-800 rounded-full text-xs font-semibold border border-pink-200">{type}</span>;
    return <span className="px-2.5 py-0.5 bg-gray-50 text-gray-700 rounded-full text-xs font-semibold border">{type}</span>;
  };

  const formatTimeline = (project: Project) => {
    const start = project.startDate
      ? new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '—';
    const end = project.endDate
      ? new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '—';
    return `${start} - ${end}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Projects</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all construction projects</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition w-full sm:w-auto"
          >
            <Plus size={18} /> New Project
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-md">
          {/* Search bar only (no pagination controls) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 p-4 border-b border-gray-200 bg-gray-50">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search project..."
                className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Scrollable Table – vertical scroll only, no horizontal scroll */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full table-auto text-sm border-collapse">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left w-1/4">Project Name</th>
                      <th className="px-4 sm:px-6 py-3 text-left w-1/6">Location</th>
                      <th className="px-4 sm:px-6 py-3 text-left w-1/6">Project Type</th>
                      <th className="px-4 sm:px-6 py-3 text-left w-1/4">Timeline</th>
                      <th className="px-4 sm:px-6 py-3 text-left w-1/6">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-right w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16 text-gray-400">
                          No projects found.
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map((project) => (
                        <tr key={project._id} className="hover:bg-gray-50 transition">
                          <td className="px-4 sm:px-6 py-3 font-medium text-gray-900 break-words">
                            {project.name}
                          </td>
                          <td className="px-4 sm:px-6 py-3 text-gray-700 break-words">
                            {project.location ? (
                              <span className="flex items-center gap-1">
                                <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                                <span className="break-words">{project.location}</span>
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-3 break-words">
                            {getProjectTypeBadge(project.projectType)}
                          </td>
                          <td className="px-4 sm:px-6 py-3 text-gray-600 break-words">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                              <span className="break-words">{formatTimeline(project)}</span>
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 break-words">
                            {getStatusBadge(project.progress)}
                          </td>
                          <td className="px-4 sm:px-6 py-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => openEditModal(project)}
                              className="text-blue-600 hover:text-blue-800 mr-2 transition"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(project._id)}
                              className="text-red-600 hover:text-red-800 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal – unchanged */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Project' : 'New Project'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={form.projectType}
                    onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                  >
                    <option value="">-- Select --</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Industrial</option>
                    <option>Infrastructure</option>
                    <option>Renovation</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.progress}
                  onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition order-1 sm:order-2"
                >
                  {editingId ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}