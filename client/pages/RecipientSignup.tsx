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
  FormDescription,
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
    fullName: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z
      .string()
      .min(7)
      .max(20)
      .regex(phoneRegex, { message: "Enter a valid phone number" }),
    age: z.coerce.number().int().min(0).max(120),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Select gender",
    }),
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
      required_error: "Select blood group",
    }),
    address: z.string().min(10).max(300),
    needDetails: z.string().min(10).max(500),
    consent: z.literal(true, {
      errorMap: () => ({ message: "Consent is required" }),
    }),
  })
  .strict();

type FormValues = z.infer<typeof schema>;

export default function RecipientSignup() {
  const navigate = useNavigate();
  const defaultValues: FormValues = useMemo(
    () => ({
      fullName: "",
      email: "",
      phone: "",
      age: 0,
      gender: "male",
      bloodGroup: "O+",
      address: "",
      needDetails: "",
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
    const entityId = makeId("REC");
    try {
      const entry = { entityId, ...values };
      const key = "lifechain-recipients";
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      list.push(entry);
      localStorage.setItem(key, JSON.stringify(list));
      localStorage.setItem(
        "lifechain-recipient-profile",
        JSON.stringify(entry),
      );
    } catch {}
    navigate("/recipient/success", {
      state: {
        heading: "Recipient Registration Successful",
        entityId,
        name: values.fullName,
        badgesLabel: "Blood Group",
        badges: [values.bloodGroup],
        fields: [{ label: "Need", value: values.needDetails }],
        backPath: "/recipient/signup",
        homePath: "/recipient/home",
      },
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-4 py-6">
        <AppHeader />
        <header className="mb-4">
          <h1 className="text-xl font-semibold">Recipient Sign Up</h1>
          <p className="text-sm text-muted-foreground">
            Register to request an organ transplant
          </p>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <section className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={120} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
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
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Blood group</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(
                              [
                                "A+",
                                "A-",
                                "B+",
                                "B-",
                                "AB+",
                                "AB-",
                                "O+",
                                "O-",
                              ] as const
                            ).map((b) => (
                              <SelectItem key={b} value={b}>
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                name="needDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical need</FormLabel>
                    <FormDescription>
                      Briefly describe your medical condition and organ needed
                    </FormDescription>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

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
