// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// export default function Labour() {
//   const [workers, setWorkers] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState({ name: '', role: '', project: '', hourlyRate: '' });

//   const fetchData = async () => {
//     const workersRes = await axios.get('/api/labour', { withCredentials: true });
//     const projectsRes = await axios.get('/api/projects', { withCredentials: true });
//     setWorkers(workersRes.data);
//     setProjects(projectsRes.data);
//   };

//   useEffect(() => { fetchData(); }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editing) {
//         await axios.put(`/api/labour/${editing}`, form, { withCredentials: true });
//         Swal.fire('Updated', '', 'success');
//       } else {
//         await axios.post('/api/labour', form, { withCredentials: true });
//         Swal.fire('Added', '', 'success');
//       }
//       setShowForm(false);
//       setEditing(null);
//       setForm({ name: '', role: '', project: '', hourlyRate: '' });
//       fetchData();
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.message, 'error');
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirm = await Swal.fire({ title: 'Delete?', text: 'Remove this worker?', icon: 'warning', showCancelButton: true });
//     if (confirm.isConfirmed) {
//       await axios.delete(`/api/labour/${id}`, { withCredentials: true });
//       fetchData();
//       Swal.fire('Deleted', '', 'success');
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow">
//       <div className="flex justify-between mb-4">
//         <h2 className="text-2xl font-bold">Labour Management</h2>
//         <button onClick={() => { setEditing(null); setForm({ name: '', role: '', project: '', hourlyRate: '' }); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Worker</button>
//       </div>
//       {showForm && (
//         <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
//           <input type="text" placeholder="Name" className="border p-2 w-full mb-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
//           <input type="text" placeholder="Role (e.g., Mason, Carpenter)" className="border p-2 w-full mb-2" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
//           <select className="border p-2 w-full mb-2" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })}>
//             <option value="">Select Project</option>
//             {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
//           </select>
//           <input type="number" step="0.01" placeholder="Hourly Rate ($)" className="border p-2 w-full mb-2" value={form.hourlyRate} onChange={e => setForm({ ...form, hourlyRate: e.target.value })} />
//           <div className="flex gap-2">
//             <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
//             <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
//           </div>
//         </form>
//       )}
//       <table className="min-w-full bg-white">
//         <thead>
//           <tr className="border-b"><th className="p-2 text-left">Name</th><th>Role</th><th>Project</th><th>Hourly Rate</th><th>Actions</th></tr>
//         </thead>
//         <tbody>
//           {workers.map(w => (
//             <tr key={w._id} className="border-b">
//               <td className="p-2">{w.name}</td>
//               <td className="p-2">{w.role || '-'}</td>
//               <td className="p-2">{w.project?.name || '-'}</td>
//               <td className="p-2">${w.hourlyRate || 0}</td>
//               <td className="p-2">
//                 <button onClick={() => { setEditing(w._id); setForm(w); setShowForm(true); }} className="text-blue-600 mr-2">Edit</button>
//                 <button onClick={() => handleDelete(w._id)} className="text-red-600">Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Worker {
  _id?: string;
  name: string;
  role: string;
  project: string | { _id: string; name: string } | null;
  hourlyRate: number;
}

interface Project {
  _id: string;
  name: string;
}

export default function Labour() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Worker>({
    name: '',
    role: '',
    project: '',
    hourlyRate: 0,
  });

  const fetchData = async () => {
    try {
      const [workersRes, projectsRes] = await Promise.all([
        axios.get('/api/labour', { withCredentials: true }),
        axios.get('/api/projects', { withCredentials: true }),
      ]);
      // Backend returns array directly
      setWorkers(workersRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load data', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ name: '', role: '', project: '', hourlyRate: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!form.name.trim()) {
      Swal.fire('Validation Error', 'Name is required', 'warning');
      return;
    }
    try {
      if (editingId) {
        await axios.put(`/api/labour/${editingId}`, form, { withCredentials: true });
        Swal.fire('Success', 'Worker updated', 'success');
      } else {
        await axios.post('/api/labour', form, { withCredentials: true });
        Swal.fire('Success', 'Worker added', 'success');
      }
      resetForm();
      fetchData();
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Delete worker?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/labour/${id}`, { withCredentials: true });
        Swal.fire('Deleted', 'Worker has been removed', 'success');
        fetchData();
      } catch (err: any) {
        Swal.fire('Error', err.response?.data?.message || 'Delete failed', 'error');
      }
    }
  };

  const openEditForm = (worker: Worker) => {
    // Ensure project is stored as ID string for the select dropdown
    const projectId = typeof worker.project === 'object' && worker.project !== null
      ? worker.project._id
      : worker.project || '';
    setForm({
      name: worker.name,
      role: worker.role || '',
      project: projectId,
      hourlyRate: worker.hourlyRate || 0,
    });
    setEditingId(worker._id || null);
    setShowForm(true);
  };

  // Helper to display project name
  const getProjectName = (worker: Worker): string => {
    if (!worker.project) return '-';
    if (typeof worker.project === 'object') return worker.project.name;
    // If project is only an ID, find it in projects list
    const found = projects.find(p => p._id === worker.project);
    return found ? found.name : 'Unknown';
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Labour Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage workers and their assignments</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition w-full sm:w-auto"
          >
            <Plus size={18} /> Add Worker
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{editingId ? 'Edit Worker' : 'Add New Worker'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter worker name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <input
                    type="text"
                    placeholder="e.g., Mason, Carpenter"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Project</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={form.project as string}
                    onChange={(e) => setForm({ ...form, project: e.target.value })}
                  >
                    <option value="">-- Select Project --</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={form.hourlyRate}
                    onChange={(e) => setForm({ ...form, hourlyRate: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition order-1 sm:order-2"
                >
                  {editingId ? 'Update Worker' : 'Save Worker'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Workers Table */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full table-auto text-sm border-collapse">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 sm:px-6 py-3 text-left font-semibold">Role</th>
                    <th className="px-4 sm:px-6 py-3 text-left font-semibold">Project</th>
                    <th className="px-4 sm:px-6 py-3 text-left font-semibold">Hourly Rate</th>
                    <th className="px-4 sm:px-6 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {workers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 sm:px-6 py-12 text-center text-gray-400">
                        No workers added yet. Add your first worker.
                      </td>
                    </tr>
                  ) : (
                    workers.map((worker) => (
                      <tr key={worker._id} className="hover:bg-gray-50 transition border-b border-gray-100">
                        <td className="px-4 sm:px-6 py-3">
                          <div className="font-medium text-gray-900 truncate">{worker.name}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-3">
                          <div className="text-gray-600">{worker.role || '-'}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-3">
                          <div className="text-gray-600">{getProjectName(worker)}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-3">
                          <div className="text-gray-600 font-medium">${worker.hourlyRate?.toFixed(2) || '0.00'}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => openEditForm(worker)}
                            className="text-blue-600 hover:text-blue-800 transition mr-3 inline-flex"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(worker._id!)}
                            className="text-red-600 hover:text-red-800 transition inline-flex"
                            title="Delete"
                          >
                            <Trash2 size={18} />
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
  );
}
