<template>
  <div class="space-y-6">
    <!-- Existing response display -->
    <div class="bg-white rounded-lg p-6 shadow-sm">
      <h3 class="text-lg font-medium mb-4">Response</h3>
      <p class="text-gray-700 whitespace-pre-wrap">{{ response.answer }}</p>
      
      <div v-if="response.context && response.context.length" class="mt-6">
        <h4 class="text-md font-medium mb-2">Sources Used:</h4>
        <div class="space-y-2">
          <div v-for="(ctx, index) in response.context" :key="index" 
               class="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
            <p>{{ ctx.content }}</p>
            <p class="text-xs text-gray-500 mt-1">Source: {{ ctx.source }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Feedback Component -->
    <FeedbackForm 
      v-if="response.id"
      :queryId="response.id"
      :showFeedback="true"
      @feedbackSubmitted="handleFeedbackSubmitted"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import FeedbackForm from './FeedbackForm.vue';
import type { QueryResponse } from '@/types/rag';

const props = defineProps<{
  response: QueryResponse & { id?: string };
}>();

const emit = defineEmits(['feedbackSubmitted']);

const handleFeedbackSubmitted = () => {
  emit('feedbackSubmitted');
};
</script>