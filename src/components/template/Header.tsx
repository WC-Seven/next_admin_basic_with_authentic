import Title from './Title'
import ToggleThemeButton from './ToggleThemeButton'
import useAppData from '../../data/hook/useAppData'
import AvatarUser from './AvatarUser'

interface HeaderProps {
    title: string
    subtitle: string
}

export default function Header(props: HeaderProps) {
    const { theme, toggleTheme } = useAppData()

    return (
        <div className={`flex`}>
            <Title title={props.title} subtitle={props.subtitle} />
            <div className={`flex flex-grow justify-end items-center`}>
                <ToggleThemeButton theme={theme} toggleTheme={toggleTheme} />
                <AvatarUser className="ml-3" />
            </div>
        </div>
    )
}
