import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Search, Plus, Edit, Trash2, X, ArrowLeft } from 'lucide-react';
import ProjectDropdown from '../components/ProjectDropdown';
import * as MaterialForms from '../components/materialForms';

const MATERIAL_COLUMNS: Record<string, string[]> = {
  Sand: ['Date', 'Supplier Name', 'Challan Number', 'Vehicle Number', 'Weight', 'Rate', 'Amount', 'Remarks'],
  Aggregate: ['Date', 'Supplier Name', 'Challan Number', 'Vehicle Number', 'Size', 'Weight', 'Rate', 'Amount', 'Remarks'],
  Cement: ['Date', 'Supplier Name', 'Type', 'Grade', 'Manufacturer', 'Bags', 'Rate', 'Amount', 'Remarks'],
  Steel: ['Date', 'Supplier Name', 'Diameter', 'Weight', 'Rate', 'Amount', 'Remarks'],
  Fabrication: ['Date', 'Supplier Name', 'Description', 'Weight', 'Rate', 'Amount', 'Remarks'],
  Hardware: ['Date', 'Supplier Name', 'Description', 'Weight', 'Rate', 'Amount', 'Remarks'],
  Bricks: ['Date', 'Supplier Name', 'Challan Number', 'Vehicle Number', 'Quantity', 'Rate', 'Amount', 'Remarks'],
  Stone: ['Date', 'Supplier Name', 'Challan Number', 'Vehicle Number', 'Quantity', 'Rate', 'Amount', 'Remarks'],
  Tiles: ['Date', 'Supplier Name', 'Size', 'Quantity', 'Rate', 'Amount', 'Remarks'],
  Granite: ['Date', 'Supplier Name', 'Size', 'Quantity', 'Rate', 'Amount', 'Remarks'],
  Electric: ['Date', 'Supplier Name', 'Description', 'Quantity', 'Rate', 'Amount', 'Remarks'],
  Plumbing: ['Date', 'Supplier Name', 'Description', 'Quantity', 'Rate', 'Amount', 'Remarks'],
  Plywood: ['Date', 'Supplier Name', 'Description', 'Quantity', 'Rate', 'Amount', 'Remarks'],
  Paint: ['Date', 'Supplier Name', 'Description', 'Quantity', 'Rate', 'Amount', 'Remarks'],
};

export default function MaterialDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const materialName = decodeURIComponent(name || '');

  const [entries, setEntries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || 'user');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const FormComponent = (MaterialForms as any)[`${materialName}Form`];
  const columns = MATERIAL_COLUMNS[materialName] || ['Date', 'Supplier Name', 'Amount', 'Remarks'];

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/materials', { withCredentials: true });
      const data = res.data;
      let materialEntries = data[materialName] || [];
      materialEntries = materialEntries.filter((e: any) => e['Supplier Name'] !== 'Initial Stock');
      setEntries(materialEntries);
    } catch (err) {
      Swal.fire('Error', 'Failed to load material entries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [materialName]);

  const totalUnits = entries.length;
  const totalQuantity = entries.reduce((sum, e) => sum + (e.Quantity || e.Weight || e.Bags || 0), 0);
  const totalCost = entries.reduce((sum, e) => sum + (e.Amount || 0), 0);

  const filteredEntries = entries.filter((entry) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return columns.some((col) => {
      const val = entry[col];
      return val && String(val).toLowerCase().includes(term);
    });
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage]);

  const totalFiltered = filteredEntries.length;
  const totalPages = Math.ceil(totalFiltered / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + entriesPerPage);

  const handleAddRecord = async (formData: Record<string, any>) => {
    let projectId = localStorage.getItem('selectedProjectId') || '';
    if (!projectId) {
      try {
        const projectsRes = await axios.get('/api/projects', { withCredentials: true });
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

    const entry = {
      ...formData,
      projectId,
      Quantity: formData.Quantity || formData.Weight || formData.Bags || 0,
    };

    setSubmitting(true);
    try {
      await axios.post('/api/materials', { materialName, projectId, entry }, { withCredentials: true });
      Swal.fire('Success', 'Record added', 'success');
      setShowAddModal(false);
      fetchEntries();
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to add record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditRecord = async (formData: Record<string, any>) => {
    if (!editingEntry) return;
    const entry = {
      ...formData,
      Quantity: formData.Quantity || formData.Weight || formData.Bags || 0,
    };
    setSubmitting(true);
    try {
      await axios.put(`/api/materials/${editingEntry._id}`, entry, { withCredentials: true });
      Swal.fire('Success', 'Record updated', 'success');
      setShowAddModal(false);
      setEditingEntry(null);
      fetchEntries();
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    const confirm = await Swal.fire({ title: 'Delete?', text: 'Cannot be undone', icon: 'warning', showCancelButton: true });
    if (!confirm.isConfirmed) return;
    try {
      await axios.delete(`/api/materials/${id}`, { withCredentials: true });
      Swal.fire('Deleted', '', 'success');
      fetchEntries();
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const formatValue = (val: any) => {
    if (val === undefined || val === null) return '—';
    if (typeof val === 'number') return val.toLocaleString();
    return val;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></button>
            <div><h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{materialName} – Transactions</h1><p className="text-sm text-gray-500">Manage purchase records</p></div>
          </div>
          {userRole === 'admin' && <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Add Record</button>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4"><p className="text-xs font-semibold text-gray-600">Total Units</p><p className="text-2xl font-bold text-blue-600">{totalUnits}</p></div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4"><p className="text-xs font-semibold text-gray-600">Total Quantity</p><p className="text-2xl font-bold text-green-600">{totalQuantity.toLocaleString()}</p></div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4"><p className="text-xs font-semibold text-gray-600">Total Cost (₹)</p><p className="text-2xl font-bold text-purple-600">₹{totalCost.toLocaleString()}</p></div>
        </div>

        <div className="bg-white rounded-xl shadow-md">
          <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2 text-sm"><span>Show</span><select className="border rounded px-3 py-1.5" value={entriesPerPage} onChange={e => setEntriesPerPage(Number(e.target.value))}><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select><span>entries</span></div>
            <div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="text" placeholder="Search..." className="w-full border rounded-lg pl-9 pr-3 py-2" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
          </div>
          <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs sticky top-0">
                  <tr><th className="px-4 py-3">#</th>{columns.map(col => <th key={col} className="px-4 py-3 text-left">{col}</th>)}{userRole === 'admin' && <th className="px-4 py-3 text-right">Actions</th>}</tr>
                </thead>
                <tbody>
                  {paginatedEntries.length === 0 ? <tr><td colSpan={columns.length + 2} className="text-center py-16 text-gray-400">No records found. Click "Add Record" to create one.</td></tr> :
                    paginatedEntries.map((entry, idx) => (
                      <tr key={entry._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{startIndex + idx + 1}</td>
                        {columns.map(col => <td key={col} className="px-4 py-3">{formatValue(entry[col])}</td>)}
                        {userRole === 'admin' && <td className="px-4 py-3 text-right"><button onClick={() => { setEditingEntry(entry); setShowAddModal(true); }} className="text-blue-600 mr-2"><Edit size={16} /></button><button onClick={() => handleDeleteRecord(entry._id)} className="text-red-600"><Trash2 size={16} /></button></td>}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          {totalFiltered > 0 && <div className="flex justify-between items-center p-4 border-t text-sm text-gray-500 bg-gray-50"><div>Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalFiltered)} of {totalFiltered}</div><div className="flex gap-2"><button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="border px-2 py-1 rounded">‹</button><span className="px-3 py-1 bg-blue-600 text-white rounded">{currentPage}</span><button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="border px-2 py-1 rounded">›</button></div></div>}
        </div>
      </div>

      {showAddModal && FormComponent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => { setShowAddModal(false); setEditingEntry(null); }} className="absolute top-4 right-4 text-gray-400"><X size={24} /></button>
            <h2 className="text-xl font-bold mb-4">{editingEntry ? 'Edit' : 'Add'} {materialName} Record</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Project *</label>
              <ProjectDropdown value={localStorage.getItem('selectedProjectId') || ''} onChange={(pid) => localStorage.setItem('selectedProjectId', pid)} required />
            </div>
            <FormComponent initialData={editingEntry || {}} onSubmit={editingEntry ? handleEditRecord : handleAddRecord} onCancel={() => { setShowAddModal(false); setEditingEntry(null); }} isSubmitting={submitting} />
          </div>
        </div>
      )}
    </div>
  );
}