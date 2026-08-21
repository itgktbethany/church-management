"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { alertSchema, AlertFormValues } from "@/lib/validations/alert-schema";
import { createAlert } from "@/actions/alert";
import { toast } from "sonner";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RecurringSchedulePicker } from "./recurring-schedule-picker";

export function CreateAlertDialog() {
  const [open, setOpen] = useState(false);
  const [cronExpression, setCronExpression] = useState("0 9 * * *");

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      title: "",
      message: "",
      sendPush: false,
      displayAt: "",
      targetType: "all",
      scheduleType: "one_time",
      cronExpression: "",
    },
  });

  const scheduleType = form.watch("scheduleType");

  async function onSubmit(data: AlertFormValues) {
    const result = await createAlert({
      ...data,
      targetType: "all",
      displayAt:
        data.scheduleType === "one_time" && data.displayAt
          ? new Date(data.displayAt)
          : null,
      cronExpression:
        data.scheduleType === "recurring" ? cronExpression : null,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Alert created successfully");
    form.reset();
    setCronExpression("0 9 * * *");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Alert
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Alert</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Church Announcement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write alert message..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Schedule Type */}
            <FormField
              control={form.control}
              name="scheduleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="one_time">
                        One-time — send once at a specific date &amp; time
                      </SelectItem>
                      <SelectItem value="recurring">
                        Recurring — send on a repeating schedule
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* One-time: date + time */}
            {scheduleType === "one_time" && (
              <FormField
                control={form.control}
                name="displayAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Send At</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Recurring: friendly time + repeat picker */}
            {scheduleType === "recurring" && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Repeat Schedule</p>
                <RecurringSchedulePicker
                  onChange={(cron) => setCronExpression(cron)}
                />
              </div>
            )}

            {/* Push toggle */}
            <FormField
              control={form.control}
              name="sendPush"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel>Send Push Notification</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Notify users&apos; devices when this alert fires.
                    </p>
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

            <Button type="submit" className="w-full">
              Create Alert
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}