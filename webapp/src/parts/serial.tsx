import { clsx } from 'clsx'
import { ISerialPortsResponse } from 'ipc'
import * as React from 'react'

import { Port } from './number'
import styles from './serial.module.scss'

import { electronHost } from '../electron'
import { SettingsContext } from '../settings'

interface ISerialProps {
    className?: string
}

export const Serial: React.FC<ISerialProps> = (props) => {
    const [settings] = React.useContext(SettingsContext)

    const [selector, setSelector] = React.useState(false)
    const [portNames, setPortNames] = React.useState<string[]>([])

    const updatePortNames = React.useCallback((res: ISerialPortsResponse) => setPortNames(res.portNames), [])

    React.useEffect(() => {
        electronHost.addListener('serial-response', updatePortNames)

        return () => electronHost.removeListener('serial-response', updatePortNames)
    }, [updatePortNames])

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
        (port: number | null) => settings.update('serial', { ...settings.serial, port }),
        [settings]
    )

    return (
        <fieldset className={clsx(styles.serial, props.className)}>
            <legend>Lokale serielle Schnittstelle</legend>
            <div>
                <label>
                    <input placeholder='(Gerätename)' type='text' value={settings.serial.device} onChange={onDevice} />
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
                <div className={styles.port}>
                    <Port port={settings.serial.port} onPort={onPort} />
                </div>
            </div>
        </fieldset>
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
