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
      alert('분석할 URL 또는 GitHub 주소를 먼저 입력해주세요.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      let repoPath = '';
      let analyzedData: any = null;

      // 1. Fetch Metadata from API
      try {
        const analyzeRes = await fetch(`/api/analyze?url=${encodeURIComponent(input)}`);
        if (analyzeRes.ok) {
          analyzedData = await analyzeRes.json();
          // Try to extract GitHub URL from metadata if not already provided
          if (!formData.repo) {
            const desc = analyzedData.description || '';
            const githubMatch = desc.match(/github\.com\/([^/]+\/[^/\s?]+)/);
            if (githubMatch) repoPath = githubMatch[1].replace(/[\),.]/g, '');
          }
        }
      } catch (e) {
        console.error('Metadata API error:', e);
      }

      // 2. Extract GitHub Repo Path if explicitly provided or found in metadata
      const explicitGithubMatch = input.match(/github\.com\/([^/]+\/[^/\s?]+)/);
      if (explicitGithubMatch) {
        repoPath = explicitGithubMatch[1].split('/tree/')[0].replace(/\/$/, '');
      }

      let repoData = null;
      let packageJson = null;

      // 3. GitHub Analysis with Deep Search
      if (repoPath) {
        try {
          const repoRes = await fetch(`https://api.github.com/repos/${repoPath}`);
          if (repoRes.ok) repoData = await repoRes.json();
          
          // Try multiple branches for package.json
          const branches = ['main', 'master', 'develop', 'production'];
          for (const branch of branches) {
            const res = await fetch(`https://raw.githubusercontent.com/${repoPath}/${branch}/package.json`);
            if (res.ok) {
              packageJson = await res.json();
              break;
            }
          }
        } catch (e) { console.error('GitHub API error:', e); }
      }

      // 4. Advanced Tech Stack Detection
      const deps = packageJson ? { ...packageJson.dependencies, ...packageJson.devDependencies } : {};
      const stack: string[] = [];
      
      const techMap: Record<string, string> = {
        'next': 'Next.js', 'react': 'React', 'tailwindcss': 'Tailwind CSS',
        'firebase': 'Firebase', 'supabase': 'Supabase', 'typescript': 'TypeScript',
        'framer-motion': 'Framer Motion', 'lucide-react': 'Lucide React', 'prisma': 'Prisma',
        'shadcn': 'Shadcn UI', 'zustand': 'Zustand', 'vite': 'Vite', 'three': 'Three.js',
        'radix-ui': 'Radix UI', 'next-auth': 'NextAuth.js', 'tanstack/react-query': 'React Query',
        'recoil': 'Recoil', 'redux': 'Redux', 'axios': 'Axios', 'styled-components': 'Styled Components'
      };

      // Detect from dependencies
      Object.entries(techMap).forEach(([key, value]) => {
        if (deps[key] || Object.keys(deps).some(d => d.includes(key))) {
          if (!stack.includes(value)) stack.push(value);
        }
      });

      // Detect from keywords in metadata/URL
      const contentToScan = (analyzedData?.description || '') + (analyzedData?.title || '') + (repoData?.description || '') + input.toLowerCase();
      if (contentToScan.includes('nextjs') || contentToScan.includes('next.js')) stack.push('Next.js');
      if (contentToScan.includes('react')) stack.push('React');
      if (contentToScan.includes('tailwind')) stack.push('Tailwind CSS');
      if (contentToScan.includes('firebase')) stack.push('Firebase');
      if (contentToScan.includes('supabase')) stack.push('Supabase');
      if (contentToScan.includes('three.js') || contentToScan.includes('threejs')) stack.push('Three.js');

      const uniqueStack = Array.from(new Set(stack));

      // Default fallbacks if detection fails
      if (uniqueStack.length < 1) {
        if (input.includes('vercel.app')) uniqueStack.push('Next.js', 'Tailwind CSS');
        else uniqueStack.push('React', 'Modern Web Stack');
      }

      const frontend = uniqueStack.filter(s => ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Framer Motion', 'Shadcn UI', 'Vite', 'Three.js', 'Radix UI', 'Styled Components'].includes(s)).join(', ') || 'Next.js, React';
      const backend = uniqueStack.filter(s => ['Firebase', 'Supabase', 'Prisma', 'NextAuth.js'].includes(s)).join(', ') || 'Cloud Architecture';

      const techStackMarkdown = `### 🛠 Technical Specifications
- **Frontend Framework**: ${frontend}
- **Backend Architecture**: ${backend}
- **Language**: ${uniqueStack.includes('TypeScript') ? 'TypeScript (Strict Mode)' : 'Modern JavaScript (ES6+)'}
- **Styling Strategy**: ${uniqueStack.includes('Tailwind CSS') ? 'Tailwind CSS (Utility-first)' : 'Modern CSS (Module/Tailwind)'}

### 🚀 Key Features & Implementation
- **Interactive UI**: High-fidelity user interface with smooth state transitions.
- **Data Integration**: Robust data synchronization and cloud-native architecture.
- **Performance**: Optimized asset delivery and fast execution patterns.
- **Responsive Design**: Mobile-first fluid layout supporting all modern devices.

### 🛡 System Integrity
- **Security**: Implementation of secure data handling and authentication protocols.
- **Scalability**: Engineered for high-performance and global availability.`;

      // 5. Final State Update
      setFormData(prev => ({
        ...prev,
        name: prev.name || analyzedData?.title?.split(' - ')[0]?.split(' | ')[0]?.trim() || repoData?.name?.replace(/[-_]/g, ' ') || '',
        description: prev.description || analyzedData?.description || repoData?.description || 'A professional application engineered for optimal performance and user experience.',
        repo: repoPath ? `https://github.com/${repoPath}` : prev.repo,
        url: input.startsWith('http') ? input : prev.url,
        image: prev.image || analyzedData?.image || (input.startsWith('http') ? `https://s0.wp.com/mshots/v1/${input}?w=800` : `https://opengraph.githubassets.com/1/${repoPath}`),
        memo: techStackMarkdown // Force update technical details
      }));

      alert('✅ SYSTEM ANALYSIS COMPLETE: Technical details have been successfully synthesized.');

    } catch (error: any) {
      console.error('❌ Smart Fill Error:', error);
      alert('분석 중 오류가 발생했습니다. 로그를 확인해주세요.');
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
    analyzeGitHubRepo: handleSmartFill,
  };
}
