declare module "ipc" {
  interface IProxyConfiguration {
    endPoint: string;
    port: number;
  }

  interface IConfigRequest {
    type: "config-request";
  }

  interface IConfigResponse {
    configName: string;
    type: "config-response";
  }

  interface ISerialPortsRequest {
    type: "serial-request";
  }

  interface ISerialPortsResponse {
    portNames: string[];
    type: "serial-response";
  }

  interface ISetSerialPortRequest {
    portName: string;
    type: "port-request";
  }

  interface ISetSerialPortResponse {
    type: "port-response";
  }

  interface IOpenTcpRequest {
    tcpId: string;
    proxyIp: string;
    tcp: IProxyConfiguration;
    type: "open-tcp-request";
  }

  interface IOpenTcpResponse {
    success: boolean;
    type: "open-tcp-response";
  }

  interface ICloseTcpRequest {
    tcpId: string;
    type: "close-tcp-request";
  }

  interface ICloseTcpResponse {
    type: "close-tcp-response";
  }

  interface IConnectNotification {
    id: string;
    connected: boolean;
    type: "notify-connect";
  }

  interface IDataNotification {
    id: string;
    received: number;
    sent: number;
    type: "notify-data";
  }

  interface ITcpOpenNotification {
    id: string;
    opened: boolean;
    type: "notify-tcp-open";
  }

  type TRequest =
    | ICloseTcpRequest
    | IConfigRequest
    | IOpenTcpRequest
    | ISerialPortsRequest
    | ISetSerialPortRequest;

  type TRequestType = TRequest["type"];

  type TResponse =
    | ICloseTcpResponse
    | IConfigResponse
    | IOpenTcpResponse
    | ISerialPortsResponse
    | ISetSerialPortResponse;

  type TResponseType = TResponse["type"];

  type TNotification =
    | IConnectNotification
    | IDataNotification
    | ITcpOpenNotification;

  type TNotificationType = TNotification["type"];

  type TTypedRequest<T extends TRequestType> = TRequest & { type: T };

  type TTypedResponse<T extends TResponseType> = TResponse & { type: T };

  type TTypedNotification<T extends TNotificationType> = TNotification & {
    type: T;
  };
}
