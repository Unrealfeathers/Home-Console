import { ref } from 'vue'
import { defineStore } from 'pinia'

interface Token {
  access_token: string
  token_type: string
}

export const useTokenStore = defineStore(
  'token',
  () => {
    const token = ref<Token>({ access_token: '', token_type: '' })
    const setToken = (newToken: Token) => {
      token.value.access_token = newToken.access_token
      token.value.token_type = newToken.token_type
    }
    const removeToken = () => {
      token.value.access_token = ''
      token.value.token_type = ''
    }
    return {
      token,
      setToken,
      removeToken,
    }
  },
  {
    persist: true,
  },
)
