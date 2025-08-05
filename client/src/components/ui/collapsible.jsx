"use client"

import React, { forwardRef } from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { cn } from "../../lib/utils"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.Trigger

const CollapsibleContent = forwardRef(function CollapsibleContent(
  { className, children, ...props },
  ref
) {
  return (
    <CollapsiblePrimitive.Content
      ref={ref}
      className={cn(
        "overflow-hidden text-sm data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
        className
      )}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.Content>
  )
})

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
