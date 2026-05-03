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

  const handleSmartFill = async () => {
    const input = formData.url || formData.repo;
    if (!input) {
      alert('URL 또는 GitHub 주소를 먼저 입력해주세요.');
      return;
    }

    setIsAnalyzing(true);
    console.log('🚀 Starting Smart Fill for:', input);
    
    try {
      let repoPath = '';
      
      // 1. Extract GitHub Repo Path
      if (input.includes('github.com')) {
        repoPath = input.replace(/https?:\/\/github\.com\//, '').replace(/\/$/, '');
      } else if (!input.includes('://') && input.includes('/')) {
        repoPath = input;
      }

      // Handle tree/branch URLs in repo path
      if (repoPath.includes('/tree/')) repoPath = repoPath.split('/tree/')[0];

      let repoData = null;
      let packageJson = null;
      let usedBranch = 'main';

      // 2. Fetch Data from GitHub if possible
      if (repoPath) {
        console.log('📦 Analyzing GitHub Repo:', repoPath);
        
        try {
          const repoRes = await fetch(`https://api.github.com/repos/${repoPath}`);
          if (repoRes.ok) repoData = await repoRes.json();
        } catch (e) { console.error('GitHub API error:', e); }

        for (const branch of ['main', 'master', 'develop']) {
          const res = await fetch(`https://raw.githubusercontent.com/${repoPath}/${branch}/package.json`);
          if (res.ok) {
            packageJson = await res.json();
            usedBranch = branch;
            break;
          }
        }
      }

      // 3. Construct Metadata
      const deps = packageJson ? { ...packageJson.dependencies, ...packageJson.devDependencies } : {};
      const stack: string[] = [];
      
      const techMap: Record<string, string> = {
        'next': 'Next.js', 'react': 'React', 'tailwindcss': 'Tailwind CSS',
        'firebase': 'Firebase', '@supabase/supabase-js': 'Supabase', 'typescript': 'TypeScript',
        'framer-motion': 'Framer Motion', 'lucide-react': 'Lucide React', 'prisma': 'Prisma',
        'drizzle-orm': 'Drizzle ORM', 'shadcn-ui': 'Shadcn UI', 'zustand': 'Zustand',
        'vite': 'Vite', 'three': 'Three.js', 'recharts': 'Recharts', 'clerk': 'Clerk Auth',
        'next-auth': 'NextAuth', 'mongodb': 'MongoDB', 'postgresql': 'PostgreSQL'
      };

      Object.entries(techMap).forEach(([key, value]) => {
        if (deps[key] || (input.toLowerCase().includes(key) && !stack.includes(value))) {
          stack.push(value);
        }
      });

      // If no tech found but it's a URL, add some defaults
      if (stack.length === 0) {
        if (input.includes('vercel.app')) stack.push('Next.js', 'Tailwind CSS', 'Vercel');
        else stack.push('React', 'Web Standards');
      }

      const frontend = stack.filter(s => ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Framer Motion', 'Shadcn UI', 'Vite', 'Three.js', 'Recharts'].includes(s)).join(', ');
      const backend = stack.filter(s => ['Firebase', 'Supabase', 'Prisma', 'Drizzle ORM', 'MongoDB', 'PostgreSQL', 'Clerk Auth', 'NextAuth'].includes(s)).join(', ') || 'Cloud Managed / API';

      const techStackMarkdown = `### 🚀 Technical Stack
- **Frontend**: ${frontend || 'Modern React Stack'}
- **Backend**: ${backend}
- **Styling**: Tailwind CSS & Framer Motion
- **Deployment**: ${input.includes('vercel') ? 'Vercel' : 'Auto-deployed'}

### 💡 Key Features
- Smart automated workflow integration
- Responsive premium user interface
- Real-time data synchronization
- Performance optimized architecture`;

      // 4. Final State Update
      const domain = input.startsWith('http') ? new URL(input).hostname.split('.')[0] : '';
      const fallbackName = domain ? domain.charAt(0).toUpperCase() + domain.slice(1) : (repoPath.split('/')[1] || '');

      setFormData(prev => ({
        ...prev,
        name: prev.name || repoData?.name?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || fallbackName,
        description: prev.description || repoData?.description || `${fallbackName} - A high-performance web application.`,
        repo: repoPath ? `https://github.com/${repoPath}` : prev.repo,
        url: input.startsWith('http') ? input : prev.url,
        image: prev.image || (input.startsWith('http') ? `https://s0.wp.com/mshots/v1/${input}?w=800` : `https://opengraph.githubassets.com/1/${repoPath}`),
        memo: techStackMarkdown
      }));

      alert('✨ 스마트 자동 완성이 완료되었습니다!');

    } catch (error: any) {
      console.error('❌ Smart Fill Error:', error);
      alert(`자동 완성 중 오류 발생: ${error.message}`);
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
    analyzeGitHubRepo: handleSmartFill, // Alias for backward compatibility
  };
}
