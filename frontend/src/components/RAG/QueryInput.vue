<!-- frontend/src/components/RAG/QueryInput.vue -->
<template>
  <div class="w-full">
    <form @submit.prevent="submitQuery" class="flex flex-col space-y-4">
      <div class="relative">
        <textarea
          v-model="query"
          style="color: black;"
          class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[120px] bg-white shadow-sm !color-black"
          :class="{ 'opacity-50': loading }"
          rows="3"
          placeholder="Ask a question about your documents..."
          :disabled="loading"
        ></textarea>
        <div v-if="loading" class="absolute right-4 top-4">
          <div class="spinner"></div>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium shadow-sm"
          :disabled="loading || !query.trim()"
        >
          {{ loading ? 'Processing...' : 'Submit' }}
        </button>
      </div>
    </form>

    <div v-if="error" class="mt-4 text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from '@/utils/axios-interceptor';
import { useToast } from '@/composables/useToast';

const query = ref('');
const loading = ref(false);
const error = ref('');
const { showToast } = useToast();

const emit = defineEmits(['query-submitted']);

const submitQuery = async () => {
  if (!query.value.trim()) return;

  loading.value = true;
  error.value = '';

  try {
    const response = await axios.post('/rag/query', {
      query: query.value.trim()
    });

    emit('query-submitted', response.data);
    query.value = ''; // Clear the input after successful submission
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to process query';
    showToast(error.value, 'error');
  } finally {
    loading.value = false;
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
  animation: spin 0.8s linear infinite;
  opacity: 0.8;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>