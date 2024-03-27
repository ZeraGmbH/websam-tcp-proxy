import { clsx } from 'clsx'
import * as React from 'react'

import styles from './number.module.scss'

const numberReg = /^(0|[1-9]\d{1,7})$/

interface INumberProps {
    className?: string
    label: string
    max: number
    min: number
    onValue(value: number | null): void
    value: number | null
}

export const Number: React.FC<INumberProps> = (props) => {
    const { min, max, onValue, value } = props

    const [strValue, setValue] = React.useState('')

    React.useEffect(() => setValue(value == null ? '' : `${value}`), [value])

    const parseNumber = React.useCallback(
        (value: string) => {
            if (!value) return null

            if (!numberReg.test(value)) return

            const num = parseInt(value)

            if (num < min || num > max) return

            return num
        },
        [max, min]
    )

    const onChange = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            const value = ev.target.value

            setValue(value)

            const newValue = parseNumber(value)

            if (newValue !== undefined) onValue(newValue)
        },
        [onValue, parseNumber]
    )

    return (
        <label>
            <div>{props.label}:</div>
            <input
                className={clsx(styles.number, props.className, parseNumber(strValue) === undefined && styles.bad)}
                size={6}
                type='text'
                value={strValue}
                onChange={onChange}
            />
        </label>
    )
}

interface IPortProps {
    className?: string
    onPort(value: number | null): void
    port: number | null
}

export const Port: React.FC<IPortProps> = (props) => (
    <Number
        className={props.className}
        label='TCP/IP Port'
        max={63535}
        min={1024}
        value={props.port}
        onValue={props.onPort}
    />
)
