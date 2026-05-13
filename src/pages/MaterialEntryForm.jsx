import { useState } from 'react';
import Swal from 'sweetalert2';
import { X } from 'lucide-react';
import axios from 'axios';
import ProjectDropdown from './ProjectDropdown';

interface MaterialEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedProjectId: string;
}

interface FormData {
  projectId: string;
  materialName: string;
  date: string;
  challanNumber: string;
  vehicleNumber: string;
  supplierName: string;
  quantity: string;
  rate: string;
  remarks: string;
}

const MATERIAL_OPTIONS = [
  'Sand',
  'Aggregate',
  'Cement',
  'Steel',
  'Fabrication',
  'Hardware',
  'Bricks',
  'Stone',
  'Tiles',
  'Granite',
  'Electric',
  'Plumbing',
  'Plywood',
  'Paint'
];

export default function MaterialEntryForm({
  isOpen,
  onClose,
  onSuccess,
  selectedProjectId
}: MaterialEntryFormProps) {
  const [formData, setFormData] = useState<FormData>({
    projectId: selectedProjectId,
    materialName: '',
    date: new Date().toISOString().split('T')[0],
    challanNumber: '',
    vehicleNumber: '',
    supplierName: '',
    quantity: '',
    rate: '',
    remarks: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.projectId) newErrors.projectId = 'Project is required';
    if (!formData.materialName.trim()) newErrors.materialName = 'Material name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.challanNumber.trim()) newErrors.challanNumber = 'Challan number is required';
    if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
    if (!formData.supplierName.trim()) newErrors.supplierName = 'Supplier name is required';
    if (!formData.quantity || Number(formData.quantity) <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (!formData.rate || Number(formData.rate) <= 0) newErrors.rate = 'Rate must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        materialName: formData.materialName,
        entry: {
          Date: formData.date,
          'Challan Number': formData.challanNumber,
          'Vehicle Number': formData.vehicleNumber,
          'Supplier Name': formData.supplierName,
          Quantity: Number(formData.quantity),
          Rate: Number(formData.rate),
          Remarks: formData.remarks
        },
        projectId: formData.projectId
      };

      const response = await axios.post('/api/materials', payload, {
        withCredentials: true
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Material entry added successfully',
        confirmButtonColor: '#2563eb'
      });

      resetForm();
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add material entry';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      projectId: selectedProjectId,
      materialName: '',
      date: new Date().toISOString().split('T')[0],
      challanNumber: '',
      vehicleNumber: '',
      supplierName: '',
      quantity: '',
      rate: '',
      remarks: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Material Entry</h2>
            <p className="text-sm text-gray-500 mt-1">Fill in all required fields marked with *</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project *
            </label>
            <ProjectDropdown
              value={formData.projectId}
              onChange={(pid) => {
                setFormData(prev => ({ ...prev, projectId: pid }));
                if (errors.projectId) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.projectId;
                    return newErrors;
                  });
                }
              }}
              required
            />
            {errors.projectId && (
              <p className="text-red-500 text-xs mt-1">{errors.projectId}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Material Name *
              </label>
              <select
                name="materialName"
                value={formData.materialName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg outline-none transition ${
                  errors.materialName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2`}
              >
                <option value="">Select a material</option>
                {MATERIAL_OPTIONS.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
              {errors.materialName && (
                <p className="text-red-500 text-xs mt-1">{errors.materialName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg outline-none transition ${
                  errors.date
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2`}
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Challan Number *
              </label>
              <input
                type="text"
                name="challanNumber"
                value={formData.challanNumber}
                onChange={handleInputChange}
                placeholder="e.g., CH-001"
                className={`w-full px-4 py-2.5 border rounded-lg outline-none transition ${
                  errors.challanNumber
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2`}
              />
              {errors.challanNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.challanNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vehicle Number *
              </label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleInputChange}
                placeholder="e.g., MH-01-AB-1234"
                className={`w-full px-4 py-2.5 border rounded-lg outline-none transition ${
                  errors.vehicleNumber
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2`}
              />
              {errors.vehicleNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.vehicleNumber}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Supplier Name *
            </label>
            <input
              type="text"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleInputChange}
              placeholder="e.g., ABC Suppliers"
              className={`w-full px-4 py-2.5 border rounded-lg outline-none transition ${
                errors.supplierName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } focus:ring-2`}
            />
            {errors.supplierName && (
              <p className="text-red-500 text-xs mt-1">{errors.supplierName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="e.g., 100"
                step="any"
                className={`w-full px-4 py-2.5 border rounded-lg outline-none transition ${
                  errors.quantity
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2`}
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rate (₹) *
              </label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleInputChange}
                placeholder="e.g., 1500"
                step="any"
                className={`w-full px-4 py-2.5 border rounded-lg outline-none transition ${
                  errors.rate
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2`}
              />
              {errors.rate && (
                <p className="text-red-500 text-xs mt-1">{errors.rate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              placeholder="Optional notes about this entry"
              rows={3}
              className={`w-full px-4 py-2.5 border rounded-lg outline-none transition resize-none ${
                'border-gray-300 focus:ring-blue-500'
              } focus:ring-2`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-blue-400 transition"
            >
              {isSubmitting ? 'Adding...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
