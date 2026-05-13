import { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { Search, Plus, Edit, Trash2, X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MaterialSummary {
  name: string;
  totalRecords: number;
}

export default function Materials() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<MaterialSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>(() => localStorage.getItem('userRole') || 'user');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialSummary | null>(null);
  const [editName, setEditName] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
<<<<<<< Updated upstream
      const res = await api.get<Record<string, MaterialEntry[]>>('/api/materials');
      const data = res.data;

      const summaries: MaterialSummary[] = Object.entries(data).map(([name, entries]) => {
=======
      const res = await axios.get('/api/materials', { withCredentials: true });
      const data = res.data; 
      const summaries: MaterialSummary[] = Object.entries(data).map(([name, entries]: [string, any[]]) => {
>>>>>>> Stashed changes
        const realEntries = entries.filter((e) => e['Supplier Name'] !== 'Initial Stock');
        return { name, totalRecords: realEntries.length };
      });
      summaries.sort((a, b) => a.name.localeCompare(b.name));
      setMaterials(summaries);
    } catch (err) {
      Swal.fire('Error', 'Failed to load materials', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
    const handleStorageChange = () => setUserRole(localStorage.getItem('userRole') || 'user');
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredMaterials = materials.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage]);

  const totalEntries = filteredMaterials.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedMaterials = filteredMaterials.slice(startIndex, startIndex + entriesPerPage);

  const handleAddMaterial = async () => {
    const trimmed = newMaterialName.trim();
    if (!trimmed) {
      Swal.fire('Validation Error', 'Material name is required', 'warning');
      return;
    }

    let projectId = localStorage.getItem('selectedProjectId');
    if (!projectId) {
      try {
        const projectsRes = await api.get('/api/projects');
        const projects = projectsRes.data;
        if (projects.length === 0) {
          Swal.fire('No Project', 'Please create a project first.', 'warning');
          return;
        }
        projectId = projects[0]._id;
        localStorage.setItem('selectedProjectId', projectId);
      } catch (err) {
        Swal.fire('Error', 'Could not fetch projects.', 'error');
        return;
      }
    }

    setSubmitting(true);
    try {
      await api.post(
        '/api/materials',
        {
          materialName: trimmed,
          projectId,
          entry: {
            projectId,
            Date: new Date().toISOString().split('T')[0],
            'Supplier Name': 'Initial Stock',
            Quantity: 0,
            Rate: 0,
            Amount: 0,
            Remarks: 'Initial material creation',
          },
        }
      );
      Swal.fire('Success', `Material "${trimmed}" added.`, 'success');
      setShowAddModal(false);
      setNewMaterialName('');
      fetchMaterials();
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to add material', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (material: MaterialSummary) => {
    setEditingMaterial(material);
    setEditName(material.name);
    setShowEditModal(true);
  };

  const handleEditMaterial = async () => {
    const newName = editName.trim();
    if (!newName) {
      Swal.fire('Validation Error', 'Material name cannot be empty', 'warning');
      return;
    }
    if (newName === editingMaterial?.name) {
      Swal.fire('Info', 'Name unchanged', 'info');
      setShowEditModal(false);
      return;
    }

    setSubmittingEdit(true);
    try {
      await api.put(
        `/api/materials/material/${encodeURIComponent(editingMaterial!.name)}`,
        { newName }
      );
      Swal.fire('Success', 'Material renamed', 'success');
      setShowEditModal(false);
      fetchMaterials();
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Rename failed', 'error');
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDeleteMaterial = async (material: MaterialSummary) => {
    const confirm = await Swal.fire({
      title: `Delete "${material.name}"?`,
      text: 'This will delete ALL records for this material. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/api/materials/material/${encodeURIComponent(material.name)}`);
      Swal.fire('Deleted', `Material "${material.name}" removed.`, 'success');
      fetchMaterials();
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Delete failed', 'error');
    }
  };

<<<<<<< Updated upstream
  // Add record for material
  const openAddRecordModal = (material: MaterialSummary) => {
    setSelectedMaterial(material);
    setRecordForm({
      projectId: localStorage.getItem('selectedProjectId') || '',
      Date: new Date().toISOString().split('T')[0],
      supplierName: '',
      quantity: '',
      rate: '',
      remarks: '',
    });
    setShowAddRecordModal(true);
  };

  const handleAddRecord = async () => {
    const quantity = Number(recordForm.quantity);
    const rate = Number(recordForm.rate);

    if (!recordForm.projectId) {
      Swal.fire('Validation Error', 'Project name is required', 'warning');
      return;
    }
    if (!recordForm.Date || !recordForm.supplierName.trim() || quantity <= 0 || rate <= 0) {
      Swal.fire('Validation Error', 'Please fill all required fields correctly', 'warning');
      return;
    }

    setSubmittingRecord(true);
    try {
      await api.post(
        '/api/materials',
        {
          materialName: selectedMaterial!.name,
          projectId: recordForm.projectId,
          entry: {
            projectId: recordForm.projectId,
            Date: recordForm.Date,
            'Supplier Name': recordForm.supplierName.trim(),
            Quantity: quantity,
            Rate: rate,
            Amount: quantity * rate,
            Remarks: recordForm.remarks.trim(),
          },
        }
      );
      Swal.fire('Success', 'Record added successfully', 'success');
      setShowAddRecordModal(false);
      fetchMaterials();
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to add record', 'error');
    } finally {
      setSubmittingRecord(false);
    }
=======
  const viewMaterialDetails = (materialName: string) => {
    navigate(`/material/${encodeURIComponent(materialName)}`);
>>>>>>> Stashed changes
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Materials</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all construction materials</p>
          </div>
          {userRole === 'admin' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition w-full sm:w-auto"
            >
              <Plus size={18} /> New Material
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                className="border rounded px-3 py-1.5 bg-white"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search material..."
                className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full table-auto text-sm border-collapse">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left">SR. NO.</th>
                      <th className="px-4 sm:px-6 py-3 text-left">Material Name</th>
                      <th className="px-4 sm:px-6 py-3 text-left">Total Records</th>
                      {userRole === 'admin' && <th className="px-4 sm:px-6 py-3 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedMaterials.length === 0 ? (
                      <tr>
                        <td colSpan={userRole === 'admin' ? 4 : 3} className="text-center py-16 text-gray-400">
                          No materials found.
                        </td>
                      </tr>
                    ) : (
                      paginatedMaterials.map((material, idx) => (
                        <tr key={material.name} className="hover:bg-gray-50 transition">
                          <td className="px-4 sm:px-6 py-3 font-medium text-gray-500 whitespace-nowrap">
                            {startIndex + idx + 1}
                          </td>
                          <td className="px-4 sm:px-6 py-3">
                            <button
                              onClick={() => viewMaterialDetails(material.name)}
                              className="text-blue-600 hover:underline font-medium text-left"
                            >
                              {material.name}
                            </button>
                          </td>
                          <td className="px-4 sm:px-6 py-3 text-gray-700">{material.totalRecords}</td>
                          {userRole === 'admin' && (
                            <td className="px-4 sm:px-6 py-3 text-right whitespace-nowrap">
                              <button
                                onClick={() => openEditModal(material)}
                                className="text-blue-600 hover:text-blue-800 mr-2"
                                title="Edit material"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteMaterial(material)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete material"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {totalEntries > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-gray-200 text-sm text-gray-500 bg-gray-50">
              <div>
                Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border px-2 py-1 rounded disabled:opacity-50 bg-white hover:bg-gray-100"
                >
                  ‹
                </button>
                <span className="px-3 py-1 bg-blue-600 text-white rounded">{currentPage}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="border px-2 py-1 rounded disabled:opacity-50 bg-white hover:bg-gray-100"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">New Material</h2>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Material Name *
              </label>
              <input
                type="text"
                value={newMaterialName}
                onChange={(e) => setNewMaterialName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMaterial()}
                placeholder="e.g., Cement, Steel, Sand"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMaterial}
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Material'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingMaterial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Material</h2>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Material Name *
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEditMaterial()}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEditMaterial}
                disabled={submittingEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {submittingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}