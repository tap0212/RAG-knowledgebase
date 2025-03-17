<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 class="text-center text-3xl font-extrabold text-gray-900 mb-8">
          Knowledge Base Assistant
        </h1>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <DocumentUpload @upload-complete="refreshDocuments" />
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <DocumentList ref="documentList" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <QueryInput @query-submitted="handleQueryResponse" />
        <div v-if="queryResponse" class="mt-6">
          <ResponseDisplay :response="queryResponse" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DocumentUpload from '@/components/KnowledgeBase/DocumentUpload.vue';
import DocumentList from '@/components/KnowledgeBase/DocumentList.vue';
import QueryInput from '@/components/Rag/QueryInput.vue';
import ResponseDisplay from '@/components/Rag/ResponseDisplay.vue';
import { useToast } from '@/composables/useToast';

const documentList = ref(null);
const queryResponse = ref(null);
const { showToast } = useToast();

const refreshDocuments = () => {
  documentList.value?.fetchDocuments();
};

const handleQueryResponse = (response) => {
  queryResponse.value = response;
};
</script> 