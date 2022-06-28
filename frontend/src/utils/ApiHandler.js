import Axios from "axios";
import LocalDataHandler from "./LocalDataHandler"

const RESPONSE_TYPES = {
    STATUS_OK: 200,
    STATUS_CREATED: 201,
    STATUS_NO_CONTENT: 204,
    STATUS_UNAUTHORIZED: 401
}

class ApiHandler {
    constructor() {
        // Create the api
        this.api = Axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            }
        })
        this.source = null;
        this.apiCount = 0;
        this.isCookieDomain = false;
        this.setInterceptors(null)
    }

    static getInstance() {
        if (this.instance == null) {
            this.instance = new ApiHandler()
        }
        return this.instance
    }

    setInterceptors(store, isCookieDomain = false) {
        this.isCookieDomain = isCookieDomain;
        let onFulFilledCallback = null;
        if (!this.isCookieDomain) {
            // this.setInterceptors(store);
            onFulFilledCallback = async (config) => {
                // this.increaseApiCount();
                // don't forget to set params {noAuth: true} to skip the token check for public APIs
                if (!config.params.noAuth && !LocalDataHandler.getAccessToken() && LocalDataHandler.getRefreshToken()) {
                    await this.refreshToken();
                    // after new tokens retrieved, don't forget to set it in the headers for following API calls
                    config.headers = this.getAuthHeader();
                    return config;
                } else {
                    // Do something before request is sent
                    return config;
                }
            };
        } else {
            onFulFilledCallback = (config) => {
                // this.increaseApiCount();
                // Do something before request is sent
                return config
            };
        }
        this.addInterceptors(onFulFilledCallback.bind(this));
    }

    addInterceptors(onFullFilledCallback) {
        const self = this;
        // Add a request interceptor
        this.api.interceptors.request.use(
            onFullFilledCallback,
            function (error) {
                self.decreaseApiCount();
                // Do something with request error
                return Promise.reject(error)
            }
        );
        // Add a response interceptor
        this.api.interceptors.response.use(
            function (response) {
                // self.decreaseApiCount();
                // Do something with response data
                return response
            },
            function (error) {
                // self.decreaseApiCount();
                // Do something with response error
                return Promise.reject(error)
            }
        );
    }

    increaseApiCount() {
        this.apiCount++;
        if (this.apiCount > 0) {
            if (this.loader) {
                clearTimeout(this.loader)
            }
            this.loader = setTimeout(() => {
                store.commit('setLoading', true);
            }, 1000)
        }
    }

    decreaseApiCount() {
        this.apiCount--;
        if (this.apiCount < 1) {
            if (this.loader) {
                clearTimeout(this.loader)
            }
            store.commit('setLoading', false);
        }
    }

    async refreshToken() {
        let formData = new FormData();
        formData.append('refresh_token', LocalDataHandler.getRefreshToken());
        formData.append('grant_type', 'refresh_token');
        formData.append('client_id', import.meta.env.VITE_CLIENT_ID);
        // use native fetch to get new tokens
        let response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
            method: 'POST',
            // withCredentials: true,
            body: new URLSearchParams(formData),
        });
        const data = await response.json();
        // set up in your cookies
        LocalDataHandler.setAccessToken(data.access_token, data.expires_in);
        LocalDataHandler.setRefreshToken(data.refresh_token, 3600 * 24 * 15);
        // await store.dispatch('setAuthenticated')
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
                // tiny delay for db token saving
            }, TOKEN_SAVING_DELAY);
        })
    }

    send(method, url, headers = {}, data = {}, params = {}, responseType = undefined) {
        this.source = Axios.CancelToken.source();
        // Define the headers if they are undefined
        headers = headers !== undefined ? headers : {}
        // Create the http request and return the request
        return this.api.request({
            method: method,
            url: url,
            headers: headers !== undefined ? headers : {},
            data: data !== undefined ? data : {},
            params: params !== undefined ? params : {},
            responseType: responseType,
            cancelToken: this.source.token
        })
    }

    get(url, headers = {}, params = {}, responseType = undefined) {
        return this.send('GET', url, headers, undefined, params, responseType)
    }

    post(url, headers = {}, data = {}, params = {}, responseType = undefined) {
        return this.send('POST', url, headers, data, params, responseType)
    }

    patch(url, data = {}, headers = {}, params = {}) {
        return this.send('PATCH', url, headers, data, params)
    }

    put(url, data = {}, headers = {}, params = {}) {
        return this.send('PUT', url, headers, data, params)
    }

    delete(url, data = {}, header = {}) {
        return this.send('DELETE', url, header, data)
    }

    cancelRequest() {
        this.source.cancel('Request Cancelled.')
    }

    getAuthHeader() {
        // Check if access token is present
        if (!LocalDataHandler.getAccessToken()) return null
        return {
            Authorization: `Bearer ${LocalDataHandler.getAccessToken()}`,
            'accept-language': 'en'
        }
    }

    isSuccess(statusCode) {
        return (
            statusCode === RESPONSE_TYPES.STATUS_OK ||
            statusCode === RESPONSE_TYPES.STATUS_CREATED ||
            statusCode === RESPONSE_TYPES.STATUS_NO_CONTENT
        )
    }

    parseFormData(data) {
        let formData = new FormData()
        // get the first level of data
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (Array.isArray(data[key])) {
                    // here data[key] is an array, we need both index and value below
                    for (const [index, value] of data[key].entries()) {
                        // the value is an object, so loop through each key
                        for (const childKey in value) {
                            if (value.hasOwnProperty(childKey)) {
                                // parse the data to correct format for array of objects
                                formData.append(`${key}[${index}][${childKey}]`, value[childKey])
                            }
                        }
                    }
                } else {
                    formData.append(key, data[key])
                }
            }
        }
        return formData
    }

    parseNonArrayFormData(data) {
        let formData = new FormData()
        // get the first level of data
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (!Array.isArray(data[key])) {
                    formData.append(key, data[key])
                }
            }
        }
        return formData
    }
}

export default ApiHandler.getInstance()
