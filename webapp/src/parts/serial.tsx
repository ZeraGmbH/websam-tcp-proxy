import { clsx } from "clsx";
import * as ipc from "ipc";
import * as React from "react";

import { Port } from "./number";
import styles from "./serial.module.scss";

import { electronHost } from "../electron";
import { SettingsContext } from "../settings";

interface ISerialProps {
  className?: string;
  index: number;
}

export const Serial: React.FC<ISerialProps> = (props) => {
  const { index } = props;

  const [settings] = React.useContext(SettingsContext);

  const [selector, setSelector] = React.useState(false);
  const [portNames, setPortNames] = React.useState<string[]>([]);

  const updatePortNames = React.useCallback(
    (res: ipc.ISerialPortsResponse) => setPortNames(res.portNames),
    []
  );

  React.useEffect(() => {
    electronHost.addListener("serial-response", updatePortNames);

    electronHost.send<ipc.ISerialPortsRequest>({ type: "serial-request" });

    return () =>
      electronHost.removeListener("serial-response", updatePortNames);
  }, [updatePortNames]);

  const onChoose = React.useCallback(() => setSelector((open) => !open), []);

  const updateSerial = React.useCallback(
    <TKey extends keyof ipc.ISerialConfiguration>(
      prop: TKey,
      value: ipc.ISerialConfiguration[TKey]
    ) => {
      const ports = Array.isArray(settings.serial)
        ? [...settings.serial]
        : [settings.serial];

      ports[index] = { ...ports[index], [prop]: value };

      settings.update("serial", ports);
    },
    [settings, index]
  );

  const onDevice = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) =>
      updateSerial("device", ev.target.value),
    [updateSerial]
  );

  const onSelect = React.useCallback(
    (device: string) => {
      updateSerial("device", device);

      setSelector(false);
    },
    [updateSerial]
  );

  const onPort = React.useCallback(
    (port: number | null) => updateSerial("port", port),
    [updateSerial]
  );

  const onDelete = React.useCallback(() => {
    const ports = Array.isArray(settings.serial)
      ? [...settings.serial]
      : [settings.serial];

    ports.splice(index, 1);

    settings.update("serial", ports);
  }, [settings, index]);

  const ports = Array.isArray(settings.serial)
    ? settings.serial
    : [settings.serial];

  return (
    <div className={clsx(styles.serial, props.className)}>
      <button onClick={onDelete}>Löschen</button>
      <label>
        <input
          placeholder="(Gerätename)"
          type="text"
          value={ports[index].device}
          onChange={onDevice}
        />
        &nbsp;
        <span className={styles.selector}>
          <button onClick={onChoose}>...</button>
          {selector && (
            <div className={styles.chooser}>
              <h1>Bekannte Geräte</h1>
              <div className={styles.list}>
                {portNames.map((n) => (
                  <Selector key={n} name={n} selected={onSelect} />
                ))}
              </div>
            </div>
          )}
        </span>
      </label>
      <div className={styles.port}>
        <Port port={ports[index].port} onPort={onPort} />
      </div>
    </div>
  );
};

interface ISelectorProps {
  name: string;
  selected(name: string): void;
}

const Selector: React.FC<ISelectorProps> = (props) => {
  const { name, selected } = props;

  const onSelect = React.useCallback(() => selected(name), [name, selected]);

  return <div onClick={onSelect}>{name}</div>;
};
