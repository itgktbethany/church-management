"use client";
import {cn} from '@/lib/utils'
import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form";

const Form = FormProvider;

const FormField = Controller;

function FormItem({
  children,className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2",className)}>
      {children}
    </div>
  );
}

function FormLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <label className="text-sm font-medium">
      {children}
    </label>
  );
}

function FormControl({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

function FormMessage() {
  const {
    formState: { errors },
  } = useFormContext();

  const firstError = Object.values(errors)[0];

  if (!firstError) return null;

  return (
    <p className="text-sm text-red-500">
      {String(firstError.message)}
    </p>
  );
}

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
};