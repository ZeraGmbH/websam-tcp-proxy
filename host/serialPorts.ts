import { BrowserWindow } from 'electron'
import { ISerialPortsRequest, ISerialPortsResponse, TResponse } from 'ipc'

export const portNames: string[] = []

export async function getSerialPorts(
    _win: BrowserWindow,
    _request: ISerialPortsRequest,
    reply: <T extends TResponse>(response: T) => void
): Promise<void> {
    reply<ISerialPortsResponse>({
        portNames,
        type: 'serial-response',
    })
}
