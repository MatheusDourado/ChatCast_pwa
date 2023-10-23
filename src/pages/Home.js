import Footer from "../components/Footer/Footer"
import Main from "../components/Main/Main"
import ParticleCanvas from "../components/Particles/Particles"
import { ChatProvider } from "../context/ChatContext"

export default function Home() {
    return (
        <ChatProvider>
            <ParticleCanvas></ParticleCanvas>
            <section className="h-screen flex flex-col items-center justify-center">
                <Main />
                <Footer />
            </section>
        </ChatProvider>
    )
}