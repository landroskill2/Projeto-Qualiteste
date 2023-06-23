import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "./useAuth"


export const RequireAuth = () => {
    const location = useLocation()
    const account = useAuth()

    return account ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{from: location}} replace />
    )
}