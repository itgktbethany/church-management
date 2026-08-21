"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAlert } from "@/actions/alert";
import { alertSchema, AlertFormValues } from "@/lib/validations/alert-schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { RecurringSchedulePicker } from "./recurring-schedule-picker";

type Props = {
  alert: {
    id: string;
    title: string;
    message: string;
    sendPush: boolean;
    targetType: string;
    displayAt: Date | null;
    scheduleType?: string | null;
    cronExpression?: string | null;
  };
};

export function EditAlertDialog({ alert }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [cronExpression, setCronExpression] = useState(
    alert.cronExpression || "0 9 * * *"
  );

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      title: alert.title,
      message: alert.message,
      targetType: alert.targetType,
      sendPush: alert.sendPush,
      displayAt: alert.displayAt
        ? new Date(alert.displayAt).toISOString().slice(0, 16)
        : "",
      scheduleType: (alert.scheduleType as "one_time" | "recurring") ?? "one_time",
      cronExpression: cronExpression,
    },
  });

  const scheduleType = form.watch("scheduleType");

  async function onSubmit(data: AlertFormValues) {
    const result = await updateAlert({
      id: alert.id,
      title: data.title,
      message: data.message,
      sendPush: data.sendPush,
      targetType: data.targetType,
      displayAt: data.scheduleType === "one_time" && data.displayAt
        ? new Date(data.displayAt)
        : null,
      scheduleType: data.scheduleType,
      cronExpression: data.scheduleType === "recurring"
        ? cronExpression
        : null,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Alert updated");
    router.refresh();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Alert</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Schedule type */}
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
                        One-time event (send once at a specific date &amp; time)
                      </SelectItem>
                      <SelectItem value="recurring">
                        Recurring (send on a repeating schedule)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {scheduleType === "recurring" && (
               <div className="space-y-1">
                 <p className="text-sm font-medium">Repeat Schedule</p>
                 <RecurringSchedulePicker
                   defaultCron={alert.cronExpression || "0 9 * * *"}
                   onChange={(cron) => setCronExpression(cron)}
                 />
               </div>
            )}

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
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}