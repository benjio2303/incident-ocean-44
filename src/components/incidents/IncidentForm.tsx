
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { IncidentCategory, IncidentLocation } from "@/models/incident";
import { useIncidents } from "@/contexts/IncidentContext";
import { useAuth } from "@/contexts/AuthContext";

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
  ]),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  isRecurring: z.boolean().default(false),
  reportedBy: z.string().min(2, {
    message: "Reported by must be at least 2 characters.",
  }),
  location: z.enum([
    "Nicosia HQ", 
    "Larnaca Airport", 
    "Paphos Airport", 
    "Remote Site A", 
    "Remote Site B", 
    "Remote Site C",
    "Limassol Port",
    "Unknown",
    "Other"
  ]),
  reportedAt: z.date(),
});

interface IncidentFormProps {
  defaultReporterName?: string;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ defaultReporterName = "" }) => {
  const { addIncident } = useIncidents();
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "System",
      isRecurring: false,
      reportedBy: defaultReporterName || user?.username || "",
      location: "Nicosia HQ",
      reportedAt: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Make sure all required fields are present
    const incidentData = {
      clientTicketNumber: values.clientTicketNumber,
      category: values.category,
      description: values.description,
      isRecurring: values.isRecurring,
      reportedBy: values.reportedBy,
      location: values.location,
      reportedAt: values.reportedAt,
    };
    
    addIncident(incidentData);
    navigate("/user/incidents");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="clientTicketNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Ticket Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="CLIENT-123" {...field} />
              </FormControl>
              <FormDescription>
                If the client has already raised a ticket, enter the ticket number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
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
              <FormDescription>
                Please select the most relevant category for this incident.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed description of the incident"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a clear and detailed description of the incident.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Is Recurring</FormLabel>
                <FormDescription>
                  Is this incident a recurring issue?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reportedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reported By</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                The name of the person reporting the incident.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Nicosia HQ">Nicosia HQ</SelectItem>
                  <SelectItem value="Larnaca Airport">Larnaca Airport</SelectItem>
                  <SelectItem value="Paphos Airport">Paphos Airport</SelectItem>
                  <SelectItem value="Remote Site A">Remote Site A</SelectItem>
                  <SelectItem value="Remote Site B">Remote Site B</SelectItem>
                  <SelectItem value="Remote Site C">Remote Site C</SelectItem>
                  <SelectItem value="Limassol Port">Limassol Port</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Please select the location where the incident occurred.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reportedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Reported At</FormLabel>
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
                      date > new Date()
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
    </Form>
  );
};

export default IncidentForm;
