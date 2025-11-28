<script setup>
import { ref, onMounted } from 'vue';
import { useFirebase } from '@/composables/useFirebase';
import { useRoute } from 'vue-router';
import { collection, addDoc } from 'firebase/firestore';

// Firebase setup
const { db } = useFirebase();

// Form state and variables
const formData = ref({
  email: localStorage.getItem('newsletterEmail') || '',
  formIsSubmitting: false,
});

const formIsValid = ref(false);
const justSubmitted = ref(localStorage.getItem('newsletterJustSubmitted') === 'true');
const ctaText = ref(justSubmitted.value ? "You are a subscriber" : "Submit");

// Route information for logging
const route = useRoute();

// Function to validate the form
const checkFormValidity = () => {
  formIsValid.value = /\S+@\S+\.\S+/.test(formData.value.email);
};

// Function to handle subscription
async function subscribe() {
  if (formIsValid.value && !formData.value.formIsSubmitting) {
    formData.value.formIsSubmitting = true;

    const formDataToSend = {
      email: formData.value.email,
      pageSlug: route.fullPath,
      timestamp: new Date().toISOString(),
    };

    try {
      // Add form data to Firestore
      await addDoc(collection(db, "newsletter-subscription"), formDataToSend);
      justSubmitted.value = true;
      ctaText.value = "You are a subscriber";
      localStorage.setItem('newsletterEmail', formData.value.email);
      localStorage.setItem('newsletterJustSubmitted', 'true');
      formData.value.email = ""; // Clear email field
      formIsValid.value = false; // Reset form validation
    } catch (e) {
      console.error("Error saving subscription: ", e);
    } finally {
      formData.value.formIsSubmitting = false;
    }
  }
}

// Restore form state on mounted
onMounted(() => {
  if (justSubmitted.value) {
    formIsValid.value = false;
  } else {
    checkFormValidity();
  }
});
</script>

<template>
  <form @submit.prevent="subscribe" class="relative">
    <div class="flex flex-col space-y-6" :class="{ 'disabled-form': justSubmitted }">
      <div class="flex items-center justify-center space-x-1 lg:justify-start">
        <h4 class="font-display text-xl">Sign up for our newsletter</h4>
      </div>
      <input
        v-model="formData.email"
        type="email"
        placeholder="Enter your email here"
        class="rounded-lg border bg-transparent px-6 py-4 transition-all focus:outline-none"
        required
        @input="checkFormValidity"
        :readonly="justSubmitted"
      />
    </div>

    <div class="mt-8 flex justify-center lg:justify-start">
      <button
        class="cta"
        @click.prevent="subscribe"
        :disabled="!formIsValid || formData.formIsSubmitting || justSubmitted"
      >
        {{ ctaText }}
      </button>
    </div>

    <Transition name="fade">
      <div
        v-if="justSubmitted"
        class="bottom-0 absolute left-0 translate-y-full text-lg"
      >
        Thank you for subscribing!
      </div>
    </Transition>
  </form>
</template>

<style scoped>
.disabled-form {
  opacity: 0.6;
  pointer-events: none;
}

.cta {
  padding: 0.75rem 2rem;
  background-color: #1a202c;
  color: #fff;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease;
}

.cta:disabled {
  background-color: #718096;
  cursor: not-allowed;
}

input:readonly {
  background-color: #e2e8f0;
}
</style>
