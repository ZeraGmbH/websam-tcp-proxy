import { clsx } from 'clsx'
import * as React from 'react'

import { Ip } from './parts/ip'
import { Pings } from './parts/pings'
import { Proxies } from './parts/proxies'
import styles from './root.module.scss'
import { SettingsContext, useSettings } from './settings'
import { AppState, IAppState } from './state'

interface IRootProps {
    className?: string
}

export const Root: React.FC<IRootProps> = (props) => {
    const settings = useSettings()

    const appState = React.useMemo<IAppState>(() => ({}), [])

    const onClick = React.useCallback(() => {
        navigator.serial
            .requestPort()
            .then((p) => p?.open({ baudRate: 9600, dataBits: 8, parity: 'none', stopBits: 2 }))
            .then((e) => alert('is open'))
            .catch((e) => alert(e.message))
    }, [])

    return (
        <AppState.Provider value={appState}>
            <SettingsContext.Provider value={settings}>
                <div className={clsx(styles.root, props.className)} onClick={onClick}>
                    <Ip />
                    <Pings />
                    <Proxies />
                </div>
            </SettingsContext.Provider>
        </AppState.Provider>
    )
}
