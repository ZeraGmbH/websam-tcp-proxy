import { clsx } from 'clsx'
import * as React from 'react'

import { Serial } from './serial'
import styles from './server.module.scss'

interface IServerProps {
    className?: string
    onClose(): void
}

export const Server: React.FC<IServerProps> = (props) => {
    const { onClose } = props

    return (
        <div className={clsx(styles.server, props.className)}>
            <div>
                <h1>TCP/IP Server gestartet</h1>
                <Serial />
                <button onClick={onClose}>Stop</button>
            </div>
        </div>
    )
}
