import { Container, Heading, Table } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { SubscriptionData } from "../types"
import { sdk } from "../../../lib/client"

const listSubscriptionById = async (id: string) => {
  const res = await sdk.admin.subscription.retrieveById(id)
  return res
}

export const SubscriptionPage = () => {
  const { id } = useParams()

  const [subscription, setSubscription] = useState<
    SubscriptionData | undefined
  >()

  useEffect(() => {
    listSubscriptionById(id as string).then((res) => setSubscription(res))
  }, [id])

  return (
    <Container>
      {subscription && (
        <>
          <Heading level="h1">
            Orders of Subscription #{subscription.id}
          </Heading>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>View Order</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {subscription.orders?.map((order) => (
                <Table.Row key={order.id}>
                  <Table.Cell>{order.id}</Table.Cell>
                  <Table.Cell>
                    {new Date(order.created_at).toDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/orders/${order.id}`}>View Order</Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      )}
    </Container>
  )
}
