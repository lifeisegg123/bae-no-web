import { ComponentProps, Suspense } from "react";

import { useMounted } from "src/hooks/useMounted";

const SSRSafeSuspense = ({
  children,
  fallback,
}: ComponentProps<typeof Suspense>) => {
  const isMounted = useMounted();

  if (isMounted) {
    return <Suspense fallback={fallback}>{children}</Suspense>;
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{fallback}</>;
};

export default SSRSafeSuspense;
