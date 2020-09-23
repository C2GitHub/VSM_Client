import Config from './config'

const TokenKey = 'Token'

export function getToken() {
  return Config.get(TokenKey)
}

export function setToken(token) {
  return Config.set(TokenKey, token)
}

export function removeToken() {
  return Config.remove(TokenKey)
}
