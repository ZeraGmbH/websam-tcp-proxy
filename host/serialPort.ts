import { BrowserWindow } from 'electron'
import { ISetSerialPortRequest, ISetSerialPortResponse, TResponse } from 'ipc'

export let portName = ''

export async function setSerialPort(
    _win: BrowserWindow,
    request: ISetSerialPortRequest,
    reply: <T extends TResponse>(response: T) => void
): Promise<void> {
    portName = request.portName

    reply<ISetSerialPortResponse>({
        type: 'port-response',
    })
}
