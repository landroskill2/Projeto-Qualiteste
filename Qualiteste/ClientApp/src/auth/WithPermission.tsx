import { useAuth } from "./useAuth"


type Props = {
    allowedRoles: string[],
    children? : React.ReactNode
}

const WithPermission = ({allowedRoles, children}: Props) => {
    const account = useAuth()
    const isAllowed: Boolean = !!allowedRoles?.find(
        role => account?.role === role
    )
    return (
        <>
            {isAllowed && children}
        </>
    )
}
export default WithPermission