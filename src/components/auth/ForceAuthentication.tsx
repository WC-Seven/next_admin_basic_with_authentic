import Head from 'next/head'
import Image from 'next/image'
import router from 'next/router'
import loadingGif from '../../../public/images/loading.gif'
import useAuth from '../../data/hook/useAuth'

export default function ForceAuthentication(props) {

    const { user, loading } = useAuth()

    function renderContent() {
        return (
            <>
                <Head>
                    <script
                        // validando se realmente o usuário está logado, caso não. Redirecionar ele para o login.
                        dangerouslySetInnerHTML={{
                            __html: `
                                if(!document.cookie?.includes("admin-fut7-auth")) {
                                    window.location.href = "/autenticacao"
                                }
                            `
                        }}
                    />
                </Head>
                {props.children}
            </>
        )
    }

    function renderLoading() {
        return (
            <div className={`
                flex justify-center items-center h-screen
            `}>
                <Image src={loadingGif}  alt=""/>
            </div>
        )
    }

    if(!loading && user?.email) {
        return renderContent()
    } else if(loading) {
        return renderLoading()
    } else {
        router.push('/autenticacao')
        return null
    }
}
