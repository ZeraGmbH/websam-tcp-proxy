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

    const [locked, setLocked] = React.useState(false)

    const testKeyEvent = React.useCallback(
        (ev: KeyboardEvent) => {
            if (!locked) return

            ev.preventDefault()
            ev.stopPropagation()
        },
        [locked]
    )

    React.useEffect(() => {
        document.addEventListener('keydown', testKeyEvent)

        return () => document.removeEventListener('keydown', testKeyEvent)
    }, [testKeyEvent])

    return (
        <AppState.Provider value={appState}>
            <SettingsContext.Provider value={settings}>
                <div className={clsx(styles.root, props.className, locked && styles.locked)}>
                    <Ip setLock={setLocked} />
                    <Serial />
                    <Pings />
                    <Proxies />
                </div>
            </SettingsContext.Provider>
        </AppState.Provider>
    )
}
