import axios from 'axios'

class HttpService {

    constructor () {
        this.baseUrlRest = `${process.env.VUE_APP_REST_API_HOST}:${process.env.VUE_APP_REST_API_PORT}`
        this.baseUrlGraphQL = `${process.env.VUE_APP_GRAPHQL_HOST}:${process.env.VUE_APP_GRAPHQL_PORT}/graphql`
    }

    /*
    get (url) {
        return axios.get(url)
    }

    post (url, body) {
        return axios.post(url, body)
    }
    */

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