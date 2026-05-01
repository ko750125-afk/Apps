import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, collection, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AppData, Category } from '@/data/apps';

interface UseAppFormProps {
  initialData?: AppData;
  isEditing?: boolean;
}

export function useAppForm({ initialData, isEditing = false }: UseAppFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>(['READY_FOR_INPUT']);

  const defaultFormData: AppData = {
    id: '',
    name: '',
    url: '',
    repo: '',
    category: 'Business Website' as Category,
    date: '',
    featured: false,
    description: '',
    image: '',
    status: 'Exhibit',
    memo: '',
  };

  const [formData, setFormData] = useState<AppData>(initialData || defaultFormData);

  const addLog = (msg: string) => {
    setSystemLogs(prev => [...prev.slice(-4), msg]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMemoChange = (value?: string) => {
    setFormData(prev => ({
      ...prev,
      memo: value || ''
    }));
  };

  const fetchAppInfo = async () => {
    if (!formData.url) {
      addLog('ERR: URL_NOT_SPECIFIED');
      return;
    }

    setLoading(true);
    addLog(`SCANNING_TARGET: ${formData.url}`);
    try {
      const url = formData.url.startsWith('http') ? formData.url : `https://${formData.url}`;
      const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=true`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === 'success') {
        const { title, description, image, screenshot } = data.data;
        addLog('METADATA_ACQUIRED_INJECTING_FIELDS');
        
        setFormData(prev => ({
          ...prev,
          name: prev.name || title?.toUpperCase() || '',
          description: prev.description || description || '',
          image: screenshot?.url || image?.url || prev.image || '',
        }));
      } else {
        throw new Error('Failed to fetch metadata');
      }
    } catch (error) {
      console.error('Error fetching app info:', error);
      addLog('ERR: SCAN_FAILED_FALLBACK_TO_MANUAL');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    addLog('COMMENCING_DATA_TRANSMISSION...');

    try {
      const finalData = {
        ...formData,
        date: formData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };

      // Remove ID for submission if it's new
      const { id: _unusedId, ...submitData } = finalData;
      void _unusedId; // Explicitly mark as unused for linter if needed

      if (!db) throw new Error('Firebase DB not initialized');

      if (isEditing && initialData?.id) {
        addLog(`UPDATING_NODE_ID: ${initialData.id}`);
        const appRef = doc(db, '18_apps_list', initialData.id);
        await updateDoc(appRef, submitData);
        addLog('SYNC_SUCCESSFUL');
      } else {
        addLog('INITIALIZING_NEW_NODE_ENTRY...');
        const appsRef = collection(db, '18_apps_list');
        await addDoc(appsRef, submitData);
        addLog('ENTRY_CREATED_SUCCESSFULLY');
      }

      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 800);
    } catch (error) {
      console.error('Error saving app:', error);
      addLog('TRANSMISSION_ERROR_ABORTING');
      alert('Failed to save app. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    systemLogs,
    setFormData,
    handleChange,
    handleMemoChange,
    fetchAppInfo,
    handleSubmit,
    addLog
  };
}
