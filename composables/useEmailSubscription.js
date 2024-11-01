// composables/useEmailSubscription.js
import { ref } from 'vue';

export function useEmailSubscription() {
    const formData = ref({
        email: '',
        formIsSubmitting: false,
    });

    const formIsValid = ref(false);

    const checkFormValidity = () => {
        formIsValid.value = /\S+@\S+\.\S+/.test(formData.value.email);
    };

    return {
        formData,
        formIsValid,
        checkFormValidity,
    };
}
