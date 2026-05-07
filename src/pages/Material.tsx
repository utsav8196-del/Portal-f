// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { Search, Plus, Edit, Trash2, X } from 'lucide-react';

// type MaterialTransactions = {
//   [materialName: string]: any[];
// };

// export default function Materials() {
//   const [transactions, setTransactions] = useState<MaterialTransactions>({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [entriesPerPage, setEntriesPerPage] = useState(10); // ✅ changed to state

//   // Modal for Add/Edit Entry
//   const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
//   const [entryModalMode, setEntryModalMode] = useState<'add' | 'edit'>('add');
//   const [currentMaterial, setCurrentMaterial] = useState('');
//   const [currentEntryIndex, setCurrentEntryIndex] = useState<number | null>(null);
//   const [entryFormData, setEntryFormData] = useState<any>({});
//   const [submitting, setSubmitting] = useState(false);

//   // Modal for Add New Material
//   const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
//   const [newMaterialName, setNewMaterialName] = useState('');
//   const [materialSubmitting, setMaterialSubmitting] = useState(false);

//   // Fetch data (replace with your real API)
//   const fetchTransactions = async () => {
//     try {
//       // Replace this with your actual API call
//       const mockData: MaterialTransactions = {
//         Sand: [
//           {
//             Date: "2026-03-01",
//             "Supplier Name": "Shree Sand Suppliers",
//             Rate: 1200,
//             Amount: 1800000,
//             Remarks: "Delivered on time"
//           }
//         ],
//         Cement: [
//           {
//             Date: "2026-03-03",
//             "Supplier Name": "ABC Traders",
//             Rate: 380,
//             Amount: 190000,
//             Remarks: "Batch OK"
//           }
//         ],
//       };
//       setTransactions(mockData);
//     } catch (err) {
//       Swal.fire('Error', 'Failed to load data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   // Flatten all entries for table display
//   const allEntries = Object.entries(transactions).flatMap(([material, entries]) =>
//     entries.map((entry, idx) => ({
//       material,
//       entryIndex: idx,
//       ...entry,
//     }))
//   );

//   // Search filter
//   const filteredEntries = allEntries.filter((entry) =>
//     entry.material.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination
//   const totalEntries = filteredEntries.length;
//   const totalPages = Math.ceil(totalEntries / entriesPerPage);
//   const startIndex = (currentPage - 1) * entriesPerPage;
//   const paginatedEntries = filteredEntries.slice(startIndex, startIndex + entriesPerPage);

//   // When filter or entriesPerPage changes, reset to page 1
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, entriesPerPage]);

//   // Determine all possible column keys from all entries (for dynamic table)
//   const allKeys = Array.from(
//     new Set(allEntries.flatMap(entry => Object.keys(entry).filter(k => k !== 'material' && k !== 'entryIndex')))
//   );

//   // Helper: open modal to add a new entry for a material
//   const openAddEntryModal = (material: string) => {
//     setCurrentMaterial(material);
//     setEntryModalMode('add');
//     setCurrentEntryIndex(null);
//     const template = transactions[material]?.[0] || {};
//     const emptyEntry: any = {};
//     Object.keys(template).forEach(key => { emptyEntry[key] = ''; });
//     if (Object.keys(emptyEntry).length === 0) emptyEntry['Date'] = '';
//     setEntryFormData(emptyEntry);
//     setIsEntryModalOpen(true);
//   };

//   const openEditEntryModal = (material: string, index: number, entry: any) => {
//     setCurrentMaterial(material);
//     setEntryModalMode('edit');
//     setCurrentEntryIndex(index);
//     setEntryFormData({ ...entry });
//     setIsEntryModalOpen(true);
//   };

//   const handleEntrySubmit = async () => {
//     if (!entryFormData.Date) {
//       Swal.fire('Error', 'Date is required', 'error');
//       return;
//     }
//     if (!entryFormData['Supplier Name']) {
//       Swal.fire('Error', 'Supplier Name is required', 'error');
//       return;
//     }
//     if (entryFormData.Rate !== undefined && entryFormData.Rate !== '') {
//       if (isNaN(Number(entryFormData.Rate))) {
//         Swal.fire('Error', 'Rate must be a number', 'error');
//         return;
//       }
//       entryFormData.Rate = Number(entryFormData.Rate);
//     }
//     if (entryFormData.Amount !== undefined && entryFormData.Amount !== '') {
//       if (isNaN(Number(entryFormData.Amount))) {
//         Swal.fire('Error', 'Amount must be a number', 'error');
//         return;
//       }
//       entryFormData.Amount = Number(entryFormData.Amount);
//     }

//     setSubmitting(true);
//     try {
//       const updated = { ...transactions };
//       if (entryModalMode === 'add') {
//         if (!updated[currentMaterial]) updated[currentMaterial] = [];
//         updated[currentMaterial].push(entryFormData);
//       } else {
//         if (currentEntryIndex !== null) {
//           updated[currentMaterial][currentEntryIndex] = entryFormData;
//         }
//       }
//       setTransactions(updated);
//       Swal.fire('Success', `Entry ${entryModalMode === 'add' ? 'added' : 'updated'}`, 'success');
//       setIsEntryModalOpen(false);
//     } catch (err: any) {
//       Swal.fire('Error', err.response?.data?.message || 'Operation failed', 'error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeleteEntry = async (material: string, index: number) => {
//     const confirm = await Swal.fire({
//       title: 'Delete this entry?',
//       text: 'This action cannot be undone',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete',
//     });
//     if (!confirm.isConfirmed) return;

//     try {
//       const updated = { ...transactions };
//       updated[material].splice(index, 1);
//       if (updated[material].length === 0) delete updated[material];
//       setTransactions(updated);
//       Swal.fire('Deleted', 'Entry removed', 'success');
//     } catch (err: any) {
//       Swal.fire('Error', err.response?.data?.message || 'Delete failed', 'error');
//     }
//   };

//   const handleAddMaterial = async () => {
//     if (!newMaterialName.trim()) {
//       Swal.fire('Error', 'Material name is required', 'error');
//       return;
//     }
//     if (transactions[newMaterialName]) {
//       Swal.fire('Error', 'Material already exists', 'error');
//       return;
//     }
//     setMaterialSubmitting(true);
//     try {
//       const updated = { ...transactions, [newMaterialName]: [] };
//       setTransactions(updated);
//       Swal.fire('Success', `Material "${newMaterialName}" added`, 'success');
//       setIsMaterialModalOpen(false);
//       setNewMaterialName('');
//     } catch (err: any) {
//       Swal.fire('Error', err.response?.data?.message || 'Failed to add material', 'error');
//     } finally {
//       setMaterialSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   const formatValue = (value: any) => {
//     if (typeof value === 'number') return value.toLocaleString();
//     return value !== undefined && value !== null ? value : '-';
//   };

//   return (
//     <div className="space-y-6 px-4 sm:px-0">
//       {/* Page Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Materials Inventory</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage material transactions and entries</p>
//         </div>
//         <button
//           onClick={() => setIsMaterialModalOpen(true)}
//           className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition w-full sm:w-auto"
//         >
//           <Plus size={18} />
//           Add Material
//         </button>
//       </div>

//       {/* Main Card */}
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         {/* Table Controls */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-gray-200 bg-gray-50">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <span>Show</span>
//             <select
//               className="border rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={entriesPerPage}
//               onChange={(e) => setEntriesPerPage(Number(e.target.value))}
//             >
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//               <option value={50}>50</option>
//               <option value={100}>100</option>
//             </select>
//             <span>entries</span>
//           </div>

//           <div className="relative w-full sm:w-64">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search material..."
//               className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-[800px] w-full text-sm">
//             <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-3 text-left">Material</th>
//                 {allKeys.map((key) => (
//                   <th key={key} className="px-6 py-3 text-left">{key}</th>
//                 ))}
//                 <th className="px-6 py-3 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {paginatedEntries.length === 0 ? (
//                 <td>
//                   <td colSpan={allKeys.length + 2} className="text-center py-16 text-gray-400">
//                     No entries found.
//                   </td>
//                 </td>
//               ) : (
//                 paginatedEntries.map((entry, idx) => (
//                   <tr key={`${entry.material}-${idx}`} className="hover:bg-gray-50 transition">
//                     <td className="px-6 py-3 font-medium text-gray-900">{entry.material}</td>
//                     {allKeys.map((key) => (
//                       <td key={key} className="px-6 py-3 text-gray-700">
//                         {formatValue(entry[key])}
//                       </td>
//                     ))}
//                     <td className="px-6 py-3 text-right whitespace-nowrap">
//                       <button
//                         onClick={() => openAddEntryModal(entry.material)}
//                         className="text-green-600 hover:text-green-800 mr-2 transition"
//                         title="Add entry"
//                       >
//                         <Plus size={16} />
//                       </button>
//                       <button
//                         onClick={() => openEditEntryModal(entry.material, entry.entryIndex, entry)}
//                         className="text-blue-600 hover:text-blue-800 mr-2 transition"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteEntry(entry.material, entry.entryIndex)}
//                         className="text-red-600 hover:text-red-800 transition"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Footer */}
//         {totalEntries > 0 && (
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-gray-200 text-sm text-gray-500 bg-gray-50">
//             <div>
//               Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} results
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="border px-2 py-1 rounded disabled:opacity-50 bg-white hover:bg-gray-100 transition"
//               >
//                 ‹
//               </button>
//               <span className="px-3 py-1 bg-blue-600 text-white rounded">{currentPage}</span>
//               <button
//                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages || totalPages === 0}
//                 className="border px-2 py-1 rounded disabled:opacity-50 bg-white hover:bg-gray-100 transition"
//               >
//                 ›
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal: Add/Edit Entry */}
//       {isEntryModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
//             <button
//               onClick={() => setIsEntryModalOpen(false)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//             >
//               <X size={24} />
//             </button>
//             <h2 className="text-xl font-bold mb-4">
//               {entryModalMode === 'add' ? `Add Entry for ${currentMaterial}` : `Edit Entry for ${currentMaterial}`}
//             </h2>
//             <div className="space-y-4">
//               {Object.keys(entryFormData).map((field) => (
//                 <div key={field}>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
//                   <input
//                     type={field === 'Date' ? 'date' : (field === 'Rate' || field === 'Amount' ? 'number' : 'text')}
//                     value={entryFormData[field] ?? ''}
//                     onChange={(e) =>
//                       setEntryFormData({
//                         ...entryFormData,
//                         [field]: field === 'Date' ? e.target.value : (field === 'Rate' || field === 'Amount' ? parseFloat(e.target.value) || 0 : e.target.value),
//                       })
//                     }
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     step={field === 'Rate' || field === 'Amount' ? 'any' : '1'}
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setIsEntryModalOpen(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition order-2 sm:order-1"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEntrySubmit}
//                 disabled={submitting}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition order-1 sm:order-2"
//               >
//                 {submitting ? 'Saving...' : 'Save Entry'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal: Add New Material */}
//       {isMaterialModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
//             <button
//               onClick={() => setIsMaterialModalOpen(false)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//             >
//               <X size={24} />
//             </button>
//             <h2 className="text-xl font-bold mb-4">Add New Material</h2>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Material Name</label>
//               <input
//                 type="text"
//                 value={newMaterialName}
//                 onChange={(e) => setNewMaterialName(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="e.g., Sand, Cement, Steel"
//                 autoFocus
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setIsMaterialModalOpen(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition order-2 sm:order-1"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddMaterial}
//                 disabled={materialSubmitting}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition order-1 sm:order-2"
//               >
//                 {materialSubmitting ? 'Adding...' : 'Add Material'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';

type MaterialTransactions = {
  [materialName: string]: any[];
};

export default function Materials() {
  const [transactions, setTransactions] = useState<MaterialTransactions>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [entryModalMode, setEntryModalMode] = useState<'add' | 'edit'>('add');
  const [currentMaterial, setCurrentMaterial] = useState('');
  const [currentEntryIndex, setCurrentEntryIndex] = useState<number | null>(null);
  const [entryFormData, setEntryFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState('');
  const [materialSubmitting, setMaterialSubmitting] = useState(false);

  const fetchTransactions = async () => {
    try {
      // Replace with your actual API call
      const mockData: MaterialTransactions = {
        Sand: [{ Date: "2026-03-01", "Supplier Name": "Shree Sand Suppliers", Rate: 1200, Amount: 1800000, Remarks: "Delivered on time" }],
        Cement: [{ Date: "2026-03-03", "Supplier Name": "ABC Traders", Rate: 380, Amount: 190000, Remarks: "Batch OK" }],
      };
      setTransactions(mockData);
    } catch (err) {
      Swal.fire('Error', 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const allEntries = Object.entries(transactions).flatMap(([material, entries]) =>
    entries.map((entry, idx) => ({ material, entryIndex: idx, ...entry }))
  );

  const filteredEntries = allEntries.filter((entry) =>
    entry.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEntries = filteredEntries.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + entriesPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, entriesPerPage]);

  const allKeys = Array.from(
    new Set(allEntries.flatMap(entry => Object.keys(entry).filter(k => k !== 'material' && k !== 'entryIndex')))
  );

  const openAddEntryModal = (material: string) => {
    setCurrentMaterial(material);
    setEntryModalMode('add');
    setCurrentEntryIndex(null);
    const template = transactions[material]?.[0] || {};
    const emptyEntry: any = {};
    Object.keys(template).forEach(key => { emptyEntry[key] = ''; });
    if (Object.keys(emptyEntry).length === 0) emptyEntry['Date'] = '';
    setEntryFormData(emptyEntry);
    setIsEntryModalOpen(true);
  };

  const openEditEntryModal = (material: string, index: number, entry: any) => {
    setCurrentMaterial(material);
    setEntryModalMode('edit');
    setCurrentEntryIndex(index);
    setEntryFormData({ ...entry });
    setIsEntryModalOpen(true);
  };

  const handleEntrySubmit = async () => {
    if (!entryFormData.Date) { Swal.fire('Error', 'Date is required', 'error'); return; }
    if (!entryFormData['Supplier Name']) { Swal.fire('Error', 'Supplier Name is required', 'error'); return; }
    if (entryFormData.Rate !== undefined && entryFormData.Rate !== '') {
      if (isNaN(Number(entryFormData.Rate))) { Swal.fire('Error', 'Rate must be a number', 'error'); return; }
      entryFormData.Rate = Number(entryFormData.Rate);
    }
    if (entryFormData.Amount !== undefined && entryFormData.Amount !== '') {
      if (isNaN(Number(entryFormData.Amount))) { Swal.fire('Error', 'Amount must be a number', 'error'); return; }
      entryFormData.Amount = Number(entryFormData.Amount);
    }

    setSubmitting(true);
    try {
      const updated = { ...transactions };
      if (entryModalMode === 'add') {
        if (!updated[currentMaterial]) updated[currentMaterial] = [];
        updated[currentMaterial].push(entryFormData);
      } else {
        if (currentEntryIndex !== null) updated[currentMaterial][currentEntryIndex] = entryFormData;
      }
      setTransactions(updated);
      Swal.fire('Success', `Entry ${entryModalMode === 'add' ? 'added' : 'updated'}`, 'success');
      setIsEntryModalOpen(false);
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (material: string, index: number) => {
    const confirm = await Swal.fire({ title: 'Delete this entry?', text: 'This action cannot be undone', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete' });
    if (!confirm.isConfirmed) return;
    try {
      const updated = { ...transactions };
      updated[material].splice(index, 1);
      if (updated[material].length === 0) delete updated[material];
      setTransactions(updated);
      Swal.fire('Deleted', 'Entry removed', 'success');
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const handleAddMaterial = async () => {
    if (!newMaterialName.trim()) { Swal.fire('Error', 'Material name is required', 'error'); return; }
    if (transactions[newMaterialName]) { Swal.fire('Error', 'Material already exists', 'error'); return; }
    setMaterialSubmitting(true);
    try {
      const updated = { ...transactions, [newMaterialName]: [] };
      setTransactions(updated);
      Swal.fire('Success', `Material "${newMaterialName}" added`, 'success');
      setIsMaterialModalOpen(false);
      setNewMaterialName('');
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to add material', 'error');
    } finally {
      setMaterialSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  const formatValue = (value: any) => {
    if (typeof value === 'number') return value.toLocaleString();
    return value !== undefined && value !== null ? value : '-';
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Materials Inventory</h1>
            <p className="text-sm text-gray-500 mt-1">Manage material transactions and entries</p>
          </div>
          <button
            onClick={() => setIsMaterialModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition w-full sm:w-auto"
          >
            <Plus size={18} /> Add Material
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-md">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="whitespace-nowrap">Show</span>
              <select
                className="border rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="whitespace-nowrap">entries</span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search material..."
                className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table – horizontal scroll on small screens */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-[800px] w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left">Material</th>
                    {allKeys.map((key) => (
                      <th key={key} className="px-4 sm:px-6 py-3 text-left whitespace-nowrap">{key}</th>
                    ))}
                    <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedEntries.length === 0 ? (
                    <tr>
                      <td colSpan={allKeys.length + 2} className="text-center py-16 text-gray-400">
                        No entries found.
                      </td>
                    </tr>
                  ) : (
                    paginatedEntries.map((entry, idx) => (
                      <tr key={`${entry.material}-${idx}`} className="hover:bg-gray-50 transition">
                        <td className="px-4 sm:px-6 py-3 font-medium text-gray-900 whitespace-nowrap">{entry.material}</td>
                        {allKeys.map((key) => (
                          <td key={key} className="px-4 sm:px-6 py-3 text-gray-700 whitespace-nowrap">
                            {formatValue(entry[key])}
                          </td>
                        ))}
                        <td className="px-4 sm:px-6 py-3 text-right whitespace-nowrap">
                          <button onClick={() => openAddEntryModal(entry.material)} className="text-green-600 hover:text-green-800 mr-2 transition">
                            <Plus size={16} />
                          </button>
                          <button onClick={() => openEditEntryModal(entry.material, entry.entryIndex, entry)} className="text-blue-600 hover:text-blue-800 mr-2 transition">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteEntry(entry.material, entry.entryIndex)} className="text-red-600 hover:text-red-800 transition">
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

          {/* Pagination Footer */}
          {totalEntries > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-gray-200 text-sm text-gray-500 bg-gray-50">
              <div>
                Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border px-2 py-1 rounded disabled:opacity-50 bg-white hover:bg-gray-100 transition"
                >
                  ‹
                </button>
                <span className="px-3 py-1 bg-blue-600 text-white rounded">{currentPage}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="border px-2 py-1 rounded disabled:opacity-50 bg-white hover:bg-gray-100 transition"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add/Edit Entry */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">{entryModalMode === 'add' ? `Add Entry for ${currentMaterial}` : `Edit Entry for ${currentMaterial}`}</h2>
              <button onClick={() => setIsEntryModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              {Object.keys(entryFormData).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{field}</label>
                  <input
                    type={field === 'Date' ? 'date' : (field === 'Rate' || field === 'Amount' ? 'number' : 'text')}
                    value={entryFormData[field] ?? ''}
                    onChange={(e) => setEntryFormData({ ...entryFormData, [field]: field === 'Date' ? e.target.value : (field === 'Rate' || field === 'Amount' ? parseFloat(e.target.value) || 0 : e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    step={field === 'Rate' || field === 'Amount' ? 'any' : '1'}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-gray-200">
              <button onClick={() => setIsEntryModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition order-2 sm:order-1">Cancel</button>
              <button onClick={handleEntrySubmit} disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition order-1 sm:order-2">{submitting ? 'Saving...' : 'Save Entry'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Material */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full relative">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Add New Material</h2>
              <button onClick={() => setIsMaterialModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition"><X size={24} /></button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Material Name *</label>
              <input
                type="text"
                value={newMaterialName}
                onChange={(e) => setNewMaterialName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="e.g., Sand, Cement, Steel"
                autoFocus
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-gray-200">
              <button onClick={() => setIsMaterialModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition order-2 sm:order-1">Cancel</button>
              <button onClick={handleAddMaterial} disabled={materialSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition order-1 sm:order-2">{materialSubmitting ? 'Adding...' : 'Add Material'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
