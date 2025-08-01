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

  const [device, setDevice] = React.useState(false);
  const [client, setClient] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [data, setData] = React.useState([0, 0]);
  const [portId] = React.useState(uuid());

  const { index } = props;

  const portOpened = React.useCallback(
    (notify: ipc.ISerialOpenNotification) =>
      notify.id === portId && setDevice(true),
    [portId]
  );

  const dataInfo = React.useCallback(
    (notify: ipc.IDataNotification) =>
      notify.id === portId && setData([notify.received, notify.sent]),
    [portId]
  );

  const clientConnected = React.useCallback(
    (notify: ipc.IConnectNotification) =>
      notify.id === portId && setClient(notify.connected),
    [portId]
  );

  React.useEffect(() => {
    electronHost.addListener("notify-connect", clientConnected);
    electronHost.addListener("notify-data", dataInfo);
    electronHost.addListener("notify-serial-open", portOpened);

    return () => {
      electronHost.removeListener("notify-connect", clientConnected);
      electronHost.removeListener("notify-data", dataInfo);
      electronHost.removeListener("notify-serial-open", portOpened);
    };
  }, [portOpened, dataInfo]);

  var startSerial = React.useCallback(
    (on: boolean) => {
      electronHost.send<ipc.ICloseSerialRequest>({
        portId,
        type: "close-serial-request",
      });

      if (on)
        electronHost.send<ipc.IOpenSerialRequest>({
          proxyIp: settings.proxyIp,
          port: settings.serials[index],
          portId,
          type: "open-serial-request",
        });
    },
    [settings, index, portId]
  );

  React.useEffect(
    () => (startSerial(true), () => startSerial(false)),
    [startSerial]
  );

  var togglePause = React.useCallback(
    () =>
      setPaused((paused) => {
        startSerial(paused);

        return !paused;
      }),
    [startSerial]
  );

  var port = settings.serials[index];

  return (
    <div className={clsx(styles.serial, props.className)}>
      <Status count={data[1]} error={!device} noDots={paused} />
      <Status count={data[0]} warning={!client} noDots={paused}>
        Serielle Verbindung auf {port.port} to {port.device}
      </Status>
      <button onClick={togglePause}>
        {paused ? "Fortsetzen" : "Pausieren"}
      </button>
    </div>
  );
};
