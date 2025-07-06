import { clsx } from "clsx";
import * as React from "react";

import styles from "./proxies.module.scss";
import { Proxy } from "./proxy";

import { IProxyConfiguration } from "ipc";
import { SettingsContext } from "../settings";

interface IProxiesProps {
  className?: string;
}

export const Proxies: React.FC<IProxiesProps> = (props) => {
  const [settings, duplicates] = React.useContext(SettingsContext);

  const onAdd = React.useCallback(
    () =>
      settings.update("proxies", [
        ...settings.proxies,
        { endPoint: "", port: 0 },
      ]),
    [settings]
  );

  const onDelete = React.useCallback(
    (index: number) => {
      const proxies = [...settings.proxies];

      proxies.splice(index, 1);

      settings.update("proxies", proxies);
    },
    [settings]
  );

  const onUpdate = React.useCallback(
    (index: number, proxy: IProxyConfiguration) => {
      const proxies = [...settings.proxies];

      proxies[index] = proxy;

      settings.update("proxies", proxies);
    },
    [settings]
  );

  return (
    <fieldset className={clsx(styles.proxies, props.className)}>
      <legend>TCP/IP Proxies</legend>
      <button onClick={onAdd}>Proxy hinzufügen</button>
      {settings.proxies.map((p, i) => (
        <Proxy
          key={i}
          duplicate={duplicates[p.port] > 1}
          index={i}
          proxy={p}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </fieldset>
  );
};
