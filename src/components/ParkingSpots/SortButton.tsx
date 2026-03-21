
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortButtonProps {
  onSort: () => void;
}

const SortButton = ({ onSort }: SortButtonProps) => {
  return (
    <Button
      onClick={onSort}
      className="flex items-center gap-2 bg-white/90 backdrop-blur-sm 
        hover:bg-parknav-light-blue/10 
        hover:border-parknav-blue 
        transition-all duration-300 
        group"
    >
      <ArrowUpDown 
        className="h-4 w-4 
          text-parknav-neutral-gray 
          group-hover:text-parknav-blue 
          transition-colors duration-300" 
      />
      <span className="text-parknav-neutral-gray group-hover:text-parknav-blue transition-colors duration-300">
        Sort by Distance
      </span>
    </Button>
  );
};

export default SortButton;
