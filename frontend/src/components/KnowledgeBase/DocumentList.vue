<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Your Documents</h2>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="spinner"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="documents.length === 0" class="text-center py-8 text-gray-500">
        No documents uploaded yet. Start by uploading a document.
      </div>

      <!-- Document List -->
      <div v-else class="space-y-4">
        <div
          v-for="doc in documents"
          :key="doc.id"
          class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-gray-900">{{ doc.filename }}</h3>
              <p class="text-sm text-gray-500 mt-1">
                Uploaded {{ new Date(doc.createdAt).toLocaleDateString() }}
              </p>
              <p class="text-sm text-gray-500 mt-0.5">
                {{ doc.chunks.length }} chunks
              </p>
            </div>
            
            <div class="flex space-x-3">
              
              <button
                @click="confirmDelete(doc)"
                class="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 class="text-xl font-semibold mb-4">Confirm Delete</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "{{ selectedDocument?.filename }}"? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            @click="deleteDocument"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/utils/axios-interceptor';
import { useToast } from '@/composables/useToast';

interface Document {
  id: string;
  filename: string;
  contentType: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const documents = ref([]);
const loading = ref(false);
const error = ref('');
const showDeleteModal = ref(false);
const selectedDocument = ref<Document | null>(null);
const { showToast } = useToast();

const fetchDocuments = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await api.get('/knowledge-base/documents', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }); 
    documents.value = response.data;
  } catch (err) {
    error.value = 'Failed to load documents';
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (document) => {
  selectedDocument.value = document;
  showDeleteModal.value = true;
};

const deleteDocument = async () => {
  try {
    await api.delete(`/knowledge-base/documents/${selectedDocument.value.id}`, {
      headers: {  
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: { documentId: selectedDocument.value.id }
    });
    
    showToast('Document deleted successfully', 'success');
    await fetchDocuments();
  } catch (err) {
    showToast('Failed to delete document', 'error');
  } finally {
    showDeleteModal.value = false;
    selectedDocument.value = null;
  }
};

const viewDocument = (document) => {
  // Implement document viewing logic
};

onMounted(fetchDocuments);

// Make fetchDocuments available to parent components
defineExpose({
  fetchDocuments
});
</script>

<style scoped>
.spinner {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #3498db;
  width: 28px;
  height: 28px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 