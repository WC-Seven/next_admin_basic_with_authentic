import { createContext, useEffect, useState } from "react";

// type theme = 'dark' | ''

interface AppContextProps {
    theme?: string
    toggleTheme?: () => void
}

const AppContext = createContext<AppContextProps>({})

export function AppProvider(props) {
    const [theme, setTheme] = useState('dark')

    function toggleTheme() {
        const newTheme = theme === '' ? 'dark' : ''
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    useEffect(() => {
        const themeSave = localStorage.getItem('theme')
        setTheme(themeSave)
    }, [])

    return (
        <AppContext.Provider value={{
            theme,
            toggleTheme
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContext
