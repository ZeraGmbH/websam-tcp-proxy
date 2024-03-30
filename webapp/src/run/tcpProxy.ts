import { Socket } from 'net'

import { Proxy } from './proxy'

import { IConfiguration } from '../settings'

/** Muster zur Erkennung eines Endpunkts bestehend aus Rechnername oder IP Adresse und TCP/IP Port. */
const endPointReg = /^([^:]+):(\d{1,5})$/

/** Proxy zu einem TCP/IP Server. */
export class TcpProxy extends Proxy {
    /** Verbindung zum Server. */
    private _remote: Socket | undefined = new Socket()

    /** Meldet, ob die Verbindung aktiviert werden konnte. */
    onOpen?(opened: boolean): void

    /**
     * Initialisiert eine Verbindung,
     *
     * @param server Name des lokalen TCP/IP Servers.
     * @param serverPort Lokaler Port.
     * @param _remoteServer Name des entfernten TCP/IP Servers.
     * @param _remotePort Entfernter Port.
     */
    private constructor(
        server: string,
        serverPort: number,
        private readonly _remoteServer: string,
        private readonly _remotePort: number
    ) {
        /** Lokalen Server einrichten. */
        super(server, serverPort)

        /** Fehlermeldung kann noch verbessert werden. */
        this._remote?.on('error', (e) => console.error(e.message))

        /** Automatische Neuverbindung wenn der entfernte Server neu startet. */
        this._remote?.on('close', () => {
            /** Zustand melden. */
            this.onOpen?.(false)

            /** Mit etwas Pause neu verbinden. */
            setTimeout(this.connect, 5000)
        })

        /** Eingehende Daten verarbeiten. */
        this._remote?.on('data', this.fromRemote)

        /** Erstmalige Verbindung aufbauen. */
        this.connect()
    }

    /** Eingehende Daten verarbeiten. */
    private readonly fromRemote = (data: Buffer): void => this.toClient(data)

    /** Verbindung zum entfernten Server aufsetzen. */
    private readonly connect = (): void => {
        this._remote?.connect(this._remotePort, this._remoteServer, () => this.onOpen?.(true))
    }

    /** Eingehende Daten an den TCP/IP Client weitergeben. */
    protected write(data: Buffer): void {
        try {
            this._remote?.write(data)
        } catch (e) {
            console.error(e.message)
        }
    }

    /** Verbindung endgültig beenden. */
    shutdown(): void {
        try {
            /** TCP/IP Client beenden. */
            this._remote?.destroy()
        } catch (e) {
            console.error(e.message)
        } finally {
            this._remote = undefined
        }

        /** TCP/IP Server beenden. */
        super.shutdown()
    }

    /**
     * Verbindung zu einem TCP/IP Server herstellen.
     *
     * @param config Gesamtkonfiguration.
     * @param index Laufende Nummer der gewünschten Verbindung.
     * @returns Verbindung sofern konfiguriert.
     */
    static create(config: IConfiguration, index: number): TcpProxy | undefined {
        /** Lokale Verbindung prüfen. */
        const tcp = config.proxies[index]

        if (!tcp || tcp.port == null || tcp.port < 1024 || tcp.port > 65535) return

        /** Entfernte Verbindung prüfen. */
        const ep = endPointReg.exec(tcp.endPoint)

        if (!ep) return

        /** Neue Verbindung erstellen. */
        return new TcpProxy(config.proxyIp, tcp.port, ep[1], parseInt(ep[2]))
    }
}
