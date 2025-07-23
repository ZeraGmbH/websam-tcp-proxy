import { clsx } from "clsx";
import * as React from "react";

import { SettingsContext } from "../settings";
import { Serial } from "./serial";
import styles from "./serials.module.scss";

interface ISerialsProps {
  className?: string;
}

export const Serials: React.FC<ISerialsProps> = (props) => {
  const [settings] = React.useContext(SettingsContext);

  const onAdd = React.useCallback(() => {
    const ports = [...settings.serials];

    ports.push({ device: "", port: 0 });

    settings.update("serials", ports);
  }, [settings]);

  return (
    <fieldset className={clsx(styles.serials, props.className)}>
      <legend>Lokale serielle Schnittstellen</legend>
      <button onClick={onAdd}>Schnittstelle hinzufügen</button>
      {settings.serials.map((_p, i) => (
        <Serial key={i} index={i} />
      ))}
    </fieldset>
  );
};
