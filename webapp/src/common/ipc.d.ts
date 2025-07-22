declare module "ipc" {
  interface IProxyConfiguration {
    endPoint: string;
    port: number;
  }

  interface ISerialConfiguration {
    device: string;
    port: number | null;
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

  interface IOpenTcpRequest {
    tcpId: string;
    proxyIp: string;
    tcp: IProxyConfiguration;
    type: "open-tcp-request";
  }

  interface ICloseTcpRequest {
    tcpId: string;
    type: "close-tcp-request";
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

  interface IOpenSerialRequest {
    port: ISerialConfiguration;
    portId: string;
    proxyIp: string;
    type: "open-serial-request";
  }

  interface ICloseSerialRequest {
    portId: string;
    type: "close-serial-request";
  }

  interface ISerialOpenNotification {
    id: string;
    type: "notify-serial-open";
  }

  type TRequest =
    | ICloseSerialRequest
    | ICloseTcpRequest
    | IConfigRequest
    | IOpenSerialRequest
    | IOpenTcpRequest
    | ISerialPortsRequest;

  type TRequestType = TRequest["type"];

  type TResponse = IConfigResponse | ISerialPortsResponse;

  type TResponseType = TResponse["type"];

  type TNotification =
    | IConnectNotification
    | IDataNotification
    | ISerialOpenNotification
    | ITcpOpenNotification;

  type TNotificationType = TNotification["type"];

  type TTypedRequest<T extends TRequestType> = TRequest & { type: T };

  type TTypedResponse<T extends TResponseType> = TResponse & { type: T };

  type TTypedNotification<T extends TNotificationType> = TNotification & {
    type: T;
  };
}
