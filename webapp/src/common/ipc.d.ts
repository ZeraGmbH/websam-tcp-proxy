declare module 'ipc' {
    interface IConfigRequest {
        type: 'config-request'
    }

    interface IConfigResponse {
        configName: string
        type: 'config-response'
    }

    interface ISerialPortsRequest {
        type: 'serial-request'
    }

    interface ISerialPortsResponse {
        portNames: string[]
        type: 'serial-response'
    }

    interface ISetSerialPortRequest {
        portName: string
        type: 'port-request'
    }

    interface ISetSerialPortResponse {
        type: 'port-response'
    }

    type TRequest = IConfigRequest | ISerialPortsRequest | ISetSerialPortRequest

    type TRequestType = TRequest['type']

    type TResponse = IConfigResponse | ISerialPortsResponse | ISetSerialPortResponse

    type TResponseType = TResponse['type']

    type TTypedRequest<T extends TRequestType> = TRequest & { type: T }

    type TTypedResponse<T extends TResponseType> = TResponse & { type: T }
}
