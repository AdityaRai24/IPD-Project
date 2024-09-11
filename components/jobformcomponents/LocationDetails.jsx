import React, { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";

import { State, City } from "country-state-city";

const LocationDetails = ({ form }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isRemote, setIsRemote] = useState(false);

  useEffect(() => {
    const INStates = State.getStatesOfCountry("IN");
    setStates(INStates);
  }, []);

  useEffect(() => {
    const selectedState = form.getValues("state");
    if (selectedState) {
      const stateCities = City.getCitiesOfState("IN", selectedState);
      setCities(stateCities);
    } else {
      setCities([]);
    }
  }, [form.watch("state")]);

  useEffect(() => {
    if (isRemote) {
      form.setValue("state", "");
      form.setValue("city", "");
      form.clearErrors(["state", "city"]);
    }
  }, [isRemote, form]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="isRemote"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center text-gray-700 justify-between rounded-lg border px-3 py-2">
            <div className="space-y-0.5">
              <FormLabel className="text-md">Remote Work</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked) {
                    form.setValue("state", "");
                    form.setValue("city", "");
                    form.clearErrors(["state", "city"]);
                  }
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      {!form.watch("isRemote") && (
        <div className="flex items-center justify-between gap-6">
          <FormField
            control={form.control}
            name="state"
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
                          ? states.find((st) => st.isoCode === field.value)?.name
                          : "Select State"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search state..." />
                      <CommandList>
                        <CommandEmpty>No state found.</CommandEmpty>
                        <CommandGroup>
                          {states.map((state) => (
                            <CommandItem
                              key={state.isoCode}
                              value={state.name}
                              onSelect={() => {
                                form.setValue("state", state.isoCode);
                                form.setValue("city", "");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  state.isoCode === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {state.name}
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
                        disabled={!form.getValues("state")}
                      >
                        {field.value
                          ? cities.find((city) => city.name === field.value)?.name
                          : "Select City"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search city..." />
                      <CommandList>
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandGroup>
                          {cities.map((city) => (
                            <CommandItem
                              key={city.name}
                              value={city.name}
                              onSelect={() => {
                                form.setValue("city", city.name);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  city.name === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {city.name}
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
      )}
      {!form.watch("isRemote") && (!form.watch("state") || !form.watch("city")) && (
        <p className="text-red-500 text-sm mt-2">
          Please select both State and City, or choose Remote Work.
        </p>
      )}
    </div>
  );
};

export default LocationDetails;