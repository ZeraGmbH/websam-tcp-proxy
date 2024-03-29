import clsx from 'clsx'
import { ISetSerialPortRequest } from 'ipc'
import * as React from 'react'

import styles from './serial.module.scss'
import { SerialProxy } from './serialProxy'
import { Status } from './status'

import { electronHost } from '../electron'
import { SettingsContext } from '../settings'

interface ISerialProps {
    className?: string
}

export const Serial: React.FC<ISerialProps> = (props) => {
    const [settings] = React.useContext(SettingsContext)

    const [state, setState] = React.useState<[boolean, number] | undefined>(undefined)
    const [client, setClient] = React.useState(false)
    const [data, setData] = React.useState([0, 0])

    React.useEffect(() => {
        const serial = SerialProxy.create(settings)

        const portReady = (): void => {
            navigator.serial
                .requestPort()
                .then((p) => serial?.open(p))
                .catch((e) => console.error(e.message))
        }

        electronHost.addListener('port-response', portReady)

        if (serial) {
            setState([false, serial.port])

            serial.onClient = setClient
            serial.onData = (client, port) => setData([client, port])
            serial.onOpen = () => setState([true, serial.port])

            electronHost.send({ portName: serial.device, type: 'port-request' } satisfies ISetSerialPortRequest)
        }

        return () => {
            electronHost.removeListener('port-response', portReady)

            serial?.shutdown()
        }
    }, [settings])

    return (
        state !== undefined && (
            <div className={clsx(styles.serial, props.className)}>
                <Status count={data[1]} error={!state[0]} />
                <Status count={data[0]} warning={!client}>
                    Serielle Verbindung auf {state[1]}
                </Status>
            </div>
        )
    )
}
