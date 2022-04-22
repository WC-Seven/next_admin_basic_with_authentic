/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import useAuth from '../../data/hook/useAuth'

interface AvatarUserProps {
    className?: string
}

export default function AvatarUser(props: AvatarUserProps) {
    const { user } = useAuth()
    return (
        <Link href="/perfil" passHref>
            <img
                src={user?.imagemUrl ?? '/images/avatar.svg'}
                alt="Avatar do Usuário"
                className={`
                    h-10 w-10 rounded-full cursor-pointer
                    ${props.className}
                `}
            />
        </Link>
    )
}
