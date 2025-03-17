<template>
  <div class="p-6">
    <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Upload Document</h2>
    
    <div
      class="border-dashed border-2 border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50"
      @drop.prevent="handleDrop"
      @dragover.prevent
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @click="triggerFileInput"
      :class="{ 'border-indigo-500 bg-indigo-50': isDragging }"
    >
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        @change="handleFileSelect"
        accept=".txt,.pdf,.csv,.json"
        :multiple="false"
      >
      
      <div v-if="!uploading" class="space-y-4">
        <svg class="mx-auto h-16 w-16 text-indigo-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="text-base font-medium text-gray-700">
          Drag and drop a file here, or click to select
        </p>
        <p class="text-sm text-gray-500">
          Supported formats: TXT, PDF, CSV, JSON (max 10MB)
        </p>
      </div>
      
      <div v-else class="space-y-4">
        <div class="relative pt-1">
          <div class="flex mb-2 items-center justify-between">
            <div>
              <span class="text-sm font-medium inline-block text-indigo-600">
                Uploading {{ currentFile }}
              </span>
            </div>
            <div class="text-right">
              <span class="text-sm font-medium inline-block text-indigo-600">
                {{ Math.round(uploadProgress) }}%
              </span>
            </div>
          </div>
          <div class="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-indigo-100">
            <div
              :style="{ width: `${uploadProgress}%` }"
              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-300 rounded-full"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '@/utils/axios-interceptor';
import { useToast } from '@/composables/useToast';
const emit = defineEmits(['upload-complete']);
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const error = ref('');
const isDragging = ref(false);
const uploadProgress = ref(0);
const currentFile = ref('');
const { showToast } = useToast();

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    uploadFile(target.files[0]);
  }
};

const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files;
  if (files?.length) {
    uploadFile(files[0]);
  }
};

const validateFile = (file: File): boolean => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['text/plain', 'application/json', 'text/csv', 'application/pdf'];

  if (file.size > maxSize) {
    error.value = 'File size exceeds 10MB limit';
    return false;
  }

  if (!allowedTypes.includes(file.type)) {
    error.value = 'Unsupported file type. Please upload TXT, PDF, CSV, or JSON files.';
    return false;
  }

  return true;
};

const uploadFile = async (file: File) => {
  if (!validateFile(file)) return;

  uploading.value = true;
  error.value = '';
  uploadProgress.value = 0;
  currentFile.value = file.name;

  const formData = new FormData();
  formData.append('file', file);

  try {
    await api.post('/knowledge-base/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = (progressEvent.loaded * 100) / progressEvent.total;
        }
      },
    });

    showToast('Document uploaded successfully', 'success');
    emit('upload-complete');
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to upload document';
    error.value = message;
    showToast(message, 'error');
  } finally {
    uploading.value = false;
    currentFile.value = '';
  }
};
</script>

<style scoped>
.spinner {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #3498db;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 