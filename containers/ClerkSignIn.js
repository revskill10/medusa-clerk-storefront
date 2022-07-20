import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { client } from "../lib/client";

const ClerkSignedIn = ({ children }) => {
    const auth = useAuth()
    useEffect(() => {
        if (auth.isSignedIn) {
            client.post('/store/clerk/auth', {}, {
                withCredentials: true
            })
            .then(console.log)
            .catch(console.log)
        }
    }, [])
    return children
}

export default ClerkSignedIn