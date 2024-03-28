import { clsx } from 'clsx'
import * as React from 'react'

import styles from './ip.module.scss'

import { SettingsContext } from '../settings'

const endPointReg = /:\d{1,5}$/

interface IIpProps {
    className?: string
}

export const Ip: React.FC<IIpProps> = (props) => {
    const [settings, duplicates] = React.useContext(SettingsContext)

    const onChange = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => settings.update('proxyIp', ev.currentTarget.value),
        [settings]
    )

    const canStart =
        settings.proxyIp &&
        Object.values(duplicates).every((c) => c === 1) &&
        settings.proxies.every((p) => endPointReg.test(p.endPoint))

    return (
        <fieldset className={clsx(styles.ip, props.className)}>
            <legend>TCP/IP Server auf</legend>
            <input placeholder='(Name oder IP Adresse)' type='text' value={settings.proxyIp} onChange={onChange} />
            <button disabled={!canStart}>Start</button>
        </fieldset>
    )
}
