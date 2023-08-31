import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./useAuth"

interface Params {
    allowedRoles: string[]
}

export const RequireRole = ({ allowedRoles }: Params) => {
    const account = useAuth()
    const isAllowed: Boolean = !!allowedRoles?.find(
        role => account?.role === role
    )
    return isAllowed ? (
        <Outlet />
    ) : (
        <Navigate to="/unauthorized" state={{from: location}} />
    )
}