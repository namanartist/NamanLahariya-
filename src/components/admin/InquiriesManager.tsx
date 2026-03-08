import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Trash2, Mail } from 'lucide-react';
import { useSiteData } from '../../context/SiteContext';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any;
}

export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useSiteData();

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const path = 'messages';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Inquiry[];
      setInquiries(data);
      setLoading(false);
    }, (error) => {
      console.error('Failed to fetch inquiries:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isLoggedIn]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    const path = `messages/${id}`;
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  if (!isLoggedIn) return <div className="text-center text-red-500 py-12">Access Denied. Please login as admin.</div>;
  if (loading) return <div className="text-center text-gray-500 py-12">Loading inquiries...</div>;

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
                    <span>{inquiry.createdAt?.toDate ? inquiry.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
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
