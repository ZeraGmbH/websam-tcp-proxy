/* eslint-disable @typescript-eslint/naming-convention */

import { BrowserWindow } from "electron";
import { TNotification, TRequestType, TResponse, TTypedRequest } from "ipc";

import { getConfigName } from "./configName";
import { setSerialPort } from "./serialPort";
import { getSerialPorts } from "./serialPorts";
import { closeTcp, openTcp } from "./tcpProxy";

/** Signatur für eine Meldung vom Electron Host an die Anwendung. */
type TReply = (response: TResponse | TNotification) => void;

/** Signatur für die Bearbeitung einer Meldung von der Anwendung an den Electron Host. */
export type THandler<T extends TRequestType> = (
  app: BrowserWindow,
  request: TTypedRequest<T>,
  reply: TReply
) => void | Promise<void>;

/** Handler für alle Nachrichten, die von der Anwendung an den Host gesendet werden können. */
export const listeners: { [T in TRequestType]: THandler<T> } = {
  "close-tcp-request": closeTcp,
  "config-request": getConfigName,
  "open-tcp-request": openTcp,
  "port-request": setSerialPort,
  "serial-request": getSerialPorts,
};
