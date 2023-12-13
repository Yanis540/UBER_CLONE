"use client"
 
import {ReactNode} from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
 
export function ThemeProvider({ children,  }: {children:ReactNode|ReactNode[]}) {
  return (
    <NextThemesProvider
        // {...props}  
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange 
    >
        {children}
    </NextThemesProvider>
    )
}