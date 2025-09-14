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
import { addToList } from "@/lib/storage";
import AppHeader from "@/components/AppHeader";

const organOptions = [
  { id: "heart", label: "Heart" },
  { id: "lungs", label: "Lungs" },
  { id: "liver", label: "Liver" },
  { id: "kidneys", label: "Kidneys" },
  { id: "pancreas", label: "Pancreas" },
  { id: "corneas", label: "Corneas" },
  { id: "skin", label: "Skin" },
  { id: "bone_marrow", label: "Bone Marrow" },
] as const;

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
    age: z.coerce
      .number()
      .int()
      .min(18, { message: "Minimum age is 18" })
      .max(100),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Select gender",
    }),
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
      required_error: "Select blood group",
    }),
    address: z.string().min(10).max(300),
    organs: z
      .array(z.string())
      .min(1, { message: "Select at least one organ" }),
    emergencyName: z.string().min(2).max(100),
    emergencyPhone: z
      .string()
      .min(7)
      .max(20)
      .regex(phoneRegex, { message: "Enter a valid phone number" }),
    consent: z.literal(true, {
      errorMap: () => ({ message: "Consent is required" }),
    }),
  })
  .strict();

type FormValues = z.infer<typeof schema>;

export default function OrganSignup() {
  const navigate = useNavigate();
  const defaultValues: FormValues = useMemo(
    () => ({
      fullName: "",
      email: "",
      phone: "",
      age: 18,
      gender: "male",
      bloodGroup: "O+",
      address: "",
      organs: [],
      emergencyName: "",
      emergencyPhone: "",
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
    const ts = new Date();
    const donorId = [
      "DON",
      String(ts.getFullYear()).slice(-2),
      String(ts.getMonth() + 1).padStart(2, "0"),
      String(ts.getDate()).padStart(2, "0"),
      Math.random().toString(36).slice(2, 6).toUpperCase(),
    ].join("");

    try {
      const profile = {
        donorId,
        fullName: values.fullName,
        organs: values.organs,
        bloodGroup: values.bloodGroup,
        email: values.email,
        phone: values.phone,
      };
      localStorage.setItem("lifechain-donor-profile", JSON.stringify(profile));
      addToList("lifechain-donors", profile);
    } catch {}

    navigate("/organ-donation/success", {
      state: {
        donorId,
        fullName: values.fullName,
        organs: values.organs,
        bloodGroup: values.bloodGroup,
      },
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-4 py-6">
        <AppHeader />
        <header className="mb-4">
          <h1 className="text-xl font-semibold">Organ Donor Sign Up</h1>
          <p className="text-sm text-muted-foreground">
            Register as a voluntary organ donor
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
                      <Input inputMode="text" autoComplete="name" {...field} />
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
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
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" min={18} max={100} {...field} />
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
            </section>

            <section className="space-y-3">
              <FormLabel>Organs willing to donate</FormLabel>
              <FormDescription>Select one or more options</FormDescription>
              <div className="grid grid-cols-2 gap-3">
                {organOptions.map((opt) => (
                  <FormField
                    key={opt.id}
                    control={form.control}
                    name="organs"
                    render={({ field }) => {
                      const checked = field.value?.includes(opt.id);
                      return (
                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3">
                          <FormControl>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(v) => {
                                const isChecked = Boolean(v);
                                if (isChecked)
                                  field.onChange([
                                    ...(field.value ?? []),
                                    opt.id,
                                  ]);
                                else
                                  field.onChange(
                                    (field.value ?? []).filter(
                                      (x: string) => x !== opt.id,
                                    ),
                                  );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {opt.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </section>

            <section className="space-y-4">
              <FormField
                control={form.control}
                name="emergencyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency contact name</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency contact phone</FormLabel>
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
                      I agree to donate organs and accept the data policy
                    </FormLabel>
                    <FormDescription>
                      Your information will be used to process your donor
                      registration
                    </FormDescription>
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
