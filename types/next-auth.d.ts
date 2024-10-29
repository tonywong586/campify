import "next-auth/jwt";
// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

interface SharedUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  admin: boolean;
}

declare module "next-auth/jwt" {
  interface JWT extends SharedUser {}
}

declare module "next-auth" {
  interface Session {
    user: SharedUser;
  }

  interface User extends SharedUser {}
}
