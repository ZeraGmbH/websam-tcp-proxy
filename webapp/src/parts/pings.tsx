import { clsx } from "clsx";
import * as React from "react";

import { Number } from "./number";
import { Ping } from "./ping";
import styles from "./pings.module.scss";

import { SettingsContext } from "../settings";

interface IPingsProps {
  className?: string;
}

export const Pings: React.FC<IPingsProps> = (props) => {
  const [settings] = React.useContext(SettingsContext);

  const onInterval = React.useCallback(
    (interval: number | null) => settings.update("pingInterval", interval),
    [settings]
  );

  const onAdd = React.useCallback(
    () => settings.update("pingHosts", [...settings.pingHosts, ""]),
    [settings]
  );

  const onDelete = React.useCallback(
    (index: number) => {
      const hosts = [...settings.pingHosts];

      hosts.splice(index, 1);

      settings.update("pingHosts", hosts);
    },
    [settings]
  );

  const onUpdate = React.useCallback(
    (index: number, ip: string) => {
      const hosts = [...settings.pingHosts];

      hosts[index] = ip;

      settings.update("pingHosts", hosts);
    },
    [settings]
  );

  return (
    <fieldset className={clsx(styles.pings, props.className)}>
      <legend>PING</legend>
      <Number
        label="Intervall (ms)"
        max={59999}
        min={500}
        tooltip="500 bis 59999 Millisekunden"
        value={settings.pingInterval}
        onValue={onInterval}
      >
        <button onClick={onAdd}>Rechner hinzufügen</button>
      </Number>
      {settings.pingHosts.map((ip, i) => (
        <Ping
          key={i}
          index={i}
          ip={ip}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </fieldset>
  );
};
