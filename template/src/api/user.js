import { apiPost } from '@/utils/http'

export function login(params) {
  return apiPost('/user/login', { params })
}

export function logout() {
  return apiPost('/user/logout')
}
