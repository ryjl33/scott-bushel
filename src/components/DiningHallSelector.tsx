import { useDiningHall, DINING_HALLS, DiningHall } from "@/hooks/useDiningHall";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const DiningHallSelector = () => {
  const { selectedHall, setSelectedHall } = useDiningHall();

  return (
    <Select value={selectedHall} onValueChange={(value) => setSelectedHall(value as DiningHall)}>
      <SelectTrigger className="w-full max-w-[280px] mx-auto">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(DINING_HALLS).map(([key, name]) => (
          <SelectItem key={key} value={key}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
