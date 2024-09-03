// components/JobRequirements.js

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import Select from "react-select";
import RichTextEditor from "@/components/RichTextEditor";

const JobRequirements = ({ form, skilloptions, selectedOptions, handleChange }) => (
  <div>
    <FormField
      control={form.control}
      name="requiredskills"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Skills Required</FormLabel>
          <Select
            isMulti
            value={selectedOptions}
            onChange={(selectedOption) => {
              handleChange(selectedOption);
              field.onChange(selectedOption);
            }}
            options={skilloptions}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select skills required for the job"
            menuPortalTarget={document.body} // Renders the dropdown at the end of the document
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensures the dropdown appears above other elements
              control: (base) => ({
                ...base,
                zIndex: 1, // Keeps the select input above the text area
              }),
            }}
          />
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="jobDescription"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Job Description</FormLabel>
          <FormControl>
            <RichTextEditor value={field.value} onChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

export default JobRequirements;
