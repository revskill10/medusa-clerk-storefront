import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { baseURL } from '../lib/baseURL'
import { MEDUSA_BACKEND_URL, queryClient } from "../lib/config"
import { MedusaProvider } from 'medusa-react'

function useFetch() {
    const { getToken } = useAuth();
    const authenticatedFetch = async (...args) => {
        return fetch(...args, {
            headers: { Authorization: `Bearer ${await getToken()}` },
            mode: 'cors',
            credentials: 'include'
        }).then(res => res.json());
    };
    return authenticatedFetch;
}
const ClerkSignedIn = ({ children }) => {
    const auth = useAuth()
    const fetch = useFetch()
    useEffect(() => {
        if (auth.isSignedIn) {
            fetch(`${baseURL}/store/clerk/auth`)
                .then(console.log)
                .catch(console.log)
        }
    }, [])
    return (
        <MedusaProvider
            baseUrl={MEDUSA_BACKEND_URL}
            queryClientProviderProps={{
                client: queryClient,
            }}
        >
            {auth.isSignedIn ? children : null}
        </MedusaProvider>
    )
}

export default ClerkSignedIn