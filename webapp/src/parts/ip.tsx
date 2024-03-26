import { clsx } from 'clsx'
import * as React from 'react'

import styles from './ip.module.scss'

import { SettingsContext } from '../settings'

interface IIpProps {
    className?: string
}

export const Ip: React.FC<IIpProps> = (props) => {
    const settings = React.useContext(SettingsContext)

    const onChange = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => settings.update('proxyIp', ev.currentTarget.value),
        [settings]
    )

    return (
        <label className={clsx(styles.ip, props.className)}>
            <div>
                Anmelden als (<i>Host für listen()</i>):
            </div>
            <input placeholder='(Name oder IP Address)' type='text' value={settings.proxyIp} onChange={onChange} />
        </label>
    )
}
