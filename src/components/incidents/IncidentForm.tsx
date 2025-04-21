import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { IncidentCategory, IncidentFormData, IncidentLocation } from "@/models/incident";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIncidents } from "@/contexts/IncidentContext";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  clientTicketNumber: z.string().optional(),
  category: z.enum([
    "System",
    "Network",
    "Radar",
    "Radio",
    "Camera",
    "Hardware",
    "Software",
    "Other"
  ] as [string, ...string[]]),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  isRecurring: z.boolean().default(false),
  reportedBy: z.string().min(2, {
    message: "Reporter name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  reportedAt: z.date(),
});

const IncidentForm = ({ defaultReporterName }: { defaultReporterName?: string }) => {
  const { addIncident } = useIncidents();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportedBy: defaultReporterName || "",
      category: "Other",
      isRecurring: false,
      reportedAt: new Date(),
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addIncident(data as IncidentFormData);
    toast({
      title: "Success!",
      description: "Your incident report has been submitted.",
    });
  };

  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="clientTicketNumber" className="block text-sm font-medium">
            Client Ticket Number (Optional)
          </label>
          <Input
            id="clientTicketNumber"
            {...register("clientTicketNumber")}
            placeholder="Enter client ticket number"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="reportedBy" className="block text-sm font-medium">
            Reported By
          </label>
          <Input
            id="reportedBy"
            {...register("reportedBy", { required: true })}
            placeholder="Your Name"
          />
          {errors.reportedBy && (
            <span className="text-danger text-xs">{errors.reportedBy.message}</span>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          {...register("description", { required: true })}
          placeholder="Describe the incident in detail"
        />
        {errors.description && (
          <span className="text-danger text-xs">{errors.description.message}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="space-y-1">
            <label htmlFor="category" className="block text-sm font-medium">
              Category
            </label>
            <Select {...register("category")} defaultValue="Other">
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="System">System</SelectItem>
                <SelectItem value="Network">Network</SelectItem>
                <SelectItem value="Radar">Radar</SelectItem>
                <SelectItem value="Radio">Radio</SelectItem>
                <SelectItem value="Camera">Camera</SelectItem>
                <SelectItem value="Hardware">Hardware</SelectItem>
                <SelectItem value="Software">Software</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isRecurring"
            {...register("isRecurring")}
          />
          <label
            htmlFor="isRecurring"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
          >
            Is Recurring?
          </label>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="location" className="block text-sm font-medium">
          מיקום התקלה
        </label>
        <Input
          id="location"
          {...register("location", { required: true })}
          placeholder="הזן מיקום חופשי — לדוג' 'נמל אשדוד ב', 'מגדל מס' 4', וכו'"
        />
        {errors.location && (
          <span className="text-danger text-xs">חובה להזין מיקום</span>
        )}
      </div>

      <FormField
        control={form.control}
        name="reportedAt"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Reported Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              Please select the date when the incident was reported.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default IncidentForm;
