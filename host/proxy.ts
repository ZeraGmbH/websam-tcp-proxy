import { IProxyConfiguration } from "ipc";
import { createServer, Socket } from "net";

export interface ISerialConfiguration {
  device: string;
  port: number | null;
}

export interface IConfiguration {
  pingHosts: string[];
  pingInterval: number | null;
  proxies: IProxyConfiguration[];
  proxyIp: string;
  serials: ISerialConfiguration[];
}

/** Hilfsklasse zur Bereitstellung eines TCP/IP Server Ports. */
export abstract class Proxy {
  /** Server Instanz. */
  private readonly _tcp = createServer();

  /** Aktueller Client, es kann immer nur einen geben. */
  private _client?: Socket;

  /** Meldet den Verbindungsauf- und abbau des Clients. */
  onClient?(connected: boolean): void;

  /** Meldet den aktuellen Datendurchsatz. */
  onData?(received: number, sent: number): void;

  /** Anzahl der vom aktuellen Client entgegengenommenen Bytes. */
  private _received = 0;

  /** Anzahl der für Clients bereitsgestellten Bytes. */
  private _sent = 0;

  /**
   * Initialisiert den TCP/IP Server.
   *
   * @param ip Rechnername, an den der Server angemeldet wird.
   * @param port TCP/IP Port des Servers.
   */
  protected constructor(
    ip: string,
    public readonly port: number
  ) {
    /** Fehler werden im Wesentlichen ignoriert. */
    this._tcp.on("error", (e) => console.error(e.message));

    /** Verbindungsanfragen von Clients. */
    this._tcp.on("connection", (client) => {
      /** Es darf immer nur einen aktiven Client geben. */
      if (this._client) {
        client.write("already connected\r\n", () => client.end());

        return;
      }

      /** Beenden der Verbindung vom Client aus. */
      client.on("close", () => this.setClient());

      /** Datenübertragung vom Client. */
      client.on("data", this.fromClient);

      /** Fehler einfach nur protokollieren. */
      client.on("error", (e) => console.error(e.message));

      /** Aktiven Client vermerken. */
      this.setClient(client);
    });

    this._tcp.listen(port, ip);
  }

  /**
   * Vermerkt den aktiven Client.
   *
   * @param client Der aktive Client sofern ein solcher existiert.
   */
  private setClient(client?: Socket): void {
    /** Verbindung merken und Zähler zurücksetzen. */
    this._client = client;
    this._received = 0;

    /** Änderung der Verbindung melden. */
    this.onClient?.(!!client);

    /** Veränderung an den Übertragungsdaten melden. */
    this.update();
  }

  /** Veränderung an den Übertragungsdaten melden. */
  private update(): void {
    this.onData?.(this._received, this._sent);
  }

  /** Muss implementiert werden um Daten vom Client zu verarbeiten. */
  protected abstract write(data: Buffer): void;

  /**
   * Daten vom Client verarbeiten.
   *
   * @param data Ein Block von Rohdaten.
   */
  private readonly fromClient = (data: Buffer): void => {
    /** Menge der Übertragungsdaten aktualisieren und melden. */
    this._received += data.length;

    this.update();

    /** Daten verarbeiten. */
    this.write(data);
  };

  /**
   * Daten an den TCP/IP Client übertragen.
   *
   * @param data An den Client zu übertragenen Daten.
   */
  protected toClient(data: Buffer): void {
    /** Menge der Übertragungsdaten aktualisieren und melden. */
    this._sent += data.length;

    this.update();

    try {
      /** Daten übertragen - erst einmal ohne eigene Zwischenspeicherung in einer Queue. */
      this._client?.write(data);
    } catch (e) {
      /** Fehlerbearbeitung ist eher rudimentär. */
      console.error(e.message);
    }
  }

  /** Beendet den TCP/IP Server. */
  shutdown(): void {
    try {
      /** Aktiven Client abmelden. */
      this._client?.destroy();
    } catch (e) {
      console.error(e.message);
    }

    try {
      /** Server beenden. */
      this._tcp.close();
    } catch (e) {
      console.error(e.message);
    }
  }
}
