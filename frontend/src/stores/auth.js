import {defineStore} from 'pinia'
import router from '../router'
import ApiHandler from "../utils/ApiHandler"
import LocalDataHandler from "../utils/LocalDataHandler"
import {useUser} from './user'

export const useAuth = defineStore('main', {
    state: () => ({
        isLoggedIn: LocalDataHandler.isAuthenticated(),
        user: LocalDataHandler.getUser()
    }),
    actions: {
        async login(username, password) {
            const response = await ApiHandler.post('/login', undefined, {
                client_id: import.meta.env.VITE_CLIENT_ID,
                client_secret: import.meta.env.VITE_CLIENT_SECRET,
                grant_type: 'password',
                username,
                password
            })
            // Set logged in:
            this.isLoggedIn = true
            this.user = response.data.user

            LocalDataHandler.setAccessToken(response.data.access_token, 3600)
            LocalDataHandler.setRefreshToken(response.data.refresh_token, 3600)
        },
        async register(data) {
            try {
                await ApiHandler.post('/register', undefined, {
                    name: data.fullname,
                    email: data.email,
                    password: data.password,
                    password_confirmation: data.confirm_password
                })
                return true
            } catch (error) {
                return false
            }
        },
        signout() {
            this.isLoggedIn = false
            this.user = null
            useUser().user = null
            LocalDataHandler.removeAuthenticated()
            LocalDataHandler.removeLocalData(LocalDataHandler.KEYS.ACCESS_TOKEN)
            LocalDataHandler.destroy()
            router.push({name: 'login'})
        },
        async forgotPassword(email) {
            try {
                await ApiHandler.post('/forgot-password', undefined, {
                    email
                })
                return true
            } catch (error) {
                return false
            }
        },
        async resetPassword(token, password) {
            try {
                await ApiHandler.post('/reset-password', undefined, {
                    token,
                    password
                })
                return true
            } catch (error) {
                return false
            }
        }
    }
})
