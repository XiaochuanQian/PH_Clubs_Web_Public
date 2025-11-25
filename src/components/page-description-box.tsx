import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface PageDescriptionBoxProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

export function PageDescriptionBox({ title, description, href, icon }: PageDescriptionBoxProps) {
  return (
    <Link href={href} className="block hover:no-underline">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}

