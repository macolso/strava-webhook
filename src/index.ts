import { HandleRequest, HttpRequest, HttpResponse, Router, Config} from "@fermyon/spin-sdk"

let router = Router()

function handleSubscription(request: HttpRequest): HttpResponse {
    let uri = request.uri.replace("/webhook?", "")
    let params = new URLSearchParams(uri)
    let mode = params.get('hub.mode')
    let token = params.get('hub.verify_token')
    let challenge = params.get('hub.challenge')

    if (mode && token) {
    // Verifies that the mode and token sent are valid
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {     
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      return {
        status: 200,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "hub.challenge": challenge
        })
      } 
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      return {
        status: 403
      }     
    }
  }

    return {
        status: 200
    }
}

router.get("/webhook", (_, request) => {
    return handleSubscription(request)
})

router.post("/webhook", (_, request) => {
    console.log("webhook received", request)
    
    return  {
        status: 200,
        body: "EVENT_RECEIVED"
    }
})

router.get("/", () => {
    return {
        status: "200",
        body: "Nothing to see here it is just a webhook app"
    }
})

export const handleRequest: HandleRequest = async function(request: HttpRequest): Promise<HttpResponse> {
  const VERIFY_TOKEN = config_get("verify_token")
  return await router.handleRequest(request,request)
}