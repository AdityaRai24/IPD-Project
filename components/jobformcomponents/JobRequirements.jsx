import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Select from "react-select";
import RichTextEditor from "@/components/RichTextEditor";

const JobRequirements = ({
  form,
  skilloptions,
  selectedOptions,
  handleoptionChange,
}) => (
  <div className="flex flex-col gap-6">
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
              handleoptionChange(selectedOption);
              field.onChange(selectedOption);
            }}
            options={skilloptions}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select skills required for the job"
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
            <RichTextEditor
              content={field.value}
              onEditorSave={(html) => {
                field.onChange(html);
                form.setValue("jobDescription", html);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

export default JobRequirements;