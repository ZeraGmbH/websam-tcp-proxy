import { createServer, Server, Socket } from 'net'

import { IConfiguration } from '../settings'

export class SerialProxy {
    private _port?: SerialPort

    private _tcp: Server

    private _client?: Socket

    private _writer?: WritableStreamDefaultWriter

    private _reader?: ReadableStreamDefaultReader<Buffer>

    onOpen?(): void

    onClient?(connected: boolean): void

    onData?(clientTotal: number, portTotal: number): void

    private _clientTotal = 0

    private _portTotal = 0

    private constructor(private readonly _config: IConfiguration) {
        this._tcp = createServer()

        this._tcp.on('error', (e) => console.error(e.message))

        this._tcp.on('connection', (client) => {
            if (this._client) {
                client.write('already connected\r\n', () => client.end())

                return
            }

            client.on('close', () => this.setClient())

            client.on('data', this.fromClient)

            this.setClient(client)
        })

        this._tcp.listen(this.port, _config.proxyIp)
    }

    private setClient(client?: Socket): void {
        this._client = client
        this._clientTotal = 0

        this.onClient?.(!!client)

        this.update()
    }

    private update(): void {
        this.onData?.(this._clientTotal, this._portTotal)
    }

    private readonly fromClient = (data: Buffer): void => {
        this._clientTotal += data.length

        this._writer?.write(data).catch((e) => console.error(e.message))

        this.update()
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
            .then(() => {
                this._reader = port.readable?.getReader()
                this._writer = port.writable?.getWriter()

                this.fromPort()

                this.onOpen?.()
            })
            .catch((e) => console.error(e.message))
    }

    private async fromPort(): Promise<void> {
        for (;;)
            try {
                const data = await this._reader?.read()

                if (data?.done !== false) break

                const buf = data.value

                if (!buf?.length) break

                this._portTotal += buf.length

                this.update()

                try {
                    this._client?.write(buf)
                } catch (e) {
                    console.error(e.message)
                }
            } catch (e) {
                console.error(e.message)

                break
            }
    }

    shutdown(): void {
        try {
            this._reader?.releaseLock()
        } catch (e) {
            console.error(e.message)
        }

        try {
            this._writer?.releaseLock()
        } catch (e) {
            console.error(e.message)
        }

        try {
            this._port?.close()
        } catch (e) {
            console.error(e.message)
        }

        try {
            this._client?.destroy()
        } catch (e) {
            console.error(e.message)
        }

        try {
            this._tcp.close()
        } catch (e) {
            console.error(e.message)
        }
    }

    static create(config: IConfiguration): SerialProxy | undefined {
        const { serial } = config

        if (!serial.device || serial.port == null || serial.port < 1024 || serial.port > 65535) return

        return new SerialProxy(config)
    }
}
