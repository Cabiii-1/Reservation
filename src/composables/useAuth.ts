import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { computed } from 'vue'

export interface User {
  id: number
  name: string
  role: string
}

async function fetchCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem('token')
  if (!token) return null

  const { data } = await axios.get('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return data
}

export function useAuth() {
  const query = useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 mins
    retry: false,
  })

  const isAuthenticated = computed(() => !!query.data.value)
  const userRole = computed(() => query.data.value?.role ?? null)

  return {
    ...query,
    isAuthenticated,
    userRole,
  }
}
