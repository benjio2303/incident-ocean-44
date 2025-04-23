import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { IncidentCategory, IncidentFormData, SpecificDetails, IncidentLocation } from "@/models/incident";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIncidents } from "@/contexts/IncidentContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/contexts/TranslationContext";

const formSchema = z.object({
  clientTicketNumber: z.string().optional(),
  category: z.enum([
    "System",
    "Network",
    "Radar",
    "Radio",
    "Camera",
    "Laboratory",
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
  reportedTime: z.string().optional(),
  radioId: z.string().optional(),
  radarNumber: z.string().optional(),
  systemType: z.string().optional(),
});

const IncidentForm = ({ defaultReporterName }: { defaultReporterName?: string }) => {
  const { addIncident } = useIncidents();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("Other");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportedBy: defaultReporterName || "",
      category: "Other",
      isRecurring: false,
      reportedAt: new Date(),
      reportedTime: format(new Date(), "HH:mm"),
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const specificDetails: SpecificDetails = {};

    if (data.radioId) {
      specificDetails.radioId = data.radioId;
    }
    if (data.radarNumber) {
      specificDetails.radarNumber = data.radarNumber;
    }
    if (data.systemType) {
      specificDetails.systemType = data.systemType;
    }

    const formData: IncidentFormData = {
      clientTicketNumber: data.clientTicketNumber,
      category: data.category as IncidentCategory,
      description: data.description,
      isRecurring: data.isRecurring,
      reportedBy: data.reportedBy,
      location: data.location as IncidentLocation,
      reportedAt: data.reportedAt,
      reportedTime: data.reportedTime,
      specificDetails: Object.keys(specificDetails).length > 0 ? specificDetails : undefined
    };

    addIncident(formData);
    toast({
      title: t('success'),
      description: t('incidentSubmitted'),
    });
    form.reset();
  };

  const categoryChanged = (category: string) => {
    setSelectedCategory(category);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientTicketNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('clientTicketNumber')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('enterClientTicketNumber')} {...field} />
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
                <FormLabel>{t('reportedBy')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('yourName')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('description')}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t('describeIncident')} 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('category')}</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    categoryChanged(value);
                  }} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCategory')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="System">System</SelectItem>
                    <SelectItem value="Network">Network</SelectItem>
                    <SelectItem value="Radar">Radar</SelectItem>
                    <SelectItem value="Radio">Radio</SelectItem>
                    <SelectItem value="Camera">Camera</SelectItem>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isRecurring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t('isRecurring')}</FormLabel>
                  <FormDescription>
                    {t('recurringDescription')}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {selectedCategory === "Radio" && (
          <FormField
            control={form.control}
            name="radioId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Radio ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Radio ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedCategory === "Radar" && (
          <FormField
            control={form.control}
            name="radarNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Radar Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Radar Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedCategory === "System" && (
          <FormField
            control={form.control}
            name="systemType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>System Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter System Type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('incidentLocation')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('locationPlaceholder')} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="reportedAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('reportedDate')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>{t('pickDate')}</span>
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
                  {t('selectDateDescription')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reportedTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('reportedTime')}</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                      <Clock className="ml-auto h-4 w-4 opacity-50" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {generateTimeOptions().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {t('selectTimeDescription')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">{t('submit')}</Button>
      </form>
    </Form>
  );
};

export default IncidentForm;
