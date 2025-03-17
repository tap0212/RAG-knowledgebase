<template>
    <div v-if="showFeedback" class="mt-6 p-4 bg-white rounded-lg shadow">
      <h3 class="text-lg font-medium mb-4">Was this response helpful?</h3>
      
      <div class="flex space-x-4 mb-4">
        <button
          @click="submitFeedback(true)"
          :class="[
            'px-4 py-2 rounded-md',
            isHelpful === true ? 'bg-green-500 text-white' : 'bg-gray-100'
          ]"
        >
          Yes
        </button>
        <button
          @click="submitFeedback(false)"
          :class="[
            'px-4 py-2 rounded-md',
            isHelpful === false ? 'bg-red-500 text-white' : 'bg-gray-100'
          ]"
        >
          No
        </button>
      </div>
  
      <div v-if="isHelpful === false" class="mt-4">
        <label class="block text-sm font-medium text-gray-700">Additional Comments</label>
        <textarea
          v-model="comment"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Please let us know how we can improve..."
        ></textarea>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import axiosInstance from '@/utils/axios-interceptor';
  import { useToast } from '@/composables/useToast';
  
  const props = defineProps<{
    queryId: string;
    showFeedback: boolean;
  }>();
  
  const emit = defineEmits(['feedbackSubmitted']);
  const { showToast } = useToast();
  
  const isHelpful = ref<boolean | null>(null);
  const comment = ref('');
  
  const submitFeedback = async (helpful: boolean) => {
    try {
      isHelpful.value = helpful;
      
      await axiosInstance.post('/rag/feedback', {
        queryId: props.queryId,
        isHelpful: helpful,
        comment: comment.value
      });
  
      showToast('Thank you for your feedback!', 'success');
      emit('feedbackSubmitted');
    } catch (error) {
      showToast('Failed to submit feedback', 'error');
    }
  };
  </script>