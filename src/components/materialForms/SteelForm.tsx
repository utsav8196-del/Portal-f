import { useState } from 'react';
import { MaterialFormProps } from './types';

export default function SteelForm({ initialData = {}, onSubmit, onCancel, isSubmitting }: MaterialFormProps) {
  const [form, setForm] = useState({
    Date: initialData.Date || new Date().toISOString().split('T')[0],
    'Supplier Name': initialData['Supplier Name'] || '',
    Diameter: initialData.Diameter || '',
    Weight: initialData.Weight || '',
    Rate: initialData.Rate || '',
    Remarks: initialData.Remarks || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = parseFloat(form.Weight);
    const rate = parseFloat(form.Rate);
    if (!form.Date || !form['Supplier Name'] || !form.Diameter || !weight || !rate) {
      alert('Please fill all required fields');
      return;
    }
    const amount = weight * rate;
    onSubmit({ ...form, Weight: weight, Rate: rate, Amount: amount, Quantity: weight });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-semibold">Date *</label><input type="date" name="Date" value={form.Date} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Supplier Name *</label><input type="text" name="Supplier Name" value={form['Supplier Name']} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Diameter (mm) *</label><input type="text" name="Diameter" value={form.Diameter} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Weight (kg) *</label><input type="number" step="any" name="Weight" value={form.Weight} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Rate (₹/kg) *</label><input type="number" step="any" name="Rate" value={form.Rate} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Remarks</label><textarea name="Remarks" value={form.Remarks} onChange={handleChange} rows={2} className="w-full border rounded px-3 py-2" /></div>
      <div className="flex justify-end gap-3"><button type="button" onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button><button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save'}</button></div>
    </form>
  );
}