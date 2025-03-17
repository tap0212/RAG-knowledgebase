<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isRegister ? 'Create an account' : 'Sign in to your account' }}
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <input
              v-model="email"
              type="email"
              required
              class="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg transition duration-200 ease-in-out"
              placeholder="Email address"
            />
          </div>
          <div>
            <input
              v-model="password"
              type="password"
              required
              class="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg transition duration-200 ease-in-out"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
          >
            {{ loading ? 'Processing...' : (isRegister ? 'Register' : 'Sign in') }}
          </button>
        </div>

        <div class="text-center">
          <button
            type="button"
            @click="isRegister = !isRegister"
            class="text-indigo-600 hover:text-indigo-500 transition duration-200 ease-in-out"
          >
            {{ isRegister ? 'Already have an account? Sign in' : 'Need an account? Register' }}
          </button>
        </div>

        <div v-if="error" class="text-red-500 text-center mt-2">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/utils/axios-interceptor';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const { showToast } = useToast();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const isRegister = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  try {
    const endpoint = isRegister.value ? '/register' : '/login';
    const response = await api.post(`/auth${endpoint}`, {
      email: email.value,
      password: password.value,
    });

    // Store the token
    localStorage.setItem('token', response.data.access_token);
    
    // Show success message
    showToast(
      `Successfully ${isRegister.value ? 'registered' : 'logged in'}!`,
      'success'
    );

    // Redirect to dashboard
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Authentication failed. Please try again.';
    showToast(error.value, 'error');
  } finally {
    loading.value = false;
  }
};
</script> 