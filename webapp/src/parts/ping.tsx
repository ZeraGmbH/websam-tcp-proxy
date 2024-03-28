import { clsx } from 'clsx'
import * as React from 'react'

import styles from './ping.module.scss'

interface IPingProps {
    className?: string
    index: number
    ip: string
    onDelete(index: number): void
    onUpdate(index: number, ip: string): void
}

export const Ping: React.FC<IPingProps> = (props) => {
    const { ip, onDelete, onUpdate, index } = props

    const [value, setValue] = React.useState('')

    React.useEffect(() => setValue(ip), [ip])

    const doDelete = React.useCallback(() => onDelete(index), [index, onDelete])

    const doUpdate = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            const ip = ev.target.value

            setValue(ip)

            onUpdate(index, ip)
        },
        [index, onUpdate]
    )

    return (
        <div className={clsx(styles.ping, props.className)}>
            <button onClick={doDelete}>Löschen</button>
            <input placeholder='(Name oder IP Adresse)' type='text' value={ip} onChange={doUpdate} />
        </div>
    )
}
