import { clsx } from "clsx";
import * as React from "react";

import { Status } from "./status";
import styles from "./tcp.module.scss";

import * as ipc from "ipc";
import { v4 as uuid } from "uuid";
import { electronHost } from "../electron";
import { SettingsContext } from "../settings";

interface ITcpProps {
  className?: string;
  index: number;
}

export const Tcp: React.FC<ITcpProps> = (props) => {
  const { index } = props;

  const [settings] = React.useContext(SettingsContext);

  const [open, setOpen] = React.useState<boolean | undefined>(undefined);
  const [client, setClient] = React.useState(false);
  const [data, setData] = React.useState([0, 0]);
  const [tcpId] = React.useState(uuid());

  const tcpOpened = React.useCallback(
    (notify: ipc.ITcpOpenNotification) =>
      notify.id === tcpId && setOpen(notify.opened),
    [tcpId]
  );

  const dataInfo = React.useCallback(
    (notify: ipc.IDataNotification) =>
      notify.id === tcpId && setData([notify.received, notify.sent]),
    [tcpId]
  );

  const clientConnected = React.useCallback(
    (notify: ipc.IConnectNotification) =>
      notify.id === tcpId && setClient(notify.connected),
    [tcpId]
  );

  React.useEffect(() => {
    electronHost.addListener("notify-connect", clientConnected);
    electronHost.addListener("notify-data", dataInfo);
    electronHost.addListener("notify-tcp-open", tcpOpened);

    return () => {
      electronHost.removeListener("notify-connect", clientConnected);
      electronHost.removeListener("notify-data", dataInfo);
      electronHost.removeListener("notify-tcp-open", tcpOpened);
    };
  }, [tcpOpened, dataInfo, clientConnected]);

  React.useEffect(() => {
    setOpen(false);

    electronHost.send<ipc.IOpenTcpRequest>({
      proxyIp: settings.proxyIp,
      tcp: settings.proxies[index],
      tcpId,
      type: "open-tcp-request",
    });

    return () =>
      electronHost.send<ipc.ICloseTcpRequest>({
        tcpId,
        type: "close-tcp-request",
      });
  }, [tcpId, settings, index]);

  const { port, endPoint } = settings.proxies[index];

  return (
    open !== undefined && (
      <div className={clsx(styles.tcp, props.className)}>
        <Status count={data[1]} error={!open} />
        <Status count={data[0]} warning={!client}>
          TCP/IP Verbindung auf {port} zu {endPoint}
        </Status>
      </div>
    )
  );
};
