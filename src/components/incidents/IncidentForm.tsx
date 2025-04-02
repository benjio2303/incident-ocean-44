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
import { CalendarIcon, Clock } from "lucide-react";
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
import { IncidentCategory } from "@/models/incident";

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
  location: z.string().min(1, {
    message: "Location is required",
  }),
  radioId: z.string().optional(),
  serverType: z.string().optional(),
  radarNumber: z.string().optional(),
  networkSystemType: z.string().optional(),
  incidentTime: z.string().default("12:00"),
});

type FormData = z.infer<typeof formSchema>;

interface IncidentFormProps {
  defaultReporter?: string;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ defaultReporter = "" }) => {
  const { addIncident } = useIncidents();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientTicketNumber: "",
      category: undefined,
      description: "",
      isRecurring: false,
      reportedBy: defaultReporter,
      reportedAt: new Date(),
      location: "",
      incidentTime: "12:00",
    },
  });
  
  const watchCategory = form.watch("category");
  
  React.useEffect(() => {
    if (watchCategory) {
      setSelectedCategory(watchCategory as IncidentCategory);
    }
  }, [watchCategory]);
  
  const onSubmit = (data: FormData) => {
    const reportDate = new Date(data.reportedAt);
    const [hours, minutes] = data.incidentTime.split(":").map(Number);
    reportDate.setHours(hours, minutes);
    
    let additionalDetails = "";
    if (data.category === "Radio" && data.radioId) {
      additionalDetails = `Radio ID: ${data.radioId}`;
    } else if (data.category === "System" && data.serverType) {
      additionalDetails = `Server Type: ${data.serverType}`;
    } else if (data.category === "Radar" && data.radarNumber) {
      additionalDetails = `Radar Number: ${data.radarNumber}`;
    } else if (data.category === "Network" && data.networkSystemType) {
      additionalDetails = `Network System Type: ${data.networkSystemType}`;
    }
    
    const enhancedDescription = additionalDetails 
      ? `${data.description}\n\n${additionalDetails}`
      : data.description;
    
    const newIncident = addIncident({
      clientTicketNumber: data.clientTicketNumber,
      category: data.category,
      reportedAt: reportDate.toISOString(),
      description: enhancedDescription,
      isRecurring: data.isRecurring,
      reportedBy: data.reportedBy,
      location: data.location,
    });
    
    navigate(`/user/incidents/${newIncident.id}`);
  };
  
  const renderCategorySpecificFields = () => {
    if (!selectedCategory) return null;
    
    switch (selectedCategory) {
      case "Radio":
        return (
          <FormField
            control={form.control}
            name="radioId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Radio ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the Radio ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "System":
        return (
          <FormField
            control={form.control}
            name="serverType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Server Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the server type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "Radar":
        return (
          <FormField
            control={form.control}
            name="radarNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Radar Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the radar number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "Network":
        return (
          <FormField
            control={form.control}
            name="networkSystemType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Network System Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the network system type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      default:
        return null;
    }
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
              
              {renderCategorySpecificFields()}
              
              <FormField
                control={form.control}
                name="reportedAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Incident</FormLabel>
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
                name="incidentTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time of Incident</FormLabel>
                    <div className="flex items-center">
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="flex-1"
                        />
                      </FormControl>
                      <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                    </div>
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
                    <FormControl>
                      <Input placeholder="Enter incident location" {...field} />
                    </FormControl>
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
