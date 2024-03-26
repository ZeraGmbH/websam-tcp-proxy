import { clsx } from 'clsx'
import * as React from 'react'

import { Ip } from './parts/ip'
import { Pings } from './parts/pings'
import { Proxies } from './parts/proxies'
import { Serial } from './parts/serial'
import styles from './root.module.scss'
import { SettingsContext, useSettings } from './settings'
import { AppState, IAppState } from './state'

interface IRootProps {
    className?: string
}

export const Root: React.FC<IRootProps> = (props) => {
    const settings = useSettings()

    const appState = React.useMemo<IAppState>(() => ({}), [])

    return (
        <AppState.Provider value={appState}>
            <SettingsContext.Provider value={settings}>
                <div className={clsx(styles.root, props.className)}>
                    <Ip />
                    <Serial />
                    <Pings />
                    <Proxies />
                </div>
            </SettingsContext.Provider>
        </AppState.Provider>
    )
}
