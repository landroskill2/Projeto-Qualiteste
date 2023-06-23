import { useAuth } from "./useAuth"


type Props = {
    roleRequired: string,
    children? : React.ReactNode
}

const WithPermission = ({roleRequired, children}: Props) => {
    const account = useAuth()
    return (
        <>
            {roleRequired === account?.role && children}
        </>
    )
}
export default WithPermission