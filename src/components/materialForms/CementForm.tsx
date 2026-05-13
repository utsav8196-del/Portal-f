import { useState } from 'react';
import { MaterialFormProps } from './types';

export default function CementForm({ initialData = {}, onSubmit, onCancel, isSubmitting }: MaterialFormProps) {
  const [form, setForm] = useState({
    Date: initialData.Date || new Date().toISOString().split('T')[0],
    Type: initialData.Type || '',
    Grade: initialData.Grade || '',
    Manufacturer: initialData.Manufacturer || '',
    'Supplier Name': initialData['Supplier Name'] || '',
    Bags: initialData.Bags || '',
    Rate: initialData.Rate || '',
    Remarks: initialData.Remarks || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bags = parseFloat(form.Bags);
    const rate = parseFloat(form.Rate);
    if (!form.Date || !form.Type || !form.Grade || !form.Manufacturer || !form['Supplier Name'] || !bags || !rate) {
      alert('Please fill all required fields');
      return;
    }
    const amount = bags * rate;
    onSubmit({ ...form, Bags: bags, Rate: rate, Amount: amount, Quantity: bags });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-semibold">Date *</label><input type="date" name="Date" value={form.Date} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Type (OPC/PPC) *</label><input type="text" name="Type" value={form.Type} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Grade (43/53) *</label><input type="text" name="Grade" value={form.Grade} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Manufacturer *</label><input type="text" name="Manufacturer" value={form.Manufacturer} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Supplier Name *</label><input type="text" name="Supplier Name" value={form['Supplier Name']} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Bags *</label><input type="number" step="1" name="Bags" value={form.Bags} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Rate (₹/bag) *</label><input type="number" step="any" name="Rate" value={form.Rate} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block text-sm font-semibold">Remarks</label><textarea name="Remarks" value={form.Remarks} onChange={handleChange} rows={2} className="w-full border rounded px-3 py-2" /></div>
      <div className="flex justify-end gap-3"><button type="button" onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button><button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save'}</button></div>
    </form>
  );
}