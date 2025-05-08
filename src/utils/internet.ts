import { Logger } from "../main"

async function sendRequest(url: string, json: any = null, method: string = 'GET'): Promise<Response> {
  Logger.info('Calling ' + method, url)
  if(!url){
    Logger.error('Aborting call to null url! ' + method, url)
    return;
  }
  let response = null
  let params = null

  if (method == 'POST' || method == 'PUT') {
    params = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(json)
    }
  }

  response = await fetch(url, params)
  Logger.info('Status', response.status)
  Logger.info('StatusText', response.statusText)

  if (response.status == 500) {
    throw new Error(response.statusText)
  }

  return response
}

export function POST(url: string, json: any = null): Promise<Response> {
  console.log('POST url', url)
  console.log('POST json', json)
  return sendRequest(url, json, 'POST')
}

export function PUT(url: string, json: any): Promise<Response> {
  return sendRequest(url, json, 'PUT')
}

export function GET(url: string): Promise<Response> {
  return sendRequest(url)
}
