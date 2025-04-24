
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
import { Lock, User } from "lucide-react";
import { loginStrings } from "@/i18n/loginStrings";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import LoginHeader from "@/components/login/LoginHeader";
import LanguageSelector from "@/components/login/LanguageSelector";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  role: z.enum(["user", "admin"], { required_error: "Please select a role" }),
});

type FormData = z.infer<typeof formSchema>;

const LoginPage: React.FC = () => {
  const auth = useAuth(); // Get the auth context properly
  const [lang, setLang] = useState<"en">("en"); // Only English is supported
  const [darkMode, setDarkMode] = useState(false);

  React.useEffect(() => {
    const htmlEl = document.documentElement;
    if (darkMode) {
      htmlEl.classList.add("dark");
    } else {
      htmlEl.classList.remove("dark");
    }
  }, [darkMode]);

  // No need to change document direction since we only support English
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
    if (auth && auth.login) {
      auth.login(data.username, data.password, data.role as UserRole);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cy-blue via-cy-lightBlue to-cy-gray dark:from-cy-darkGray dark:via-cy-darkBlue dark:to-gray-900 transition-all duration-500 relative">
      <div className="w-full max-w-md px-4">
        <LoginHeader lang={lang} />

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full mb-3 grid grid-cols-2 rounded-lg shadow bg-white/80 dark:bg-cy-darkGray/60">
            <TabsTrigger className="rounded-l-lg data-[state=active]:bg-cy-blue/90 data-[state=active]:text-white" value="login">
              {strings.login}
            </TabsTrigger>
            <TabsTrigger className="rounded-r-lg data-[state=active]:bg-cy-darkBlue/80 data-[state=active]:text-white" value="info">
              Help / Examples
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="glass-morphism animate-[fade-in_0.7s_ease] shadow-xl border-none bg-white/80 dark:bg-cy-darkGray/80 transition-colors" style={{ backdropFilter: 'blur(12px)' }}>
              <CardHeader>
                <CardTitle className="tracking-wide font-semibold text-xl text-cy-darkBlue dark:text-cy-lightBlue text-center">
                  {strings.login}
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-300 text-center">
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
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
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
                  See login examples -->
                </span>
              </CardFooter>
            </Card>
            <LanguageSelector lang={lang} setLang={setLang} />
          </TabsContent>

          <TabsContent value="info">
            <Card className="glass-morphism shadow-xl border-none p-6 bg-white/90 dark:bg-cy-darkGray/90 animate-[fade-in_0.7s_ease]">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-cy-darkBlue dark:text-cy-lightBlue">
                  Login Examples
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
                      or{" "}
                      <span className="font-mono rounded px-1 bg-gray-100 dark:bg-gray-700">denis</span>{" "}
                      with password{" "}
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
                  To log in as an admin or user, copy the relevant example.
                </span>
              </CardFooter>
            </Card>
            <LanguageSelector lang={lang} setLang={setLang} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoginPage;
