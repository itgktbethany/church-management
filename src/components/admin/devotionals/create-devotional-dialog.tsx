"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  devotionalSchema,
  DevotionalFormValues,
} from "@/lib/validations/devotional-schema";

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

import { createDevotional }
from "@/actions/devotional-action";

import { toast }
from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CreateDevotionalDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<DevotionalFormValues>({
    resolver: zodResolver(devotionalSchema),

    defaultValues: {
      title: "",
      verse: "",
      bibleReading: "",
      publishDate: "",
      content: "",
    },
  });

  async function onSubmit(
  data: DevotionalFormValues
) {
  const result =
    await createDevotional(data);

  if (!result.success) {
    toast.error(
      result.message
    );

    return;
  }

  toast.success(
    "Devotional created"
  );

  form.reset();

  setOpen(false);
}

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4"/>
          Create Devotional
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Create Devotional
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>

                  <FormControl>
                    <Input {...field}/>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="verse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verse</FormLabel>

                  <FormControl>
                    <Input {...field}/>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bibleReading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Bible Reading
                  </FormLabel>

                  <FormControl>
                    <Input {...field}/>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publishDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Publish Date
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Content
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      className="min-h-[250px]"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full"
              type="submit"
            >
              Save Devotional
            </Button>

          </form>
        </Form>

      </DialogContent>
    </Dialog>
  );
}