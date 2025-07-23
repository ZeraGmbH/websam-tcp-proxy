import clsx from "clsx";
import * as ipc from "ipc";
import * as React from "react";

import styles from "./serial.module.scss";
import { Status } from "./status";

import { v4 as uuid } from "uuid";
import { electronHost } from "../electron";
import { SettingsContext } from "../settings";

interface ISerialProps {
  className?: string;
  index: number;
}

export const Serial: React.FC<ISerialProps> = (props) => {
  const [settings] = React.useContext(SettingsContext);

  const [device, setDevice] = React.useState("");
  const [client, setClient] = React.useState(false);
  const [data, setData] = React.useState([0, 0]);
  const [portId] = React.useState(uuid());

  const { index } = props;

  const portOpened = React.useCallback(
    (notify: ipc.ISerialOpenNotification) =>
      notify.id === portId && setClient(true),
    [portId]
  );

  const dataInfo = React.useCallback(
    (notify: ipc.IDataNotification) =>
      notify.id === portId && setData([notify.received, notify.sent]),
    [portId]
  );

  React.useEffect(() => {
    electronHost.addListener("notify-data", dataInfo);
    electronHost.addListener("notify-serial-open", portOpened);

    return () => {
      electronHost.removeListener("notify-data", dataInfo);
      electronHost.removeListener("notify-serial-open", portOpened);
    };
  }, [portOpened, dataInfo]);

  React.useEffect(() => {
    var ports = settings.serials;

    setDevice(ports[index].device);

    electronHost.send<ipc.IOpenSerialRequest>({
      proxyIp: settings.proxyIp,
      port: ports[index],
      portId,
      type: "open-serial-request",
    });

    return () =>
      electronHost.send<ipc.ICloseSerialRequest>({
        portId,
        type: "close-serial-request",
      });
  }, [settings, index, portId]);

  return (
    device && (
      <div className={clsx(styles.serial, props.className)}>
        <Status count={data[1]} error={false} />
        <Status count={data[0]} warning={!client}>
          Serielle Verbindung auf {device}
        </Status>
      </div>
    )
  );
};
