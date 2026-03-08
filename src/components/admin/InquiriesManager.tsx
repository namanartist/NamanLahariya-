import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Trash2, Mail, MessageSquare } from 'lucide-react';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const data = await api.get('/admin/inquiries');
      setInquiries(data);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await api.delete(`/admin/inquiries/${id}`);
      setInquiries(inquiries.filter(i => i.id !== id));
    } catch (error) {
      console.error('Failed to delete inquiry:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {inquiries.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No inquiries yet.</div>
      ) : (
        <div className="grid gap-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-[#1a1a1a] p-6 rounded-xl border border-white/5 hover:border-accent/20 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg">{inquiry.subject}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <span className="font-medium text-accent">{inquiry.name}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1"><Mail size={12} /> {inquiry.email}</span>
                    <span>&bull;</span>
                    <span>{new Date(inquiry.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(inquiry.id)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="bg-[#050505] p-4 rounded-lg text-gray-300 text-sm leading-relaxed border border-white/5">
                {inquiry.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
