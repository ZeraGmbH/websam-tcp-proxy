declare module 'ipc' {
    interface IConfigRequest {
        type: 'config-request'
    }

    interface IConfigResponse {
        configName: string
        type: 'config-response'
    }

    type TRequest = IConfigRequest

    type TRequestType = TRequest['type']

    type TResponse = IConfigResponse

    type TResponseType = TResponse['type']

    type TTypedRequest<T extends TRequestType> = TRequest & { type: T }

    type TTypedResponse<T extends TResponseType> = TResponse & { type: T }
}
