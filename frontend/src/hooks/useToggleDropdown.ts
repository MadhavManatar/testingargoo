import { useEffect, useRef, useState } from 'react';

export const useToggleDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownList, setIsDropdownList] = useState<{
    isOpen: boolean;
    id: number | null;
  }>({
    isOpen: false,
    id: null,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleDropdownForList = ({
    id,
    isOpen,
  }: {
    id: number | null;
    isOpen: boolean;
  }) => {
    setIsDropdownList({ id, isOpen });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownList({
        id: null,
        isOpen: false,
      });
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    isDropdownOpen,
    toggleDropdown,
    dropdownRef,
    toggleDropdownForList,
    isDropdownList,
    setIsDropdownOpen,
  };
};
