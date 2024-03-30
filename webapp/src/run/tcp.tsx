import { clsx } from 'clsx'
import * as React from 'react'

import { Status } from './status'
import styles from './tcp.module.scss'
import { TcpProxy } from './tcpProxy'

import { SettingsContext } from '../settings'

interface ITcpProps {
    className?: string
    index: number
}

export const Tcp: React.FC<ITcpProps> = (props) => {
    const { index } = props

    const [settings] = React.useContext(SettingsContext)

    const [open, setOpen] = React.useState<boolean | undefined>(undefined)
    const [client, setClient] = React.useState(false)
    const [data, setData] = React.useState([0, 0])

    React.useEffect(() => {
        const tcp = TcpProxy.create(settings, index)

        if (tcp) {
            setOpen(false)

            tcp.onClient = setClient
            tcp.onData = (client, port) => setData([client, port])
            tcp.onOpen = (open) => setOpen(open)
        }

        return () => tcp?.shutdown()
    }, [settings, index])

    const { port, endPoint } = settings.proxies[index]

    return (
        open !== undefined && (
            <div className={clsx(styles.tcp, props.className)}>
                <Status count={data[1]} error={!open} />
                <Status count={data[0]} warning={!client}>
                    TCP/IP Verbindung auf {port} zu {endPoint}
                </Status>
            </div>
        )
    )
}
