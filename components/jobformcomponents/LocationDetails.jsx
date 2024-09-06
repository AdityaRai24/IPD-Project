// components/LocationDetails.js

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const LocationDetails = ({ form, indianStates, indianCities }) => (
  <div className="flex items-center justify-between gap-6">
    <FormField
      control={form.control}
      name="State"
      render={({ field }) => (
        <FormItem className="flex flex-col w-full">
          <FormLabel className="text-md font-medium text-gray-700">
            State
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between bg-white",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? indianStates.find((st) => st.value === field.value)?.label
                    : "States"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="States" />
                <CommandList>
                  <CommandEmpty>No State Found</CommandEmpty>
                  <CommandGroup>
                    {indianStates.map((state) => (
                      <CommandItem
                        value={state.label}
                        key={state.value}
                        onSelect={() => {
                          form.setValue("State", state.value);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            state.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {state.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="city"
      render={({ field }) => (
        <FormItem className="flex flex-col w-full">
          <FormLabel className="text-md font-medium text-gray-700">
            City
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between bg-white",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? indianCities.find((ct) => ct.value === field.value)?.label
                    : "Cities"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Cities" />
                <CommandList>
                  <CommandEmpty>No City Found</CommandEmpty>
                  <CommandGroup>
                    {indianCities.map((city) => (
                      <CommandItem
                        value={city.label}
                        key={city.value}
                        onSelect={() => {
                          form.setValue("city", city.value);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            city.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {city.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

export default LocationDetails;
