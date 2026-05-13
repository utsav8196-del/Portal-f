import { useState } from 'react';
import { MaterialFormProps } from './types';

export default function BricksForm({ initialData = {}, onSubmit, onCancel, isSubmitting }: MaterialFormProps) {
  const [form, setForm] = useState({
    Date: initialData.Date || new Date().toISOString().split('T')[0],
    'Challan Number': initialData['Challan Number'] || '',
    'Vehicle Number': initialData['Vehicle Number'] || '',
    'Supplier Name': initialData['Supplier Name'] || '',
    Quantity: initialData.Quantity || '',
    Rate: initialData.Rate || '',
    Remarks: initialData.Remarks || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseFloat(form.Quantity);
    const rate = parseFloat(form.Rate);
    if (!form.Date || !form['Challan Number'] || !form['Vehicle Number'] || !form['Supplier Name'] || !quantity || !rate) {
      alert('Please fill all required fields');
      return;
    }
    const amount = quantity * rate;
    onSubmit({ ...form, Quantity: quantity, Rate: rate, Amount: amount });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-semibold">Date *</label><input type="date" name="Date" value={form.Date} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Challan Number *</label><input type="text" name="Challan Number" value={form['Challan Number']} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Vehicle Number *</label><input type="text" name="Vehicle Number" value={form['Vehicle Number']} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Supplier Name *</label><input type="text" name="Supplier Name" value={form['Supplier Name']} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Quantity (pcs) *</label><input type="number" step="1" name="Quantity" value={form.Quantity} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Rate (₹/pc) *</label><input type="number" step="any" name="Rate" value={form.Rate} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Remarks</label><textarea name="Remarks" value={form.Remarks} onChange={handleChange} rows={2} className="w-full border rounded px-3 py-2" /></div>
      <div className="flex justify-end gap-3"><button type="button" onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button><button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save'}</button></div>
    </form>
  );
}