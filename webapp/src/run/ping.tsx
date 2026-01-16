import { clsx } from "clsx";
import { sys } from "ping";
import * as React from "react";

import styles from "./ping.module.scss";
import { Status } from "./status";

import { SettingsContext } from "../settings";

interface IPingProps {
  className?: string;
  ip: string | undefined;
}

export const Ping: React.FC<IPingProps> = (props) => {
  const [settings] = React.useContext(SettingsContext);

  const { ip } = props;

  const [tries, setTries] = React.useState(0);
  const [active, setActive] = React.useState(true);
  const [ok, setOk] = React.useState(false);

  React.useEffect(() => () => setActive(false), []);

  React.useEffect(() => {
    if (!active || !ip) return;

    sys.probe(
      ip,
      (alive) => {
        setOk(alive === true);

        window.setTimeout(
          () => setTries(tries + 1),
          settings.pingInterval ?? 0
        );
      },
      { timeout: 1000 }
    );
  }, [active, ip, settings, tries]);

  return (
    ip &&
    (settings.pingInterval ?? 0) > 0 && (
      <div className={clsx(styles.ping, props.className)}>
        <Status error={!ok}>PING zu {ip}</Status>
      </div>
    )
  );
};
