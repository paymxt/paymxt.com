// useFirebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRuntimeConfig } from "#imports";

let firebaseApp;

export function useFirebase() {
    const config = useRuntimeConfig();

    if (!firebaseApp) {
        firebaseApp = initializeApp({
            apiKey: config.public.firebaseApiKey,
            authDomain: config.public.firebaseAuthDomain,
            projectId: config.public.firebaseProjectId,
            storageBucket: config.public.firebaseStorageBucket,
            messagingSenderId: config.public.firebaseMessagingSenderId,
            appId: config.public.firebaseAppId,
        });
    }

    const db = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);

    return { app: firebaseApp, db, auth };
}
