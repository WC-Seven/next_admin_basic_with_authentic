import route from 'next/router'
import { createContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import firebase from '../../firebase/config'
import User from '../../model/User'

interface AuthContextProps {
    user?: User
    loading?: boolean
    register?: (email: string, pass: string) => Promise<void>
    login?: (email: string, pass: string) => Promise<void>
    loginGoogle?: () => Promise<void>
    logout?: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({})

async function normalizedUser(userFirebase: firebase.User): Promise<User> {
    const token = await userFirebase.getIdToken()
    return {
        uid: userFirebase.uid,
        nome: userFirebase.displayName,
        email: userFirebase.email,
        token,
        provedor: userFirebase.providerData[0].providerId,
        imagemUrl: userFirebase.photoURL
    }
}

function cookieManagement(logged: boolean) {
    if (logged) {
        Cookies.set('admin-fut7-auth', logged, {
            expires: 7
        })
    } else {
        Cookies.remove('admin-fut7-auth')
    }
}

export function AuthProvider(props) {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User>(null)

    async function configureSession(userFirebase) {
        if (userFirebase?.email) {
            const user = await normalizedUser(userFirebase)
            setUser(user)
            cookieManagement(true)
            setLoading(false)
            return user.email
        } else {
            setUser(null)
            cookieManagement(false)
            setLoading(false)
            return false
        }
    }

    async function login(email, pass) {
        try {
            setLoading(true)
            const resp = await firebase.auth()
                .signInWithEmailAndPassword(email, pass)

            await configureSession(resp.user)
            route.push('/')
        } finally {
            setLoading(false)
        }
    }

    async function register(email, pass) {
        try {
            setLoading(true)
            const resp = await firebase.auth()
                .createUserWithEmailAndPassword(email, pass)

            await configureSession(resp.user)
            route.push('/')
        } finally {
            setLoading(false)
        }
    }

    async function loginGoogle() {
        try {
            setLoading(true)
            const resp = await firebase.auth().signInWithPopup(
                new firebase.auth.GoogleAuthProvider()
            )

            await configureSession(resp.user)
            route.push('/')
        } finally {
            setLoading(false)
        }
    }

    async function logout() {
        try {
            setLoading(true)
            await firebase.auth().signOut()
            await configureSession(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (Cookies.get('admin-fut7-auth')) {
            const cancel = firebase.auth().onIdTokenChanged(configureSession)
            return () => cancel()
        } else {
            setLoading(false)
        }
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            loginGoogle,
            logout
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}


export default AuthContext
