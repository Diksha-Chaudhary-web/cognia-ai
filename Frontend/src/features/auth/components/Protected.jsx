import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'


const Protected = ({ children }) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    if (loading) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
                <div className="rounded-2xl border border-[#31b8c6]/30 bg-zinc-900/70 px-6 py-4 text-sm text-zinc-300 shadow-xl">
                    Checking your session...
                </div>
            </section>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }


    return children
}

export default Protected
