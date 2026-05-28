"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Pencil } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateDevotional } from "@/actions/devotional";

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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

type Props = {
  devotional: {
    id: string;
    title: string;
    verse: string;
    bibleReading: string | null;
    publishDate: string | null;
    content: string;
  };
};

export function EditDevotionalDialog({
  devotional,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const router =
    useRouter();

  const form =
    useForm<DevotionalFormValues>({
      resolver:
        zodResolver(
          devotionalSchema
        ),

      defaultValues: {
        title:
          devotional.title,

        verse:
          devotional.verse,

        bibleReading:
          devotional.bibleReading ?? "",

        publishDate:
          devotional.publishDate ?? "",

        content:
          devotional.content,
      },
    });

  async function onSubmit(
    data: DevotionalFormValues
  ) {
    const result =
      await updateDevotional({
        id:
          devotional.id,
        ...data,
      });

    if (!result.success) {
      toast.error(
        result.message
      );

      return;
    }

    toast.success(
      "Devotional updated"
    );

    router.refresh();

    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
        >
          <Pencil className="mr-2 h-4 w-4" />

          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit Devotional
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-4"
          >
            <FormField
              control={
                form.control
              }
              name="title"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Title
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={
                form.control
              }
              name="verse"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Verse
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={
                form.control
              }
              name="bibleReading"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Bible Reading
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={
                form.control
              }
              name="publishDate"
              render={({
                field,
              }) => (
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
              control={
                form.control
              }
              name="content"
              render={({
                field,
              }) => (
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
              type="submit"
              className="w-full"
            >
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}