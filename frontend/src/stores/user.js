import {defineStore} from 'pinia'
import {useAuth} from './auth'
import ApiHandler from "../utils/ApiHandler"

export const useUser = defineStore('user', {
    state: () => ({
        user: null,
        loading: false
    }),
    actions: {
        setLoading(loading) {
            this.loading = loading
        },
        async getUser() {
            try {
                const {data} = await ApiHandler.get('/users/me', ApiHandler.getAuthHeader())
                this.user = data // FIX: For whatever reason the user data is being stored and used in/from both the user and auth state
                useAuth().user = data
                return true
            } catch (error) {
                return false
            }
        },
        async updateUser(firstName, lastName, email) {
            try {
                await ApiHandler.patch('/users', {
                    firstName,
                    lastName,
                    email
                }, ApiHandler.getAuthHeader())
                return true
            } catch (error) {
                if (error.response.data.error) {
                    return {error: error.response.data.error}
                }
                return false
            }
        },
        async changePassword(currentPassword, password, passwordConfirm) {
            try {
                await ApiHandler.patch('/users/password', {
                    currentPassword,
                    password,
                    password_confirmation: passwordConfirm
                }, ApiHandler.getAuthHeader())
                return true
            } catch (error) {
                if (error.response.data.error) {
                    return {error: error.response.data.error}
                }
                return false
            }
        },
    }
})
