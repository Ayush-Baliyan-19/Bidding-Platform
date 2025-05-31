import { TransporterForm } from "../components/TransporterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateTransporterPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/transporters">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Transporter</h1>
          <p className="text-muted-foreground">
            Create a new transporter profile
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transporter Information</CardTitle>
        </CardHeader>
        <CardContent>
          <TransporterForm />
        </CardContent>
      </Card>
    </div>
  );
}
