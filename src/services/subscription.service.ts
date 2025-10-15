import type { APIResponse } from '.'
import { baseUrl } from '.';

export type SubscriptionStatus = 'SUBSCRIBED' | 'UNSUBSCRIBED' | 'UNSUPPORTED' | 'PENDING';

export const statusProps = {
  SUBSCRIBED: { text: 'รับการแจ้งเตือน', class: 'bg-green-100 text-green-800' },
  UNSUBSCRIBED: { text: 'ไม่รับการแจ้งเตือน', class: 'bg-red-100 text-red-800' },
  UNSUPPORTED: { text: 'อุปกรณ์ไม่รองรับ', class: 'bg-yellow-100 text-yellow-800' },
  PENDING: { text: 'กำลังตรวจสอบ...', class: 'bg-gray-100 text-gray-800' },
}

// Standard post request
const post = ( url: string, body: object ) => {
  let options: {
    method: string;
    headers: { 'Content-Type': string };
    body?: string;
  } = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }

  if (body) options = { ...options, body: JSON.stringify(body) }
  return fetch(url, options)
}

// Fetch public key from server
export const getPublicKey = async (): Promise<string> => {
  const response = await fetch(`${baseUrl}/vapid-public-key`)
  const { publicKey } = await response.json()
  return publicKey
}

// Post subscription to server
export const postSubscription = async (subscription: PushSubscription): Promise<APIResponse<undefined>> => {
  const response = await post(`${baseUrl}/subscribe`, subscription)
  return response.json()
}

 // Post unsubscription from server
export const postUnsubscription = async (endpoint: string): Promise<APIResponse<undefined>> => {
  const response = await post(`${baseUrl}/unsubscribe`, { endpoint })
  return response.json()
}