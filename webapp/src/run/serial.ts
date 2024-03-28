import { createServer, Server } from 'net'

import { IConfiguration } from '../settings'

export class SerialProxy {
    private _port?: SerialPort

    private _tcp: Server

    onOpen?(): void

    private constructor(private readonly _config: IConfiguration) {
        this._tcp = createServer()

        this._tcp.on('error', (e) => console.error(e.message))

        this._tcp.on('connection', (client) => {
            client.write('not implemented\r\n', () => client.end())
        })

        this._tcp.listen(this.port, _config.proxyIp)
    }

    get device(): string {
        return this._config.serial.device
    }

    get port(): number {
        return this._config.serial.port ?? 0
    }

    open(port: SerialPort): void {
        this._port?.close()

        this._port = port

        port.open({ baudRate: 9600, dataBits: 8, parity: 'none', stopBits: 2 })
            .then(() => this.onOpen?.())
            .catch((e) => console.error(e.message))
    }

    shutdown(): void {
        this._port?.close()
        this._tcp.close()
    }

    static create(config: IConfiguration): SerialProxy | undefined {
        const { serial } = config

        if (!serial.device || serial.port == null || serial.port < 1024 || serial.port > 65535) return

        return new SerialProxy(config)
    }
}
