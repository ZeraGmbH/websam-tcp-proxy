import { clsx } from "clsx";
import * as React from "react";

import styles from "./status.module.scss";

interface IStatusProps {
  children?: React.ReactNode;
  className?: string;
  count?: number;
  error?: boolean;
  warning?: boolean;
}

export const Status: React.FC<IStatusProps> = (props) => {
  const { count } = props;

  return (
    <div
      className={clsx(styles.status, props.className)}
      title={count ? `${count}` : undefined}
    >
      <div
        className={clsx(
          styles.dot,
          props.error && styles.error,
          props.warning && styles.warning
        )}
      />
      <div>{props.children}</div>
    </div>
  );
};
