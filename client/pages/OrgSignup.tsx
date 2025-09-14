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
    orgType: z.enum(["NGO", "Government"], {
      required_error: "Select organization type",
    }),
    organizationName: z.string().min(2).max(120),
    registrationId: z.string().min(3).max(60),
    contactName: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z
      .string()
      .min(7)
      .max(20)
      .regex(phoneRegex, { message: "Enter a valid phone number" }),
    address: z.string().min(10).max(300),
    about: z.string().max(500).optional(),
    consent: z.literal(true, {
      errorMap: () => ({ message: "Consent is required" }),
    }),
  })
  .strict();

type FormValues = z.infer<typeof schema>;

export default function OrgSignup() {
  const navigate = useNavigate();
  const defaultValues: FormValues = useMemo(
    () => ({
      orgType: "NGO",
      organizationName: "",
      registrationId: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
      about: "",
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
    const entityId = makeId("ORG");
    try {
      const entry = { entityId, ...values };
      const key = "lifechain-organizations";
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      list.push(entry);
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}
    navigate("/organizations/success", {
      state: {
        heading: "Organization Registration Successful",
        entityId,
        nameLabel: "Organization",
        name: values.organizationName,
        badgesLabel: "Type",
        badges: [values.orgType],
        fields: [
          { label: "Reg. ID", value: values.registrationId },
          { label: "Contact", value: values.contactName },
        ],
        backPath: "/organizations/signup",
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
          <h1 className="text-xl font-semibold">NGO/Government Sign Up</h1>
          <p className="text-sm text-muted-foreground">
            Register your organization to collaborate on organ donation
          </p>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="orgType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NGO">NGO</SelectItem>
                          <SelectItem value="Government">Government</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Organization name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Primary contact</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" {...field} />
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
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
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
