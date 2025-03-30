import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Rsvp } from "@shared/schema";

export default function Dashboard() {
  const { data: rsvps, isLoading, error } = useQuery<Rsvp[]>({
    queryKey: ["/api/rsvps"],
  });

  // Format date function
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">
          View all RSVP submissions for the Boston University PMP/CAPM review sessions.
        </p>

        <Card>
          <CardHeader className="bg-primary/5">
            <CardTitle>RSVP Submissions</CardTitle>
            <CardDescription>
              Total submissions: {isLoading ? "Loading..." : rsvps?.length || 0}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">
                Error loading RSVP data. Please try again.
              </div>
            ) : rsvps?.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No RSVP submissions yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Certification</TableHead>
                      <TableHead>Registration Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rsvps?.map((rsvp) => (
                      <TableRow key={rsvp.id}>
                        <TableCell className="font-medium">
                          {rsvp.firstName} {rsvp.lastName}
                        </TableCell>
                        <TableCell>{rsvp.email}</TableCell>
                        <TableCell>{rsvp.certification}</TableCell>
                        <TableCell>{formatDate(rsvp.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}