

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const ContactInformation = ({ form }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <FormField
      control={form.control}
      name="contactName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter Your Full Name"
              {...field}
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-white"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="contactPhone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter Your Mobile Number"
              type="tel"
              {...field}
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-white"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="contactEmail"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email Address</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter Your Email Address"
              type="email"
              {...field}
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-white"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

export default ContactInformation;
