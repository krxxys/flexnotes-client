//todo!
// move login function -> return status and errrors
// create register function -> return status and errrors
import axios from 'axios'
import { api } from './http'
const register = async ({ username, email, password }) => {
  return axios
    .post('http://127.0.0.1:3001/auth/register', {
      username: username,
      email: email,
      password: password,
    })
    .then((res) => {
      if (res.status == 200) {
        console.log(res.data)
        return {
          status: true,
          message: 'Register success',
          username: res.data.username,
          access_token: res.data.access_token,
          refresh_token: res.data.refresh_token,
        }
      }
    })
    .catch((err) => {
      return { status: false, message: err.response?.data?.error || err.response.status }
    })
}

const login = async ({ username, password, remember_me }) => {
  return axios
    .post('http://127.0.0.1:3001/auth/login', {
      username: String(username),
      password: String(password),
    })
    .then((res) => {
      if (res.status == 200) {
        return {
          status: true,
          message: 'Login success',
          username: res.data.username,
          access_token: res.data.access_token,
          refresh_token: res.data.refresh_token,
        }
      } 
    })
    .catch((err) => {
      console.log(err)
      return { status: false, message: err.status }
    })
}

export { register, login }
