import { useToast } from "@chakra-ui/react"


export const useGlobalToast = () => {
    const toast = useToast()

    const addToast = ({
        id,
        title,
        description,
        status,
    } : {
        id?: string,
        title: string,
        description: string,
        status: "success" | "error"
    }) => {
        toast({
            id: id ?? "toast",
            title: title,
            description: description,
            status: status,
            position: "bottom",
            isClosable: true,
            duration: 5000,
        })
    }
    const isToastActive = (toaster: string) => toast.isActive(toaster)
    return { addToast, isToastActive }
}