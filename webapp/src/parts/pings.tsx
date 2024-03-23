import { clsx } from 'clsx'
import * as React from 'react'

import styles from './pings.module.scss'

interface IPingsProps {
    className?: string
}

export const Pings: React.FC<IPingsProps> = (props) => {
    return <div className={clsx(styles.pings, props.className)}>[pings]</div>
}
