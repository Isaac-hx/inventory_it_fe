import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DropdownMenu, DropdownMenuTrigger,DropdownMenuContent,DropdownMenuLabel,DropdownMenuGroup,DropdownMenuRadioGroup,DropdownMenuRadioItem, DropdownMenuItem
 } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Filter } from "lucide-react";
import { useState } from "react";



interface ISelectFilter {
    selectName:string;
    dataFilter:{
        value:string;
        key:string;
    }[]
    onFilterChange:(value:string | null)=>void
    selectedFilter:string
}


export default function SelectFilter({selectName,dataFilter,onFilterChange,selectedFilter}:ISelectFilter) {
  return (
    <Select value={selectedFilter} onValueChange={onFilterChange}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue   placeholder={`Select a ${selectName}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{selectName}</SelectLabel>
          {
            dataFilter.map(item=>(
                <SelectItem value={item.key}>{item.value}</SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}


interface IMenuFilter{
    defaultValueButton:string;
    menuValue:string;
    onChangeMenuValue:(value:string)=>void;
    menuItem:{
            key:string,
            value:string,
        }[]
    

}
export function MenuFilter({defaultValueButton,menuValue,onChangeMenuValue,menuItem}:IMenuFilter) {
  const [open, setOpen] = useState(false)
    
  const handleValueChange = (value: string) => {
    // PERBAIKAN: Jika nilai yang diklik sama dengan role saat ini, reset (""). Jika beda, ambil 'value' baru.
    onChangeMenuValue(value === menuValue ? "" : value)
    setOpen(false) // Menutup dropdown setelah memilih
  }
    
  return (    
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {/* PERBAIKAN: Tambahkan asChild agar tidak terjadi double button element */}
      <DropdownMenuTrigger asChild>
        <Button 
          // PERBAIKAN: Typo "crusor-pointer" -> "cursor-pointer"
          className={menuValue ? "bg-primary hover:bg-primary hover:text-white cursor-pointer text-white" : ""} 
          variant="outline"
        >
          <Filter className="h-4 w-4" /> {/* Opsional: memberi jarak icon */}
          {menuValue ? menuValue : defaultValueButton}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{menuValue}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={menuValue} onValueChange={handleValueChange}>
            {
                menuItem.map(item=>(
                    <DropdownMenuRadioItem value={item.key} >
                        {item.value}
                    </DropdownMenuRadioItem>
                ))
            }
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
