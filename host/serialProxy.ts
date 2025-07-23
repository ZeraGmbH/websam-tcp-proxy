import { SerialPort } from "serialport";
import { Proxy } from "./proxy";

import { BrowserWindow } from "electron";
import * as ipc from "ipc";

/** Klasse zum Aufbau einer TCP/IP Verbindung zu einer seriellen Leitung. */
export class SerialProxy extends Proxy {
  /** Die serielle Leitung. */
  private _port?: SerialPort;

  /** Meldet den erfolgreichen Aufbau zur seriellen Leitung. */
  onOpen?(): void;

  /**
   * Initialisiert eine neue Verbindung.
   *
   * @param server Rechnername für den TCP/IP Server.
   * @param port TCP/IP Port.
   * @param device Name der seriellen Leitung.
   */
  private constructor(
    server: string,
    port: number,
    public readonly device: string
  ) {
    /** TCP/IP Server konfigurieren. */
    super(server, port);

    /** Öffnet die Verbindung zur seriellen Leitung. */
    this._port = new SerialPort(
      {
        autoOpen: true,
        baudRate: 9600,
        dataBits: 8,
        endOnClose: true,
        parity: "none",
        path: device,
        stopBits: 2,
      },
      (e) => {
        if (e) console.error(e.message);
        else {
          /* Lesevorgang starten. */
          this.fromPort();

          /* Erfolgreiches Öffnen der Verbindung melden. */
          this.onOpen?.();
        }
      }
    );

    this._port.on("error", (e) => console.log(e.message));
  }

  /** Daten des TCP/IP Clients an die serielle Leitung senden. */
  protected write(data: Buffer): void {
    this._port?.write(data, (e) => e && console.error(e.message));
  }

  /** Daten von der seriellen Leitung entgegen nehmen. */
  private async fromPort(): Promise<void> {
    while (this._port?.isOpen)
      try {
        /** Nächsten Datenblock einlesen und prüfen. */
        const buf: Buffer = this._port?.read();

        /** Daten an den möglicherweise verbundenen TCP/IP Client durchreichen. */
        if (buf?.length) this.toClient(buf);
        else await new Promise((success) => setTimeout(success, 100));
      } catch (e) {
        /** Bei der Fehlerbehandlung ist noch reichlich Luft nach oben. */
        console.error(e.message);

        break;
      }
  }

  /** Nutzung der seriellen Verbindung beenden. */
  shutdown(): void {
    try {
      this._port?.close();
    } catch (e) {
      console.error(e.message);
    }

    /** TCP/IP Server beenden. */
    super.shutdown();
  }

  /**
   * Erstellt eine neue Verbindung zu einer seriellen Leitung her.
   *
   * @param config Gesamtkonfiguration.
   * @param serial Konfiguration des Ports.
   * @returns Verbindung, sofern eine solche laut Konfiguration erwünscht ist.
   */
  static create(
    proxyIp: string,
    serial: ipc.ISerialConfiguration
  ): SerialProxy | undefined {
    if (
      !serial.device ||
      serial.port == null ||
      serial.port < 1024 ||
      serial.port > 65535
    )
      return;

    return new SerialProxy(proxyIp, serial.port, serial.device);
  }
}

const proxies: Record<string, SerialProxy> = {};

export async function openSerial(
  _win: BrowserWindow,
  request: ipc.IOpenSerialRequest,
  reply: <T extends ipc.TResponse | ipc.TNotification>(response: T) => void
): Promise<void> {
  const proxy = SerialProxy.create(request.proxyIp, request.port);

  if (proxy) {
    proxies[request.portId] = proxy;

    proxy.onClient = (connected) =>
      reply<ipc.IConnectNotification>({
        id: request.portId,
        connected,
        type: "notify-connect",
      });

    proxy.onOpen = () =>
      reply<ipc.ISerialOpenNotification>({
        id: request.portId,
        type: "notify-serial-open",
      });

    proxy.onData = (received, sent) =>
      reply<ipc.IDataNotification>({
        id: request.portId,
        received,
        sent,
        type: "notify-data",
      });
  }
}

export async function closeSerial(
  _win: BrowserWindow,
  request: ipc.ICloseSerialRequest
): Promise<void> {
  const proxy = proxies[request.portId];

  if (!proxy) return;

  delete proxies[request.portId];

  proxy.shutdown();
}
