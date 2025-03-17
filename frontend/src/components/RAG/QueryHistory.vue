<template>
    <div class="bg-white rounded-lg shadow p-4">
      <h2 class="text-xl font-semibold mb-4">Query History</h2>
      
      <div v-if="loading" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
      
      <div v-else-if="history.length === 0" class="text-gray-500 text-center py-4">
        No queries yet
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="query in history"
          :key="query.id"
          class="border rounded-lg p-3 hover:bg-gray-50"
        >
          <div class="font-medium">{{ query.query }}</div>
          <div class="text-sm text-gray-600 mt-1">{{ query.response }}</div>
          <div class="text-xs text-gray-500 mt-2">
            {{ new Date(query.createdAt).toLocaleString() }}
          </div>
          <div v-if="query.feedback" class="mt-2 text-sm">
            <span :class="query.feedback.isHelpful ? 'text-green-600' : 'text-red-600'">
              {{ query.feedback.isHelpful ? 'Helpful' : 'Not Helpful' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axiosInstance from '@/utils/axios-interceptor';
  import type { QueryRecord } from '@/types/rag';
  
  const history = ref<QueryRecord[]>([]);
  const loading = ref(false);
  
  const fetchQueryHistory = async () => {
    loading.value = true;
    try {
      const response = await axiosInstance.get('/rag/history');
      history.value = response.data;
    } catch (error) {
      console.error('Failed to fetch query history:', error);
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(fetchQueryHistory);
  
  defineExpose({
    fetchQueryHistory
  });
  </script>