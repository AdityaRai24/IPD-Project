import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/authenticate/LoginForm";
import RegisterForm from "@/components/authenticate/RegisterForm";

export default function page() {

  return (
    <div className="flex items-center justify-center w-full h-[80vh]">
      <Tabs defaultValue="login" className="w-[400px] ">
        <TabsList className="grid bg-white w-full grid-cols-2 shadow-sm shadow-primary/30">
          <TabsTrigger value="login"
          >
            Login
          </TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <LoginForm />
        <RegisterForm />
      </Tabs>
    </div>
  );
}
