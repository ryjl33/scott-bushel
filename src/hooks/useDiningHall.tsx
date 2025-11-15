import { createContext, useContext, useState, ReactNode } from 'react';

export type DiningHall = 'scott' | 'morrill' | 'kennedy';

interface DiningHallContextType {
  selectedHall: DiningHall;
  setSelectedHall: (hall: DiningHall) => void;
}

const DiningHallContext = createContext<DiningHallContextType | undefined>(undefined);

export const DiningHallProvider = ({ children }: { children: ReactNode }) => {
  const [selectedHall, setSelectedHall] = useState<DiningHall>('scott');

  return (
    <DiningHallContext.Provider value={{ selectedHall, setSelectedHall }}>
      {children}
    </DiningHallContext.Provider>
  );
};

export const useDiningHall = () => {
  const context = useContext(DiningHallContext);
  if (!context) {
    throw new Error('useDiningHall must be used within DiningHallProvider');
  }
  return context;
};

export const DINING_HALLS: Record<DiningHall, string> = {
  scott: 'Scott Dining Hall',
  morrill: 'Morrill Dining Hall',
  kennedy: 'Kennedy Dining Hall',
};
