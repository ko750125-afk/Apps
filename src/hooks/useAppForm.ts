import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, collection, addDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AppData, Category } from '@/data/apps';
import { revalidateAppCaches } from '@/lib/revalidate';

const COLLECTION_NAME = '18_apps_list';

interface UseAppFormProps {
  initialData?: AppData;
  isEditing?: boolean;
}

const createDefaultFormData = (): AppData => ({
  id: '',
  name: '',
  url: '',
  repo: '',
  category: 'Business Website' as Category,
  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  featured: false,
  description: '',
  image: '',
  status: 'Exhibit',
  memo: '',
});

export function useAppForm({ initialData, isEditing = false }: UseAppFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState<AppData>(initialData || createDefaultFormData());

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
    setFormData(prev => ({ ...prev, memo: value || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    setLoading(true);

    try {
      const { id, ...rest } = formData;
      const submitData = {
        ...rest,
        date: isEditing ? (initialData?.date || formData.date) : formData.date,
      };

      if (isEditing && initialData?.id) {
        await updateDoc(doc(db, COLLECTION_NAME, initialData.id), submitData);
      } else if (id) {
        await setDoc(doc(db, COLLECTION_NAME, id), submitData);
      } else {
        await addDoc(collection(db, COLLECTION_NAME), submitData);
      }

      await revalidateAppCaches(id || undefined);

      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Error saving app:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeGitHubRepo = async () => {
    if (!formData.repo) {
      alert('GitHub 리포지토리 주소(owner/repo)를 먼저 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 1. Extract owner/repo
      const cleanRepo = formData.repo.replace('https://github.com/', '').replace(/\/$/, '');
      
      // 2. Try to fetch package.json (main or master)
      let packageJson = null;
      for (const branch of ['main', 'master']) {
        try {
          const res = await fetch(`https://raw.githubusercontent.com/${cleanRepo}/${branch}/package.json`);
          if (res.ok) {
            packageJson = await res.json();
            break;
          }
        } catch (e) {
          console.error(`Failed to fetch from ${branch} branch`, e);
        }
      }

      if (!packageJson) {
        throw new Error('package.json을 찾을 수 없습니다. 주소나 브랜치명을 확인해주세요.');
      }

      // 3. Analyze dependencies
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      const stack: string[] = [];

      if (deps['next']) stack.push('Next.js');
      if (deps['react']) stack.push('React');
      if (deps['tailwindcss'] || deps['@tailwindcss/postcss']) stack.push('Tailwind CSS');
      if (deps['firebase']) stack.push('Firebase');
      if (deps['@supabase/supabase-js']) stack.push('Supabase');
      if (deps['typescript']) stack.push('TypeScript');
      if (deps['framer-motion']) stack.push('Framer Motion');
      if (deps['lucide-react']) stack.push('Lucide React');
      if (deps['prisma']) stack.push('Prisma');
      if (deps['drizzle-orm']) stack.push('Drizzle ORM');
      if (deps['shadcn-ui'] || deps['@radix-ui/react-primitive']) stack.push('Shadcn UI');

      // 4. Update Memo
      const techStackMarkdown = `\n\n### Technical Details\n- **Frontend**: ${stack.filter(s => ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Framer Motion', 'Lucide React', 'Shadcn UI'].includes(s)).join(', ')}\n- **Backend**: ${stack.filter(s => ['Firebase', 'Supabase', 'Prisma', 'Drizzle ORM'].includes(s)).join(', ') || 'Client-side only'}\n- **Deployment**: Vercel (Auto-detected)`;
      
      setFormData(prev => ({
        ...prev,
        memo: (prev.memo || '') + techStackMarkdown
      }));

      alert('기술 스택 분석이 완료되었습니다!');
    } catch (error: any) {
      console.error('Analysis error:', error);
      alert(`분석 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    formData,
    loading,
    isAnalyzing,
    setFormData,
    handleChange,
    handleMemoChange,
    handleSubmit,
    analyzeGitHubRepo,
  };
}
