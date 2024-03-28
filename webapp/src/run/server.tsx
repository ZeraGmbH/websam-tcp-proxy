import { clsx } from 'clsx'
import { ISetSerialPortRequest } from 'ipc'
import * as React from 'react'

import { SerialProxy } from './serial'
import styles from './server.module.scss'
import { Status } from './status'

import { electronHost } from '../electron'
import { SettingsContext } from '../settings'

interface IServerProps {
    className?: string
    onClose(): void
}

export const Server: React.FC<IServerProps> = (props) => {
    const [settings] = React.useContext(SettingsContext)

    const { onClose } = props

    const [serOpen, setSerOpen] = React.useState<[boolean, number] | undefined>(undefined)

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
            setSerOpen([false, serial.port])

            serial.onOpen = () => setSerOpen([true, serial.port])

            electronHost.send({ portName: serial.device, type: 'port-request' } satisfies ISetSerialPortRequest)
        }

        return () => {
            electronHost.removeListener('port-response', portReady)

            serial?.shutdown()
        }
    }, [settings])

    return (
        <div className={clsx(styles.server, props.className)}>
            <div>
                <h1>TCP/IP Server gestartet</h1>
                {serOpen !== undefined && <Status error={!serOpen[0]}>Serielle Verbindung auf {serOpen[1]}</Status>}
                <button onClick={onClose}>Stop</button>
            </div>
        </div>
    )
}
