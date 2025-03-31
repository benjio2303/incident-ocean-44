
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useIncidents } from "@/contexts/IncidentContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { IncidentCategory, IncidentLocation } from "@/models/incident";

const formSchema = z.object({
  clientTicketNumber: z.string().min(1, {
    message: "Client ticket number is required",
  }),
  category: z.enum(["System", "Network", "Radio", "Radar", "Other"], {
    required_error: "Please select a category",
  }),
  reportedAt: z.date({
    required_error: "Please select a date and time",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }).max(500, {
    message: "Description must not exceed 500 characters",
  }),
  isRecurring: z.boolean().default(false),
  reportedBy: z.string().min(1, {
    message: "Reporter name is required",
  }),
  location: z.enum(["Nicosia HQ", "Larnaca Airport", "Paphos Airport", "Limassol Port", "Remote Site A", "Remote Site B", "Other"], {
    required_error: "Please select a location",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface IncidentFormProps {
  defaultReporter?: string;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ defaultReporter = "" }) => {
  const { addIncident } = useIncidents();
  const navigate = useNavigate();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientTicketNumber: "",
      category: undefined,
      description: "",
      isRecurring: false,
      reportedBy: defaultReporter,
      reportedAt: new Date(),
      location: undefined,
    },
  });
  
  const onSubmit = (data: FormData) => {
    const newIncident = addIncident({
      clientTicketNumber: data.clientTicketNumber,
      category: data.category,
      reportedAt: data.reportedAt.toISOString(),
      description: data.description,
      isRecurring: data.isRecurring,
      reportedBy: data.reportedBy,
      location: data.location,
    });
    
    // Redirect to the incident details page
    navigate(`/user/incidents/${newIncident.id}`);
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Report a New Incident</CardTitle>
        <CardDescription>
          Fill in the details below to report a new incident in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="clientTicketNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client System Ticket Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client ticket number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="System">System</SelectItem>
                        <SelectItem value="Network">Network</SelectItem>
                        <SelectItem value="Radio">Radio</SelectItem>
                        <SelectItem value="Radar">Radar</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reportedAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date & Time of Incident</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full text-left font-normal",
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                        <SelectItem value="Limassol Port">Limassol Port</SelectItem>
                        <SelectItem value="Remote Site A">Remote Site A</SelectItem>
                        <SelectItem value="Remote Site B">Remote Site B</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                      <Input placeholder="Enter name of reporter" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-8">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Is this a recurring incident?</FormLabel>
                      <FormDescription>
                        Check if this issue has happened before
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description of the incident"
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Please include all relevant details about the incident
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/user/dashboard")}>
                Cancel
              </Button>
              <Button type="submit">Submit Incident</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default IncidentForm;
