import { clsx } from 'clsx'
import { ISerialPortsResponse } from 'ipc'
import * as React from 'react'

import styles from './serial.module.scss'

import { electronHost } from '../electron'
import { SettingsContext } from '../settings'

const portReg = /^\d{1,5}$/g

function getValidPort(portAsString: string): number | null | undefined {
    if (!portAsString) return null

    if (!portReg.test(portAsString)) return

    const port = parseInt(portAsString)

    if (port < 1024 || port > 65535) return

    return port
}

interface ISerialProps {
    className?: string
}

export const Serial: React.FC<ISerialProps> = (props) => {
    const settings = React.useContext(SettingsContext)

    const [selector, setSelector] = React.useState(false)
    const [portNames, setPortNames] = React.useState<string[]>([])
    const [port, setPort] = React.useState('')

    const updatePortNames = React.useCallback((res: ISerialPortsResponse) => setPortNames(res.portNames), [])

    React.useEffect(() => {
        electronHost.addListener('serial-response', updatePortNames)

        return () => electronHost.removeListener('serial-response', updatePortNames)
    }, [updatePortNames])

    React.useEffect(() => setPort(settings.serial.port == null ? '' : `${settings.serial.port}`), [settings])

    const onChoose = React.useCallback(() => {
        setSelector((open) => {
            if (!open) navigator.serial.requestPort().catch((e) => console.error(e.message))

            return !open
        })
    }, [])

    const onDevice = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) =>
            settings.update('serial', { ...settings.serial, device: ev.target.value }),
        [settings]
    )

    const onSelect = React.useCallback(
        (device: string) => {
            settings.update('serial', { ...settings.serial, device })

            setSelector(false)
        },
        [settings]
    )

    const onPort = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            const portAsString = ev.target.value

            setPort(portAsString)

            const newPort = getValidPort(portAsString)

            if (newPort !== undefined) settings.update('serial', { ...settings.serial, port: newPort })
        },
        [settings]
    )

    return (
        <div className={clsx(styles.serial, props.className)}>
            <label>
                <div>Lokales Gerät:</div>
                <input type='text' value={settings.serial.device} onChange={onDevice} />
                &nbsp;
                <span className={styles.selector}>
                    <button onClick={onChoose}>...</button>
                    {selector && (
                        <div className={styles.chooser}>
                            <h1>Bekannte Geräte</h1>
                            <div className={styles.list}>
                                {portNames.map((n) => (
                                    <Selector key={n} name={n} selected={onSelect} />
                                ))}
                            </div>
                        </div>
                    )}
                </span>
            </label>
            <label>
                <div>TCP/IP Port:</div>
                <input
                    className={clsx(getValidPort(port) === undefined && styles.bad)}
                    size={6}
                    type='text'
                    value={port}
                    onChange={onPort}
                />
            </label>
        </div>
    )
}

interface ISelectorProps {
    name: string
    selected(name: string): void
}

const Selector: React.FC<ISelectorProps> = (props) => {
    const { name, selected } = props

    const onSelect = React.useCallback(() => selected(name), [name, selected])

    return <div onClick={onSelect}>{name}</div>
}
