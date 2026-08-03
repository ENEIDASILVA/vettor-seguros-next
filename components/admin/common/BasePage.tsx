import { ReactNode } from "react";

import PageCard from "./PageCard";
import PageHeader from "./PageHeader";

type Props = {
  title: string;
  description?: string;

  action?: {
    label: string;
    href: string;
    icon?: any;
  };

  toolbar?: ReactNode;

  children: ReactNode;
};

export default function BasePage({
  title,
  description,
  action,
  toolbar,
  children,
}: Props) {
  return (
    <>
      <PageHeader
        title={title}
        description={description}
        action={action}
      />

      <PageCard className="mt-6">
        {toolbar && (
          <div className="mb-6">
            {toolbar}
          </div>
        )}

        {children}
      </PageCard>
    </>
  );
}