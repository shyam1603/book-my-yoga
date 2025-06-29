import Navbar from '@/components/ui/Navbar'
import React from 'react'

function layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <div>
                {children}
            </div>
        </div>
    )
}

export default layout