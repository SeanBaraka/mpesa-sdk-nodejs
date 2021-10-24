import  axios from 'axios'

export class MpesaApi {
    constructor(consumerKey: string, secret: string, shortcode: string, env: string = 'dev') {
        this.consumerKey = consumerKey
        this.secret = secret
        this.shortcode = shortcode
        if (env !== 'production') {
            this.url = 'https://sandbox.safaricom.co.ke'
        } else {
            this.url = 'https://api.safaricom.co.ke'
        }
        axios.defaults.baseURL = this.url;
    }

    private consumerKey: string;
    private secret: string;
    private shortcode: string;
    private url: string;

    /**
     * getAccessToken
     */
    public async getAccessToken() {
        const authKey = Buffer.from(`${this.consumerKey}:${this.secret}`).toString('base64');
        // console.log(axios.defaults.url)
        const request = await axios.get('/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${authKey}`
            }
        })
        return Promise.resolve(request.data)

    }
}