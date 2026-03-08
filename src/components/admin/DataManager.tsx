import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'json' | 'date';
}

interface DataManagerProps {
  endpoint: string;
  columns: Column[];
  title: string;
}

export default function DataManager({ endpoint, columns, title }: DataManagerProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  const fetchItems = async () => {
    try {
      const data = await api.get(`/admin/${endpoint}`);
      setItems(data);
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setIsAdding(true);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
    setFormData({});
  };

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isAdding) {
        const newItem = await api.post(`/admin/${endpoint}`, formData);
        setItems([...items, newItem]);
      } else if (editingItem) {
        const updatedItem = await api.put(`/admin/${endpoint}/${editingItem.id}`, formData);
        setItems(items.map(i => (i.id === editingItem.id ? updatedItem : i)));
      }
      handleCancel();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/admin/${endpoint}/${id}`);
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-black font-medium rounded-lg hover:bg-accent-dim transition-colors"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      {(isAdding || editingItem) && (
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/5 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">{isAdding ? 'Add New Item' : 'Edit Item'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {columns.map((col) => (
              <div key={col.key}>
                <label className="block text-sm font-medium text-gray-400 mb-1">{col.label}</label>
                {col.type === 'textarea' ? (
                  <textarea
                    value={formData[col.key] || ''}
                    onChange={(e) => handleChange(col.key, e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors"
                    rows={4}
                  />
                ) : col.type === 'json' ? (
                  <input
                    type="text"
                    value={Array.isArray(formData[col.key]) ? formData[col.key].join(', ') : formData[col.key] || ''}
                    onChange={(e) => handleChange(col.key, e.target.value.split(',').map((s: string) => s.trim()))}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors"
                    placeholder="Item 1, Item 2, Item 3"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData[col.key] || ''}
                    onChange={(e) => handleChange(col.key, e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors"
                  />
                )}
              </div>
            ))}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-accent text-black font-medium rounded-lg hover:bg-accent-dim transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-[#1a1a1a] p-6 rounded-xl border border-white/5 flex justify-between items-start group hover:border-accent/20 transition-colors">
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg mb-1">{item.title || item.name || item.subject}</h3>
              <div className="text-sm text-gray-400 space-y-1">
                {columns.slice(0, 3).map(col => (
                    item[col.key] && col.key !== 'title' && col.key !== 'name' && col.key !== 'subject' && (
                        <p key={col.key} className="line-clamp-1">
                            <span className="font-mono text-xs uppercase text-gray-600 mr-2">{col.label}:</span>
                            {typeof item[col.key] === 'object' ? JSON.stringify(item[col.key]) : item[col.key]}
                        </p>
                    )
                ))}
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 text-gray-500 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
