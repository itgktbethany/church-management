"use client"

import * as React from "react"
import { Type } from "lucide-react"
import { useFontSize } from "@/components/font-size-provider"

import { Button } from "@/components/ui/button"

export function FontSizeToggle() {
  const { fontSize, setFontSize } = useFontSize()

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="space-y-1">
        <p className="font-medium">Text Size</p>
        <p className="text-sm text-muted-foreground">
          Adjust the font size to make text easier to read.
        </p>
      </div>
      
      <div className="flex bg-muted rounded-full p-1 w-full sm:w-auto">
        <Button
          variant={fontSize === "normal" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFontSize("normal")}
          className="flex-1 sm:flex-none rounded-full h-8"
        >
          <Type className="h-4 w-4 mr-2" />
          Normal
        </Button>
        <Button
          variant={fontSize === "large" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFontSize("large")}
          className="flex-1 sm:flex-none rounded-full h-8"
        >
          <Type className="h-4 w-4 mr-2 scale-110" />
          Large
        </Button>
        <Button
          variant={fontSize === "xlarge" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFontSize("xlarge")}
          className="flex-1 sm:flex-none rounded-full h-8"
        >
          <Type className="h-4 w-4 mr-2 scale-125" />
          Extra Large
        </Button>
      </div>
    </div>
  )
}
