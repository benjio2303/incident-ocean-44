
type Lang = "en" | "he" | "el";

export const loginStrings: Record<Lang, Record<string, string>> = {
  en: {
    title: "CY Incident Management",
    subtitle: "Cyprus Aviation Authority",
    login: "Login",
    description: "Access the incident management system",
    username: "Username",
    password: "Password",
    role: "Role",
    selectRole: "Select your role",
    signIn: "Sign In",
    adminUsers: "Admin users:",
    adminExamples: "ofek, amit, engineer or denis with password Aa123456",
    userSection: "Regular users:",
    userExample: "Username: cyprus, Password: 123456",
    anyUser: "Any username/password combination will work",
    light: "Light",
    dark: "Dark",
    language: "Language"
  },
  he: {
    title: "CY ניהול תקלות",
    subtitle: "רשות התעופה הקפריסאית",
    login: "התחברות",
    description: "כניסה למערכת ניהול התקלות",
    username: "שם משתמש",
    password: "סיסמה",
    role: "תפקיד",
    selectRole: "בחר תפקיד",
    signIn: "התחבר",
    adminUsers: "משתמשי אדמין:",
    adminExamples: "ofek, amit, engineer או denis עם סיסמה Aa123456",
    userSection: "משתמש רגיל:",
    userExample: "שם משתמש: cyprus, סיסמה: 123456",
    anyUser: "כל שילוב של שם משתמש/סיסמה יעבוד",
    light: "בהיר",
    dark: "כהה",
    language: "שפה"
  },
  el: {
    title: "CY Διαχείριση Περιστατικών",
    subtitle: "Υπηρεσία Πολιτικής Αεροπορίας Κύπρου",
    login: "Σύνδεση",
    description: "Πρόσβαση στο σύστημα διαχείρισης περιστατικών",
    username: "Όνομα χρήστη",
    password: "Κωδικός πρόσβασης",
    role: "Ρόλος",
    selectRole: "Επιλέξτε τον ρόλο σας",
    signIn: "Σύνδεση",
    adminUsers: "Χρήστες διαχειριστή:",
    adminExamples: "ofek, amit, engineer ή denis με κωδικό Aa123456",
    userSection: "Κανονικοί χρήστες:",
    userExample: "Όνομα χρήστη: cyprus, Κωδικός: 123456",
    anyUser: "Οποιοσδήποτε συνδυασμός ονόματος χρήστη/κωδικού πρόσβασης θα λειτουργήσει",
    light: "Φωτεινό",
    dark: "Σκούρο",
    language: "Γλώσσα"
  }
};
