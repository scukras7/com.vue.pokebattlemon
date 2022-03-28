import axios from 'axios'

class HttpService {

    constructor () {
        this.baseUrlRest = `${process.env.VUE_APP_REST_API_HOST}:${process.env.VUE_APP_REST_API_PORT}`
        this.baseUrlGraphQL = `${process.env.VUE_APP_GRAPHQL_HOST}:${process.env.VUE_APP_GRAPHQL_PORT}/graphql`
        this.baseFileserverRest = `${process.env.VUE_APP_FILESERVER_REST_API_HOST}:${process.env.VUE_APP_FILESERVER_REST_API_PORT}`
    }

    get (url) {
        return axios.get(this.baseUrlRest + url)
    }

    post (url, body) {
        return axios.post(this.baseUrlRest + url, body)
    }

    fileserverGet (url) {
        return axios.get(this.baseFileserverRest + url)
    }

    fileserverPost (url, body) {
        return axios.post(this.baseFileserverRest + url, body)
    }

    graphql (query, variables) {
        if (variables) {
            const bodyVars = {
                query,
                variables
            }
            return axios.post(this.baseUrlGraphQL, bodyVars)
        }
        return axios.post(this.baseUrlGraphQL, query)
    }

}

export default new HttpService();