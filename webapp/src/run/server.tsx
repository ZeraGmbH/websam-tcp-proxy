import { clsx } from "clsx";
import * as React from "react";

import { Ping } from "./ping";
import { Serial } from "./serial";
import styles from "./server.module.scss";
import { Tcp } from "./tcp";

import { SettingsContext } from "../settings";

interface IServerProps {
  className?: string;
  onClose(): void;
}

export const Server: React.FC<IServerProps> = (props) => {
  const [settings] = React.useContext(SettingsContext);

  const { onClose } = props;

  return (
    <div className={clsx(styles.server, props.className)}>
      <div>
        <h1>TCP/IP Server gestartet</h1>
        {settings.serials.map((_p, i) => (
          <Serial key={i} index={i} className={styles.row} />
        ))}
        {settings.proxies.map((_p, i) => (
          <Tcp key={i} index={i} className={styles.row} />
        ))}
        {settings.pingHosts.map((ip) => (
          <Ping key={ip} ip={ip} className={styles.row} />
        ))}
        <button onClick={onClose}>Stop</button>
      </div>
    </div>
  );
};
