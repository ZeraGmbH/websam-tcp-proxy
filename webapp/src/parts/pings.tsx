import { clsx } from 'clsx'
import * as React from 'react'

import { Number } from './number'
import { Ping } from './ping'
import styles from './pings.module.scss'

import { SettingsContext } from '../settings'

interface IPingsProps {
    className?: string
}

export const Pings: React.FC<IPingsProps> = (props) => {
    const settings = React.useContext(SettingsContext)

    const onInterval = React.useCallback(
        (interval: number | null) => settings.update('pingInterval', interval),
        [settings]
    )

    const onAdd = React.useCallback(() => settings.update('pingHosts', [...settings.pingHosts, '']), [settings])

    const onDelete = React.useCallback(
        (index: number) => {
            const hosts = [...settings.pingHosts]

            hosts.splice(index, 1)

            settings.update('pingHosts', hosts)
        },
        [settings]
    )

    const onUpdate = React.useCallback(
        (index: number, ip: string) => {
            const hosts = [...settings.pingHosts]

            hosts[index] = ip

            settings.update('pingHosts', hosts)
        },
        [settings]
    )

    return (
        <div className={clsx(styles.pings, props.className)}>
            <Number
                label='PING Intervall (Millisekunden, 500..59999)'
                max={59999}
                min={500}
                value={settings.pingInterval}
                onValue={onInterval}
            />
            <button onClick={onAdd}>Hinzufügen</button>
            {settings.pingHosts.map((ip, i) => (
                <Ping key={i} index={i} ip={ip} onDelete={onDelete} onUpdate={onUpdate} />
            ))}
        </div>
    )
}
