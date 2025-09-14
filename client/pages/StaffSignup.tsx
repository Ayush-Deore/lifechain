import { z } from "zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { makeId } from "@/lib/id";
import AppHeader from "@/components/AppHeader";

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

const schema = z
  .object({
    hospitalName: z.string().min(2).max(120),
    staffName: z.string().min(2).max(100),
    role: z.enum(["doctor", "nurse", "coordinator", "admin", "other"], {
      required_error: "Select role",
    }),
    email: z.string().email(),
    phone: z
      .string()
      .min(7)
      .max(20)
      .regex(phoneRegex, { message: "Enter a valid phone number" }),
    hospitalRegId: z.string().min(3).max(50),
    address: z.string().min(10).max(300),
    notes: z.string().max(500).optional(),
    consent: z.literal(true, {
      errorMap: () => ({ message: "Consent is required" }),
    }),
  })
  .strict();

type FormValues = z.infer<typeof schema>;

export default function StaffSignup() {
  const navigate = useNavigate();
  const defaultValues: FormValues = useMemo(
    () => ({
      hospitalName: "",
      staffName: "",
      role: "coordinator",
      email: "",
      phone: "",
      hospitalRegId: "",
      address: "",
      notes: "",
      consent: false,
    }),
    [],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onTouched",
  });

  const onSubmit = (values: FormValues) => {
    const entityId = makeId("HSP");
    try {
      const entry = { entityId, ...values };
      const key = "lifechain-staff";
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      list.push(entry);
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}
    navigate("/hospital-staff/success", {
      state: {
        heading: "Hospital Staff Registration Successful",
        entityId,
        nameLabel: "Staff Name",
        name: values.staffName,
        badgesLabel: "Role",
        badges: [values.role],
        fields: [
          { label: "Hospital", value: values.hospitalName },
          { label: "Reg. ID", value: values.hospitalRegId },
        ],
        backPath: "/hospital-staff/signup",
        homePath: "/admin/dashboard",
      },
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-4 py-6">
        <AppHeader />
        <header className="mb-4">
          <h1 className="text-xl font-semibold">Hospital Staff Sign Up</h1>
          <p className="text-sm text-muted-foreground">
            Register hospital staff for organ donation workflows
          </p>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="hospitalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="staffName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff name</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="nurse">Nurse</SelectItem>
                          <SelectItem value="coordinator">
                            Transplant Coordinator
                          </SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hospitalRegId"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Hospital registration ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the data policy and verify the information
                      provided is accurate
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Submitting"
                : "Submit registration"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
