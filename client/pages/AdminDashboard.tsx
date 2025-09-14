import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AppHeader from "@/components/AppHeader";
import ProfileButton from "@/components/ProfileButton";

const DONORS_KEY = "lifechain-donors";
const RECIPIENTS_KEY = "lifechain-recipients";

export default function AdminDashboard() {
  const [donors, setDonors] = useState<any[]>([]);
  const [recipients, setRecipients] = useState<any[]>([]);

  useEffect(() => {
    try {
      setDonors(JSON.parse(localStorage.getItem(DONORS_KEY) || "[]"));
    } catch {}
    try {
      setRecipients(JSON.parse(localStorage.getItem(RECIPIENTS_KEY) || "[]"));
    } catch {}
  }, []);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <AppHeader
          rightSlot={
            <ProfileButton
              role="admin"
              name={
                JSON.parse(localStorage.getItem("lifechain-admin") || "{}")
                  ?.name || "Admin"
              }
              onLogout={() => {
                try {
                  localStorage.removeItem("lifechain-admin");
                } catch {}
              }}
            />
          }
        />
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>

        <Card>
          <CardHeader>
            <CardTitle>Donors</CardTitle>
            <CardDescription>Total: {donors.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Donor ID</TableHead>
                  <TableHead>Blood</TableHead>
                  <TableHead>Organs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donors.map((d) => (
                  <TableRow key={d.donorId}>
                    <TableCell>{d.fullName}</TableCell>
                    <TableCell className="font-mono">{d.donorId}</TableCell>
                    <TableCell>{d.bloodGroup}</TableCell>
                    <TableCell>
                      {(d.organs || [])
                        .map((o: string) => o.replace(/_/g, " "))
                        .join(", ")}
                    </TableCell>
                  </TableRow>
                ))}
                {!donors.length && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-sm text-muted-foreground"
                    >
                      No donors
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recipients</CardTitle>
            <CardDescription>Total: {recipients.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Blood</TableHead>
                  <TableHead>Need</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipients.map((r) => (
                  <TableRow key={r.entityId}>
                    <TableCell>{r.fullName}</TableCell>
                    <TableCell>{r.bloodGroup}</TableCell>
                    <TableCell>{r.needDetails}</TableCell>
                  </TableRow>
                ))}
                {!recipients.length && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-sm text-muted-foreground"
                    >
                      No recipients
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
