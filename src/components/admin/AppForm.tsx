import React from 'react';
import { AppData } from '@/data/apps';
import { useAppForm } from '@/hooks/useAppForm';
import { AppFormMain, AppFormSidebar, AppFormActions } from './AppFormSections';
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
    systemLogs,
    setFormData,
    handleChange,
    handleMemoChange,
    fetchAppInfo,
    handleSubmit,
  } = useAppForm({ initialData, isEditing });

  return (
    <form onSubmit={handleSubmit} className="space-y-0">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Main fields */}
        <div className="lg:col-span-3">
          <AppFormMain
            formData={formData}
            handleChange={handleChange}
            handleMemoChange={handleMemoChange}
          />
        </div>

        {/* Right: Sidebar fields */}
        <div className="lg:col-span-2">
          <AppFormSidebar
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            fetchAppInfo={fetchAppInfo}
            loading={loading}
            systemLogs={systemLogs}
          />
        </div>
      </div>

      <AppFormActions
        loading={loading}
        isEditing={isEditing}
        onAbort={() => router.back()}
      />
    </form>
  );
}
