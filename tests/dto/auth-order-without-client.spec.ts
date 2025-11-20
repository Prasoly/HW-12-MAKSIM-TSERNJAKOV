import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDTO } from './LoginDTO'
import { OrderDTO } from './OrderDTO';

const BASE_URL = 'https://backend.tallinn-learning.ee'

test('Auth and create order without api client', async ({ request }) => {
  const authResponse = await request.post(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithCorrectData(),
  })
  expect(authResponse.status()).toBe(StatusCodes.OK)
  const jwt = await authResponse.text()

  const createOrder = await request.post(`${BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${jwt}` },
    data: OrderDTO.createOrderWithRandomData(),
  })
  expect(createOrder.status()).toBe(StatusCodes.OK)

  const order = await createOrder.json()
  expect(order.id).toBeGreaterThan(0)
})

test('Auth and get orders without api client', async ({ request }) => {
  const authResponse = await request.post(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithCorrectData(),
  })
  expect(authResponse.status()).toBe(StatusCodes.OK)
  const jwt = await authResponse.text()

  const createOrder = await request.post(`${BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${jwt}` },
    data: OrderDTO.createOrderWithRandomData(),
  })
  expect(createOrder.status()).toBe(StatusCodes.OK)
  const created = await createOrder.json()

  const getOrderId = await request.get(`${BASE_URL}/orders/${created.id}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  })
  expect(getOrderId.status()).toBe(StatusCodes.OK)

  const order = await getOrderId.json()
  expect(order.id).toBe(created.id)
})

test('Auth and delete order by id without api client', async ({ request }) => {
  const authResponse = await request.post(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithCorrectData(),
  })
  expect(authResponse.status()).toBe(StatusCodes.OK)
  const jwt = await authResponse.text()

  const createOrder = await request.post(`${BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${jwt}` },
    data: OrderDTO.createOrderWithRandomData(),
  })
  expect(createOrder.status()).toBe(StatusCodes.OK)
  const created = await createOrder.json()
  expect(created.id).toBeGreaterThan(0)

  const deleteOrder = await request.delete(`${BASE_URL}/orders/${created.id}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  })
  expect(deleteOrder.status()).toBe(StatusCodes.OK)

  const getAfterDelete = await request.get(`${BASE_URL}/orders/${created.id}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  })
  expect(getAfterDelete.status()).toBe(StatusCodes.OK)

  const bodyText = await getAfterDelete.text()
  expect(bodyText).toContain('')
})