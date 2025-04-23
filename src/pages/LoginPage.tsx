import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole, useAuth } from "@/contexts/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Lock, User, Globe } from "lucide-react";
import { loginStrings } from "@/i18n/loginStrings";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  role: z.enum(["user", "admin"], { required_error: "Please select a role" }),
});

type FormData = z.infer<typeof formSchema>;

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "he", label: "עברית" },
];

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [lang, setLang] = useState<"en" | "he">("en");
  const [darkMode, setDarkMode] = useState(false);

  React.useEffect(() => {
    const htmlEl = document.documentElement;
    if (darkMode) {
      htmlEl.classList.add("dark");
    } else {
      htmlEl.classList.remove("dark");
    }
  }, [darkMode]);

  React.useEffect(() => {
    document.body.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

  const strings = loginStrings[lang];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "user",
    },
  });

  const onSubmit = (data: FormData) => {
    login(data.username, data.password, data.role as UserRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cy-blue via-cy-lightBlue to-cy-gray dark:from-cy-darkGray dark:via-cy-darkBlue dark:to-gray-900 transition-all duration-500">
      <div className="w-full max-w-md px-4">

        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-2 items-center">
            <Globe />
            <select
              value={lang}
              onChange={e => setLang(e.target.value as "en" | "he")}
              className="px-2 py-1 rounded border text-sm bg-white/60 backdrop-blur-md dark:bg-cy-darkGray/60"
              aria-label={strings.language}
            >
              {LANGUAGES.map(l => (
                <option value={l.code} key={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cy-darkBlue dark:text-cy-lightBlue tracking-tight drop-shadow card-gradient bg-gradient-to-tr from-cy-darkBlue via-cy-blue to-cy-lightBlue bg-clip-text text-transparent">
            {strings.title}
          </h1>
          <p className="text-gray-600 dark:text-cy-gray/80 mt-2">{strings.subtitle}</p>
        </div>

        <Card className="glass-morphism animate-[fade-in_0.7s_ease] shadow-xl border-none bg-white/70 dark:bg-cy-darkGray/70 transition-colors" style={{ backdropFilter: 'blur(12px)' }}>
          <CardHeader>
            <CardTitle className="tracking-wide font-semibold text-xl text-cy-darkBlue dark:text-cy-lightBlue">
              {strings.login}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-300">
              {strings.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{strings.username}</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cy-darkBlue/50 dark:text-cy-lightBlue/60" size={18} />
                        <FormControl>
                          <Input
                            placeholder={strings.username}
                            className="pl-10 bg-white/80 dark:bg-cy-darkGray/40 focus:ring-cy-blue dark:focus:ring-cy-lightBlue shadow-sm"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{strings.password}</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cy-darkBlue/50 dark:text-cy-lightBlue/60" size={18} />
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={strings.password}
                            className="pl-10 bg-white/80 dark:bg-cy-darkGray/40 focus:ring-cy-blue dark:focus:ring-cy-lightBlue shadow-sm"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{strings.role}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/80 dark:bg-cy-darkGray/40">
                            <SelectValue placeholder={strings.selectRole} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">{lang === "he" ? "משתמש" : "User"}</SelectItem>
                          <SelectItem value="admin">{lang === "he" ? "אדמין" : "Admin"}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full mt-4 bg-cy-blue hover:bg-cy-darkBlue text-white tracking-wide font-semibold shadow-lg transition-all"
                >
                  {strings.signIn}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-gray-500 dark:text-gray-300 text-center">
              <p>{strings.adminUsers}</p>
              <p>
                <strong>ofek</strong>, <strong>amit</strong>,
                <strong>engineer</strong> {lang === "he" ? "או" : "or"} <strong>denis</strong> {lang === "he" ? "עם סיסמה" : "with password"} <strong>Aa123456</strong>
              </p>
              <p className="mt-2">{strings.userSection}</p>
              <p>{strings.userExample}</p>
              <p className="mt-1">{strings.anyUser}</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
