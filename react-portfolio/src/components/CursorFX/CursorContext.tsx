import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type CursorVariant = 'default' | 'hover' | 'text' | 'chip';

export type CursorTarget = {
  variant: CursorVariant;
  rect: DOMRect | null;
  label?: string;
  fontSize?: number;
};

type CursorContextValue = {
  target: CursorTarget;
  setTarget: (target: CursorTarget) => void;
  clearTarget: () => void;
};

const CursorContext = createContext<CursorContextValue | null>(null);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [target, setTargetState] = useState<CursorTarget>({
    variant: 'default',
    rect: null,
    label: undefined,
  });

  const value = useMemo(
    () => ({
      target,
      setTarget: setTargetState,
      clearTarget: () =>
        setTargetState({
          variant: 'default',
          rect: null,
          label: undefined,
        }),
    }),
    [target]
  );

  return (
    <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
  );
}

export function useCursorContext() {
  const ctx = useContext(CursorContext);
  if (!ctx) {
    throw new Error('useCursorContext must be used inside CursorProvider');
  }
  return ctx;
}