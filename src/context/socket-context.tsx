"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useAuth } from "./auth-context"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [socketUserId, setSocketUserId] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    let newSocket: Socket | null = null

    const initSocket = async () => {
      if (!user) return

      const uid = user.uid
      const token = await user.getIdToken()


      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

      newSocket = io(url, {
        auth: {
          token
        },
        transports: ["websocket", "polling"],
        withCredentials: true
      })

      newSocket.on("connect", () => {
        setIsConnected(true)
        console.log("Socket connected")
      })

      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err)
        setIsConnected(false)
      })

      newSocket.on("disconnect", () => {
        setIsConnected(false)
        console.log("Socket disconnected")
      })

      setSocket(newSocket)
      setSocketUserId(uid)
    }

    if (user) {
      initSocket()
    }

    return () => {
      if (newSocket) {
        newSocket.off()
        newSocket.disconnect()
      }
    }
  }, [user])

  const effectiveSocket = user && socketUserId === user.uid ? socket : null
  const effectiveIsConnected = user && socketUserId === user.uid ? isConnected : false

  return (
    <SocketContext.Provider value={{ socket: effectiveSocket, isConnected: effectiveIsConnected }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}
