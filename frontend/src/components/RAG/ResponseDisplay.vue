<template>
  <div class="bg-white shadow-md rounded-lg p-6 mt-4">
    <div v-if="response" class="prose max-w-none">
      <h3 class="text-xl font-semibold mb-4 text-gray-800">Response:</h3>
      <p class="whitespace-pre-wrap text-gray-700 leading-relaxed">{{ response.answer }}</p>
      
      <div v-if="response.sources?.length" class="mt-6">
        <h4 class="text-lg font-semibold mb-3 text-gray-800">Sources:</h4>
        <ul class="list-disc pl-5 space-y-2">
          <li v-for="source in response.sources" :key="source.id" class="text-sm text-gray-600 hover:text-gray-800">
            <span class="font-medium">{{ source.filename }}</span> - {{ source.content.substring(0, 100) }}...
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  response: {
    type: Object,
    required: true
  }
});
</script>