import { Topbar } from "@/components/topbar"
import Image from "next/image"

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />

      <div className="flex-1 flex items-center justify-center p-8 pt-6">
        <div className="relative w-full max-w-4xl">
          <Image
            src="/aws-serverless-projects-diagram.png"
            alt="AWS Serverless Projects Diagram"
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg shadow-lg"
            priority
          />
        </div>
      </div>
    </div>
  )
}

