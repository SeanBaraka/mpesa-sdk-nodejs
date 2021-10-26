import  axios from 'axios'
import internal from 'stream'

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

    private token: string = '';

    /**
     * getAccessToken
     * @returns a promise with the access token and success message.
     */
    public async getAccessToken() {
        const authKey = Buffer.from(`${this.consumerKey}:${this.secret}`).toString('base64');
        // console.log(axios.defaults.url)
        const request = await axios.get('/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${authKey}`
            }
        })
        if (request.status == 200) {
            const data: any = request.data
            const { access_token } = data;
            this.token =  access_token;
        }
        return Promise.resolve(request.data)
    }

    /**
     * registerUrl
     * Registers the confirmation and validation urls
     * @param confirmationUrl - the receives the confirmation request from the API upon the 
     * payment completion
     * @param validationUrl - receives the validation request from the API upon the payment
     * submission. It is called only if the external validation on the registered shortcode is 
     * enabled.By default the external validation is disabled
     * @param responseType - specifies what is to happen if for any reason the validation url is not 
     * reachable. It can only have two options 'Completed' or 'Cancelled'. Completed means Mpesa
     * will automatically complete the transaction whereas cancelled means the transaction will be cancelled if the validation url is not reachable
     * @returns a promise that contains the OriginatorConversationId, ConversationId and Response Description.
     */
    public async registerUrl(confirmationUrl: string, validationUrl: string, responseType: string = 'Completed') {
        const requestData = {
            "ShortCode": this.shortcode,
            "ResponseType": responseType,
            "ConfirmationURL": confirmationUrl,
            "ValidationURL": validationUrl
        }
        const token = this.token;
        const registerRequest = await axios.post('/mpesa/c2b/v1/registerurl', requestData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        
        return Promise.resolve(registerRequest.data);
    }

    /**
     * c2B - Make payment requests from Client to Business
     * @param commandId - the unique identifier of the transaction type. Can either be CustomerPayBillOnline for paybill payments or CustomerBuyGoodsOnline for business shortcodes
     * @param amount - The amount being transacted
     * @param Msisdn - The phone number initiating the transaction
     * @param BillRefNumber - Only used for CustomerPayBillOnline. It represents a unique bill identifier e.g. an account number
     * @returns - a promise which contains originatorConversationId, conversationId and ResponseDescription
     */
    public async c2B(commandId: string, amount: number, Msisdn: string, BillRefNumber?: string) {
        const requestData = {
            "ShortCode": this.shortcode,
            "CommandID": commandId,
            "Amount": amount,
            "Msisdn": Msisdn,
            "BillRefNumber": commandId == 'CustomerPayBillOnline' ? BillRefNumber : " "
        }
        const request = await axios.post('/mpesa/c2b/v1/simulate', requestData, {
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Content-Type": "application/json"
            }
        })

        return Promise.resolve(request.data);
    }
}