<script setup>
import { ref } from 'vue';
import { useFirebase } from '@/composables/useFirebase';
import { useRoute } from 'vue-router';
import { collection, addDoc } from 'firebase/firestore';

// Firebase setup
const { db } = useFirebase();

// Form state and variables
const formData = ref({
  email: '',
  formIsSubmitting: false,
});

const formIsValid = ref(false);
const justSubmitted = ref(false);
const ctaText = ref("Submit");

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
      formData.value.email = ""; // Clear email field
      formIsValid.value = false; // Reset form validation
    } catch (e) {
      console.error("Error saving subscription: ", e);
    } finally {
      formData.value.formIsSubmitting = false;
    }
  }
}
</script>

<template>
  <form @submit.prevent="subscribe" class="relative">
    <div class="flex flex-col space-y-6">
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
      />
    </div>

    <div class="mt-8 flex justify-center lg:justify-start">
      <button
        class="cta"
        @click.prevent="subscribe"
        :disabled="!formIsValid || formData.formIsSubmitting"
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
