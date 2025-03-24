import Label from "@/components/ui/label";
import InputField from "@/components/ui/InputField";
import SubmitButton from "@/components/ui/SubmitButton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/Providers/AuthProvider";

const schema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(10, "Username cannot be more than 10 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password cannot be more than 16 characters"),
});

export default function SignUp() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  const {login} = useAuth();

  const { mutate } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PREFIX}/users`,
        data
      );
      return res;
    },
    onSuccess: (res) => {
      console.log("User has been created sucessfully", res);
      login(res.data.user,res.data.token);
      reset();
    },
    onError: (error) => {
      console.log("Error in creating the user", error);
      reset();
    },
  });

  const onSubmit = (formData) => {
    mutate(formData);
  };
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-lg:w-[90%] lg:w-[30%] h-auto flex flex-col mt-20 gap-4 rounded-xl border border-zinc-800 px-5 py-5"
      >
        <div className="flex flex-col">
          <h5 className="text-white text-2xl font-medium text-left mb-1">
            Signup
          </h5>
          <h5 className="text-zinc-400 text-sm mb-3">
            Enter your details to get started!
          </h5>
        </div>

        <div className="w-full flex flex-col gap-1">
          <Label name="username" title="Username" />
          <InputField
            type="text"
            name="username"
            placeholder="Enter unique username"
            register={register}
            error={errors.username?.message}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <Label name="email" title="Email" />
          <InputField
            type="email"
            name="email"
            placeholder="xxxxx@email.com"
            register={register}
            error={errors.email?.message}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <Label name="password" title="Password" />
          <InputField
            type="password"
            name="password"
            placeholder="*******"
            register={register}
            error={errors.password?.message}
          />
        </div>

        <div className="flex justify-between items-center w-full h-[2.5rem]">
          <Label name="type" title="Sign Up as" />
          <br />
          <select
            type="text"
            name="role"
            className=" bg-transparent w-[60%] rounded-[8px] h-full text-zinc-300 text-sm placeholder-zinc-400 focus:border-none border border-zinc-800 text-center"
          >
            <option value="regular" className="text-white bg-black">
              Regular
            </option>
            <option value="rider" className="text-white bg-black">
              Rider
            </option>
          </select>
        </div>

        <SubmitButton
          title="Submit"
          isSubmitting={isSubmitting}
          isValid={isValid}
        />
        <p className="text-sm text-center text-white">
          Already have an account? <span className="underline">Log in</span>
        </p>
      </form>
    </div>
  );
}
