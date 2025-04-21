
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
import { Lock, User, Moon, Sun, Globe } from "lucide-react";
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

  // משנה את ה־class של ה־html למצב כהה/בהיר
  React.useEffect(() => {
    const htmlEl = document.documentElement;
    if (darkMode) {
      htmlEl.classList.add("dark");
    } else {
      htmlEl.classList.remove("dark");
    }
  }, [darkMode]);

  // שינוי כיוון הטקסט בהתאם לשפה
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
    <div className="min-h-screen flex items-center justify-center bg-cy-gray">
      <div className="w-full max-w-md px-4">

        <div className="flex justify-between items-center mb-3">
          {/* כפתור לשפה */}
          <div className="flex gap-2 items-center">
            <Globe />
            <select
              value={lang}
              onChange={e => setLang(e.target.value as "en" | "he")}
              className="px-2 py-1 rounded border text-sm"
              aria-label={strings.language}
            >
              {LANGUAGES.map(l => (
                <option value={l.code} key={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
          {/* כפתור תאורה */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={darkMode ? strings.light : strings.dark}
            onClick={() => setDarkMode(val => !val)}
            className="ml-2"
          >
            {darkMode ? <Sun /> : <Moon />}
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cy-darkBlue">{strings.title}</h1>
          <p className="text-gray-600 mt-2">{strings.subtitle}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{strings.login}</CardTitle>
            <CardDescription>
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
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <FormControl>
                          <Input
                            placeholder={strings.username}
                            className="pl-10"
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
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={strings.password}
                            className="pl-10"
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
                          <SelectTrigger>
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

                <Button type="submit" className="w-full mt-4">
                  {strings.signIn}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-gray-500 text-center">
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
