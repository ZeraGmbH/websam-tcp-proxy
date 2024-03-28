import { clsx } from 'clsx'
import * as React from 'react'

import styles from './status.module.scss'

interface IStatusProps {
    children: React.ReactNode
    className?: string
    error: boolean | undefined
}

export const Status: React.FC<IStatusProps> = (props) => {
    return (
        <div className={clsx(styles.status, props.className)}>
            <div className={clsx(styles.dot, props.error && styles.error)} />
            <div>{props.children}</div>
        </div>
    )
}
