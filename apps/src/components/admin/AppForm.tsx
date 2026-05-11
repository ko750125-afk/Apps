import React from 'react';
import { AppData } from '@/data/apps';
import { useAppForm } from '@/hooks/useAppForm';
import { AppFormMain, AppFormActions } from './AppFormSections';
import { useRouter } from 'next/navigation';

interface AppFormProps {
  initialData?: AppData;
  isEditing?: boolean;
}

export default function AppForm({ initialData, isEditing = false }: AppFormProps) {
  const router = useRouter();
  const {
    formData,
    loading,
    isAnalyzing,
    setFormData,
    handleChange,
    handleMemoChange,
    handleSubmit,
    analyzeGitHubRepo,
  } = useAppForm({ initialData, isEditing });

  return (
    <form onSubmit={handleSubmit} className="space-y-0">
      <AppFormMain
        formData={formData}
        handleChange={handleChange}
        handleMemoChange={handleMemoChange}
        setFormData={setFormData}
        loading={loading}
        isAnalyzing={isAnalyzing}
        isEditing={isEditing}
        analyzeGitHubRepo={analyzeGitHubRepo}
      />

      <AppFormActions
        loading={loading}
        onAbort={() => router.back()}
      />
    </form>
  );
}

