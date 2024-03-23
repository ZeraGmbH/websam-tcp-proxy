import { clsx } from 'clsx'
import * as React from 'react'

import styles from './proxies.module.scss'

interface IProxiesProps {
    className?: string
}

export const Proxies: React.FC<IProxiesProps> = (props) => {
    return <div className={clsx(styles.proxies, props.className)}>[proxies]</div>
}
