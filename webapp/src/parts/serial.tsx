import { clsx } from 'clsx'
import { ISerialPortsResponse } from 'ipc'
import * as React from 'react'

import styles from './serial.module.scss'

import { electronHost } from '../electron'

interface ISerialProps {
    className?: string
}

export const Serial: React.FC<ISerialProps> = (props) => {
    const [portNames, setPortNames] = React.useState<string[]>([])

    const updatePortNames = React.useCallback((res: ISerialPortsResponse) => setPortNames(res.portNames), [])

    React.useEffect(() => {
        electronHost.addListener('serial-response', updatePortNames)

        return () => electronHost.removeListener('serial-response', updatePortNames)
    }, [updatePortNames])

    const onChoose = React.useCallback(() => {
        navigator.serial.requestPort().catch((e) => alert(e.message))
    }, [])

    return (
        <div className={clsx(styles.serial, props.className)}>
            <button onClick={onChoose}>{JSON.stringify(portNames)}</button>
        </div>
    )
}
