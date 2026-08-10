"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="space-y-1">
        <p className="font-medium">Appearance</p>
        <p className="text-sm text-muted-foreground">
          Customize how FaithFlow looks on your device.
        </p>
      </div>
      
      <div className="flex bg-muted rounded-full p-1 w-full sm:w-auto">
        <Button
          variant={theme === "light" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTheme("light")}
          className="flex-1 sm:flex-none rounded-full h-8"
        >
          <Sun className="h-4 w-4 mr-2" />
          Light
        </Button>
        <Button
          variant={theme === "dark" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTheme("dark")}
          className="flex-1 sm:flex-none rounded-full h-8"
        >
          <Moon className="h-4 w-4 mr-2" />
          Dark
        </Button>
        <Button
          variant={theme === "system" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTheme("system")}
          className="flex-1 sm:flex-none rounded-full h-8"
        >
          System
        </Button>
      </div>
    </div>
  )
}
