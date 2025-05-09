import Label from "@/components/ui/Label";
import InputField from "@/components/ui/InputField";
import SubmitButton from "@/components/ui/SubmitButton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/Providers/AuthProvider";
import { useLocation, useNavigate } from "react-router";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password cannot be more than 16 characters"),
});

export default function SignIn() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectedFrom = location.state || undefined;

  const { mutate, error } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(
        `${import.meta.env.VITE_DELIVERY_SERVICE_PREFIX}/users/login`,
        data,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
    onSuccess: (res) => {
      console.log("User were logged in sucessfully", res);
      localStorage.setItem("role", res?.data?.role);
      localStorage.setItem("userId", res?.data?.id);
      login(res.data);
      reset();
      redirectedFrom ? navigate(redirectedFrom) : navigate("/");
    },
    onError: (error) => {
      console.log("Error in logging the user", error.message);
    },
  });

  const onSubmit = (formData) => {
    console.log(formData);
    mutate(formData);
  };

  if (error) {
    console.log(error.message);
  }
  return (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-lg:w-[90%] lg:w-[30%] h-auto flex flex-col mt-20 gap-4 rounded-xl border border-[#E5E5E5] px-5 py-5"
      >
        <div className="flex flex-col">
          <h5 className="text-black text-2xl font-semibold text-left mb-1">
            SignIn
          </h5>
          <h5 className="text-zinc-400 text-sm mb-3">
            Enter your credentials to logged in!
          </h5>
        </div>

        <div className="w-full flex flex-col gap-1">
          <Label name="email" title="Email" />
          <InputField
            type="email"
            name="email"
            placeholder="xxxxx@email.com"
            register={register}
            error={errors.email?.message || error?.message}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <Label name="password" title="Password" />
          <InputField
            type="password"
            name="password"
            placeholder="*******"
            register={register}
            error={errors.password?.message || error?.message}
          />
        </div>

        <SubmitButton
          title="Login"
          isSubmitting={isSubmitting}
          isValid={isValid}
        />
        <p className="text-sm text-center text-black">
          Don't have an account? <span className="underline">Create one</span>
        </p>
      </form>
    </div>
  );
}
