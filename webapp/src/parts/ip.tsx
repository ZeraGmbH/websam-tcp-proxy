import { clsx } from 'clsx'
import * as React from 'react'

import styles from './ip.module.scss'

import { Server } from '../run/server'
import { SettingsContext } from '../settings'

const endPointReg = /:\d{1,5}$/

interface IIpProps {
    className?: string
    setLock(locked: boolean): void
}

export const Ip: React.FC<IIpProps> = (props) => {
    const { setLock } = props

    const [settings, duplicates] = React.useContext(SettingsContext)

    const [run, setRun] = React.useState(false)

    const onChange = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => settings.update('proxyIp', ev.currentTarget.value),
        [settings]
    )

    const canStart =
        settings.proxyIp &&
        Object.values(duplicates).every((c) => c === 1) &&
        settings.proxies.every((p) => endPointReg.test(p.endPoint))

    const onStart = React.useCallback(() => {
        setLock(true)

        setRun(true)
    }, [setLock])

    const onDone = React.useCallback(() => {
        setRun(false)

        setLock(false)
    }, [setLock])

    return (
        <fieldset className={clsx(styles.ip, props.className)}>
            <legend>TCP/IP Server auf</legend>
            <input placeholder='(Name oder IP Adresse)' type='text' value={settings.proxyIp} onChange={onChange} />
            <button disabled={!canStart} onClick={onStart}>
                Start
            </button>
            {run && <Server onClose={onDone} />}
        </fieldset>
    )
}
