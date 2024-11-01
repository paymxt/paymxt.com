<script setup>
import { ref } from 'vue';
import { useFirebase } from '@/composables/useFirebase';
import { useRoute } from 'vue-router';
import { collection, addDoc } from 'firebase/firestore';

// Form state and variables
const formData = ref({
  name: '',
  email: '',
  message: '',
  formIsSubmitting: false,
});

const formIsValid = ref(false);
const justSubmitted = ref(false);

// Firebase setup
const { db } = useFirebase();
const route = useRoute(); // Capturing current route for additional context if needed

// Function to validate the form
const checkFormValidity = () => {
  // Ensuring form fields are not empty
  formIsValid.value =
    formData.value.name.trim() !== '' &&
    /\S+@\S+\.\S+/.test(formData.value.email) &&
    formData.value.message.trim() !== '';
};

// Function to submit the contact form
async function submit() {
  if (formIsValid.value && !formData.value.formIsSubmitting) {
    formData.value.formIsSubmitting = true;

    const formDataToSend = {
      name: formData.value.name,
      email: formData.value.email,
      message: formData.value.message,
      pageSlug: route.fullPath,
      timestamp: new Date().toISOString(),
    };

    try {
      // Add form data to Firestore 'contact-form' collection
      await addDoc(collection(db, 'contact-form'), formDataToSend);
      justSubmitted.value = true;

      // Clear form data after successful submission
      formData.value.name = '';
      formData.value.email = '';
      formData.value.message = '';
      formIsValid.value = false; // Reset form validation
    } catch (e) {
      console.error('Error submitting contact form: ', e);
    } finally {
      formData.value.formIsSubmitting = false;
    }
  }
}
</script>

<template>
  <form @submit.prevent="submit" class="relative">
    <div class="flex flex-col space-y-6">
      <div class="flex items-center justify-center space-x-1 lg:justify-start">
        <h4 class="font-display text-xl">Leave us a message</h4>
      </div>
      <input
        v-model="formData.name"
        type="text"
        placeholder="Your name"
        class="rounded-lg border bg-transparent px-6 py-4 transition-all focus:outline-none"
        required
        @input="checkFormValidity"
      />
      <input
        v-model="formData.email"
        type="email"
        placeholder="Your email"
        class="rounded-lg border bg-transparent px-6 py-4 transition-all focus:outline-none"
        required
        @input="checkFormValidity"
      />
      <textarea
        v-model="formData.message"
        name="message"
        placeholder="Your message"
        class="resize-none rounded-lg border bg-transparent px-6 py-4 transition-all focus:outline-none"
        required
        @input="checkFormValidity"
      ></textarea>
    </div>

    <div class="mt-8 flex justify-center lg:justify-start">
      <button
        class="cta"
        @click.prevent="submit"
        :disabled="!formIsValid || formData.formIsSubmitting"
      >
        {{ justSubmitted ? 'Thank you for your message!' : 'Submit' }}
      </button>
    </div>

    <Transition name="fade">
      <div
        v-if="justSubmitted"
        class="bottom-0 absolute left-0 translate-y-full text-lg"
      >
        Thank you for your message!
      </div>
    </Transition>
  </form>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
