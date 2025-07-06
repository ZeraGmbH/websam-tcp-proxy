import { clsx } from "clsx";
import * as React from "react";

import { IProxyConfiguration } from "ipc";
import { Port } from "./number";
import styles from "./proxy.module.scss";

interface IProxyProps {
  className?: string;
  duplicate: boolean;
  index: number;
  onDelete(index: number): void;
  onUpdate(index: number, proxy: IProxyConfiguration): void;
  proxy: IProxyConfiguration;
}

export const Proxy: React.FC<IProxyProps> = (props) => {
  const { proxy, index, onDelete, onUpdate } = props;
  const { port, endPoint } = proxy;

  const doDelete = React.useCallback(() => onDelete(index), [index, onDelete]);

  const setPort = React.useCallback(
    (port: number | null) => {
      if (port == null) port = 0;

      onUpdate(index, { ...proxy, port });
    },
    [index, onUpdate, proxy]
  );

  const setEndpoint = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) =>
      onUpdate(index, { ...proxy, endPoint: ev.target.value }),
    [index, onUpdate, proxy]
  );

  return (
    <div className={clsx(styles.proxy, props.className)}>
      <button onClick={doDelete}>Löschen</button>
      <input
        placeholder="(Server:Port)"
        type="text"
        value={endPoint}
        onChange={setEndpoint}
      />
      <div className={clsx(styles.port, props.duplicate && styles.bad)}>
        <Port port={port} onPort={setPort} />
      </div>
    </div>
  );
};
