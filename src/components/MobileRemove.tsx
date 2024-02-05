import { type FC, type PropsWithChildren } from "react";

export const MobileRemove: FC<PropsWithChildren> = ({ children }) => {
  return <div className="hidden md:block">{children}</div>;
};
