import React, { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteContext';
import { Pencil, Check, X } from 'lucide-react';

interface EditableFieldProps {
  field: keyof ReturnType<typeof useSiteData>['siteData'];
  as?: 'input' | 'textarea';
  className?: string;
  children: React.ReactNode;
}

export default function EditableField({ field, as = 'input', className = '', children }: EditableFieldProps) {
  const { siteData, updateSiteData, isLoggedIn } = useSiteData();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(siteData[field]);

  useEffect(() => {
    setValue(siteData[field]);
  }, [siteData, field]);

  if (!isLoggedIn) {
    return <>{children}</>;
  }

  const handleSave = () => {
    updateSiteData({ [field]: value });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(siteData[field]);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`relative inline-block w-full ${className}`}>
        {as === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-card border border-accent/50 rounded p-2 outline-none focus:border-accent"
            rows={4}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-card border border-accent/50 rounded p-2 outline-none focus:border-accent"
          />
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <button onClick={handleSave} className="p-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/40">
            <Check size={16} />
          </button>
          <button onClick={handleCancel} className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40">
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group inline-block ${className}`}>
      {children}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute -top-2 -right-6 opacity-0 group-hover:opacity-100 p-1 bg-accent/20 text-accent rounded hover:bg-accent/40 transition-opacity"
        title="Edit"
      >
        <Pencil size={14} />
      </button>
    </div>
  );
}
