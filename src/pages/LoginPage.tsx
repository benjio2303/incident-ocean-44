
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";

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
  const [lang, setLang] = useState<"en" | "he">("he");
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
        {/* באנר עליון חדש להרגשה מקצועית */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/favicon.ico"
            alt="CY Logo"
            className="w-16 h-16 mb-2 drop-shadow"
            style={{ filter: "drop-shadow(0 0 8px #428df5AA)" }}
          />
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-tl from-cy-darkBlue via-cy-lightBlue to-cy-blue bg-clip-text text-transparent mb-0.5">
            {strings.title}
          </h1>
          <p className="text-gray-600 dark:text-cy-gray/80 font-medium">{strings.subtitle}</p>
        </div>
        
        {/* טאבים: התחברות / פרטי התחברות */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full mb-3 grid grid-cols-2 rounded-lg shadow">
            <TabsTrigger className="rounded-l-lg data-[state=active]:bg-cy-blue/90 data-[state=active]:text-white" value="login">
              {strings.login}
            </TabsTrigger>
            <TabsTrigger className="rounded-r-lg data-[state=active]:bg-cy-darkBlue/80 data-[state=active]:text-white" value="info">
              {lang === "he" ? "להסבר ודוגמאות" : "Help / Examples"}
            </TabsTrigger>
          </TabsList>
          {/* טאב 1: התחברות */}
          <TabsContent value="login">
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
              <CardFooter className="flex justify-center mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <span>🔒</span>
                  {lang === "he" ? "פרטי הרשאה ודוגמות -->" : "See login examples -->"}
                </span>
              </CardFooter>
            </Card>

            {/* סרגל שפות למעלה מימין */}
            <div className="absolute top-7 right-7">
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
          </TabsContent>

          {/* טאב 2: הסבר/דוגמאות משתמשים */}
          <TabsContent value="info">
            <Card className="glass-morphism shadow-xl border-none p-6 bg-white/90 dark:bg-cy-darkGray/90 animate-[fade-in_0.7s_ease]">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-cy-darkBlue dark:text-cy-lightBlue">
                  {lang === "he" ? "פרטי התחברות לדוגמה" : "Login Examples"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-800 dark:text-gray-200 space-y-2">
                  <div>
                    <strong>{strings.adminUsers}</strong>
                    <p>
                      <span className="font-mono rounded px-1 bg-gray-100 dark:bg-gray-700">ofek</span>,{" "}
                      <span className="font-mono rounded px-1 bg-gray-100 dark:bg-gray-700">amit</span>,{" "}
                      <span className="font-mono rounded px-1 bg-gray-100 dark:bg-gray-700">engineer</span>{" "}
                      {lang === "he" ? "או" : "or"}{" "}
                      <span className="font-mono rounded px-1 bg-gray-100 dark:bg-gray-700">denis</span>{" "}
                      {lang === "he" ? "עם סיסמה" : "with password"}{" "}
                      <span className="font-mono rounded px-1 bg-cy-blue/80 text-white dark:bg-cy-darkBlue">{'Aa123456'}</span>
                    </p>
                  </div>
                  <div className="pt-3">
                    <strong>{strings.userSection}</strong>
                    <p>{strings.userExample}</p>
                  </div>
                  <div className="pt-3">
                    <span className="font-medium text-cy-blue dark:text-cy-lightBlue">
                      {strings.anyUser}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-3 flex flex-col items-center text-xs text-gray-400">
                <span>
                  {lang === "he"
                    ? "לקבלת הרשאות, העתק את הפרטים לדוגמא והיכנס בהתאם"
                    : "To log in as an admin or user, copy the relevant example."}
                </span>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default LoginPage;
