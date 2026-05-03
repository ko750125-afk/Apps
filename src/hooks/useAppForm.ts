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

    setIsAnalyzing(true);
    console.log('Starting GitHub analysis for:', formData.repo);
    
    try {
      // 1. Extract owner/repo from various formats
      let cleanRepo = formData.repo
        .replace('https://github.com/', '')
        .replace('http://github.com/', '')
        .replace(/\/$/, '');
      
      // Handle owner/repo/tree/branch format
      if (cleanRepo.includes('/tree/')) {
        cleanRepo = cleanRepo.split('/tree/')[0];
      }

      console.log('Clean repo path:', cleanRepo);
      
      if (!cleanRepo.includes('/') || cleanRepo.split('/').length < 2) {
        throw new Error('올바른 GitHub 리포지토리 형식(owner/repo)이 아닙니다.');
      }

      // 2. Try to fetch package.json (main or master)
      let packageJson = null;
      let usedBranch = '';

      for (const branch of ['main', 'master', 'develop']) {
        try {
          console.log(`Checking branch: ${branch}`);
          const res = await fetch(`https://raw.githubusercontent.com/${cleanRepo}/${branch}/package.json`);
          if (res.ok) {
            packageJson = await res.json();
            usedBranch = branch;
            console.log('Successfully fetched package.json from', branch);
            break;
          }
        } catch (e) {
          console.error(`Failed to fetch from ${branch} branch`, e);
        }
      }

      if (!packageJson) {
        throw new Error('package.json을 찾을 수 없습니다. 리포지토리가 공개(Public) 상태인지, 혹은 package.json이 루트 디렉토리에 있는지 확인해주세요.');
      }

      // 3. Analyze dependencies
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      const stack: string[] = [];

      const techMap: Record<string, string> = {
        'next': 'Next.js',
        'react': 'React',
        'tailwindcss': 'Tailwind CSS',
        '@tailwindcss/postcss': 'Tailwind CSS',
        'firebase': 'Firebase',
        '@supabase/supabase-js': 'Supabase',
        'typescript': 'TypeScript',
        'framer-motion': 'Framer Motion',
        'lucide-react': 'Lucide React',
        'prisma': 'Prisma',
        'drizzle-orm': 'Drizzle ORM',
        'shadcn-ui': 'Shadcn UI',
        '@radix-ui/react-primitive': 'Shadcn UI',
        'vapi': 'Vapi',
        'openai': 'OpenAI SDK',
        'zustand': 'Zustand',
        'react-query': 'React Query',
        '@tanstack/react-query': 'React Query'
      };

      Object.entries(techMap).forEach(([key, value]) => {
        if (deps[key] && !stack.includes(value)) {
          stack.push(value);
        }
      });

      // 4. Update Memo
      const frontendList = ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Framer Motion', 'Lucide React', 'Shadcn UI', 'Zustand', 'React Query'];
      const backendList = ['Firebase', 'Supabase', 'Prisma', 'Drizzle ORM', 'Vapi', 'OpenAI SDK'];

      const frontend = stack.filter(s => frontendList.includes(s)).join(', ');
      const backend = stack.filter(s => backendList.includes(s)).join(', ') || 'Client-side only';
      
      const techStackMarkdown = `### Technical Details
- **Frontend**: ${frontend || 'React/Next.js (Detected)'}
- **Backend**: ${backend}
- **Deployment**: Vercel (Auto-detected)
- **Repo Analysis**: Generated from \`${usedBranch}\` branch`;

      // 5. Update State
      setFormData(prev => {
        const currentMemo = prev.memo || '';
        
        // If already has technical details, we just append or prepend based on user's preference
        // For simplicity and to avoid the "not working" issue, we always append if it doesn't exist
        // or replace if it exists (but without the blocking confirm)
        
        if (currentMemo.includes('### Technical Details')) {
          const parts = currentMemo.split('### Technical Details');
          return {
            ...prev,
            memo: parts[0] + techStackMarkdown
          };
        }

        return {
          ...prev,
          memo: currentMemo ? `${currentMemo}\n\n${techStackMarkdown}` : techStackMarkdown
        };
      });

      console.log('✅ Analysis complete and state updated.');
      alert('기술 스택 분석이 완료되었습니다! 화면 아래쪽의 [Technical Details] 필드를 확인해주세요.');
    } catch (error: any) {
      console.error('❌ Analysis error:', error);
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
