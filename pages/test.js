import { useMeCustomer, useCustomerOrders } from "medusa-react"

const Main = () => {
    const {
        customer,
        isLoading: retrievingCustomer,
        refetch,
        error
    } = useMeCustomer({ onError: () => {} })

    if (retrievingCustomer) return <div>...</div>
    if (!customer) return <div>{error.message}</div>
    return (
        <div>
            {customer.email}
        </div>
    )
}

export default Main