import { BrowserWindow } from "electron";
import { ISerialPortsRequest, ISerialPortsResponse, TResponse } from "ipc";
import { SerialPort } from "serialport";

export async function getSerialPorts(
  _win: BrowserWindow,
  _request: ISerialPortsRequest,
  reply: <T extends TResponse>(response: T) => void
): Promise<void> {
  const ports = await SerialPort.list();

  reply<ISerialPortsResponse>({
    portNames: ports
      .filter((p) => p.path.startsWith("/dev/"))
      .map((p) => p.path.substring(5)),
    type: "serial-response",
  });
}
