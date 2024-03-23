import { clsx } from 'clsx'
import * as React from 'react'

import styles from './ip.module.scss'

interface IIpProps {
    className?: string
}

export const Ip: React.FC<IIpProps> = (props) => {
    return <div className={clsx(styles.ip, props.className)}>[ip]</div>
}
