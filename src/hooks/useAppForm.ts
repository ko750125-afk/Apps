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
  category: 'Business Website' as Category,
  date: new Date().toISOString().slice(0, 7),
  featured: false,
  description: '',
  image: '',
  status: 'Exhibit',
  memo: '',
  imageObjectPosition: '',
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

      const firestore = db!;
      if (isEditing && initialData?.id) {
        await updateDoc(doc(firestore, COLLECTION_NAME, initialData.id), submitData);
      } else if (id) {
        await setDoc(doc(firestore, COLLECTION_NAME, id), submitData);
      } else {
        await addDoc(collection(firestore, COLLECTION_NAME), submitData);
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
    const input = formData.url;
    if (!input) {
      alert('분석할 배포 URL을 먼저 입력해주세요.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      let analyzedData: any = null;

      // 1. Fetch Metadata from API
      try {
        const analyzeRes = await fetch(`/api/analyze?url=${encodeURIComponent(input)}`);
        if (analyzeRes.ok) {
          analyzedData = await analyzeRes.json();
        }
      } catch (e) {
        console.error('Metadata API error:', e);
      }

      // 2. Default Tech Stack Detection
      const techStackMarkdown = `### 기술 사양

- **프론트엔드**: Next.js, React
- **백엔드·인프라**: 클라우드·API 연동
- **언어**: TypeScript(엄격 모드)
- **스타일**: Tailwind CSS

### 구현 포인트

- 인터랙티브 UI와 상태 전환
- 데이터 연동 및 동기화
- 에셋·렌더링 최적화
- 모바일 우선 반응형 레이아웃`;

      // 3. Final State Update
      setFormData(prev => ({
        ...prev,
        name: prev.name || analyzedData?.title?.split(' - ')[0]?.split(' | ')[0]?.trim() || '',
        description: prev.description || analyzedData?.description || 'A professional application engineered for optimal performance and user experience.',
        url: input.startsWith('http') ? input : prev.url,
        image: prev.image || analyzedData?.image || (input.startsWith('http') ? `https://s0.wp.com/mshots/v1/${input}?w=800` : ''),
        memo: techStackMarkdown
      }));

      alert('메타데이터를 반영했습니다. 필요한 항목은 수동으로 다듬어 주세요.');

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
