import Label from "@/components/ui/label";
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

  const {login} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectedFrom = location.state || undefined;

  const { mutate,error } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PREFIX}/users/login`,
        data,{
          withCredentials:true
        }
      );
      return res.data;
    },
    onSuccess: (res) => {
      console.log("User were logged in sucessfully", res)
      localStorage.setItem("role",res?.data?.role)
      localStorage.setItem("userId",res?.data?.id)
      console.log(localStorage.getItem("role"),"wow");
      
      login(res.data);
      reset();
      redirectedFrom ? navigate(redirectedFrom) : navigate("/");
      
    },
    onError: (error) => {
      console.log("Error in logging the user", error);
      
    },
  });

  const onSubmit = (formData) => {
    console.log(formData);
    mutate(formData);
  };

  if(error){
    console.log(error.message)
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








// import Label from "@/components/ui/label";
// import InputField from "@/components/ui/InputField";
// import SubmitButton from "@/components/ui/SubmitButton";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import axiosInstance from "@/axiosConfig";
// import { useAuth } from "@/Providers/AuthProvider";
// import { useNavigate } from "react-router";
// import { useState } from "react";

// const schema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(8, "Password must be at least 8 characters").max(16, "Password cannot be more than 16 characters"),
// });

// export default function SignIn() {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting, isValid },
//   } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [loginError, setLoginError] = useState("");

//   const { mutate } = useMutation({
//     mutationFn: async (data) => {
//       await axiosInstance.post("/users/login", data);
//     },
//     onSuccess: async () => {
//       await login();
//       reset();
//       navigate("/");
//     },
//     onError: (error) => {
//       console.error("Login error", error);
//       if (error.response?.status === 400) {
//         setLoginError("Invalid email or password");
//       } else {
//         setLoginError("Something went wrong. Please try again.");
//       }
//     },
//   });

//   const onSubmit = (formData) => {
//     setLoginError("");
//     mutate(formData);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
//       <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Sign In</h2>
//         <p className="text-sm text-gray-500 mb-6 text-center">Enter your credentials to access your account</p>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//           {/* Email */}
//           <div className="space-y-1">
//             <Label name="email" title="Email" />
//             <InputField
//               type="email"
//               name="email"
//               placeholder="xxxxx@email.com"
//               register={register}
//               error={errors.email?.message}
//             />
//           </div>

//           {/* Password */}
//           <div className="space-y-1">
//             <Label name="password" title="Password" />
//             <InputField
//               type="password"
//               name="password"
//               placeholder="********"
//               register={register}
//               error={errors.password?.message}
//             />
//           </div>

//           {/* Error message */}
//           {loginError && (
//             <p className="text-red-500 text-center text-sm">{loginError}</p>
//           )}

//           {/* Submit Button */}
//           <SubmitButton title="Login" isSubmitting={isSubmitting} isValid={isValid} />

//           {/* Link to signup */}
//           <p className="text-center text-sm text-gray-600">
//             Don’t have an account?{" "}
//             <span
//               onClick={() => navigate("/signup")}
//               className="text-black font-semibold hover:underline cursor-pointer"
//             >
//               Create one
//             </span>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }









//og
// import Label from "@/components/ui/label";
// import InputField from "@/components/ui/InputField";
// import SubmitButton from "@/components/ui/SubmitButton";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import axiosInstance from "@/axiosConfig"; // ✅ Use axios with cookies
// import { useAuth } from "@/Providers/AuthProvider";
// import { useNavigate } from "react-router";
// import { useState } from "react";

// const schema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .max(16, "Password cannot be more than 16 characters"),
// });

// export default function SignIn() {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting, isValid },
//   } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [loginError, setLoginError] = useState("");

//   const { mutate } = useMutation({
//     mutationFn: async (data) => {
//       await axiosInstance.post("/users/login", data); // ✅ Session cookie will be set
//     },
//     onSuccess: async () => {
//       await login(); // ✅ Fetch user using cookie session
//       reset();
//       navigate("/");
//     },
//     onError: (error) => {
//       console.error("Login error", error);
//       if (error.response?.status === 400) {
//         setLoginError("Invalid email or password");
//       } else {
//         setLoginError("Something went wrong. Please try again.");
//       }
//     },
//   });

//   const onSubmit = (formData) => {
//     setLoginError("");
//     mutate(formData);
//   };

//   return (
//     <div className="w-full h-screen flex justify-center items-center">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full max-lg:w-[90%] lg:w-[30%] h-auto flex flex-col mt-20 gap-4 rounded-xl border border-zinc-800 px-5 py-5"
//       >
//         <div className="flex flex-col">
//           <h5 className="text-white text-2xl font-medium text-left mb-1">
//             Sign In
//           </h5>
//           <h5 className="text-zinc-400 text-sm mb-3">
//             Enter your credentials to log in!
//           </h5>
//         </div>

//         <div className="w-full flex flex-col gap-1">
//           <Label name="email" title="Email" />
//           <InputField
//             type="email"
//             name="email"
//             placeholder="xxxxx@email.com"
//             register={register}
//             error={errors.email?.message}
//           />
//         </div>

//         <div className="w-full flex flex-col gap-1">
//           <Label name="password" title="Password" />
//           <InputField
//             type="password"
//             name="password"
//             placeholder="*******"
//             register={register}
//             error={errors.password?.message}
//           />
//         </div>

//         {loginError && (
//           <p className="text-red-500 text-sm font-medium text-center">
//             {loginError}
//           </p>
//         )}

//         <SubmitButton
//           title="Login"
//           isSubmitting={isSubmitting}
//           isValid={isValid}
//         />
//         <p className="text-sm text-center text-white">
//           Don’t have an account? <span className="underline">Create one</span>
//         </p>
//       </form>
//     </div>
//   );
// }








// import Label from "@/components/ui/label";
// import InputField from "@/components/ui/InputField";
// import SubmitButton from "@/components/ui/SubmitButton";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import { useAuth } from "@/Providers/AuthProvider";
// import { useNavigate } from "react-router";
// import { useState } from "react";

// const schema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .max(16, "Password cannot be more than 16 characters"),
// });

// export default function SignIn() {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting, isValid },
//   } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [loginError, setLoginError] = useState("");

//   const { mutate } = useMutation({
//     mutationFn: async (data) => {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/users/login`,
//         data
//       );
//       return res;
//     },
//     onSuccess: (res) => {
//       console.log("User logged in successfully", res);
//       login(null, res.data.token); // ✅ only use token
//       reset();
//       navigate("/"); // ✅ redirect after login
//     },
//     onError: (error) => {
//       console.log("Error in logging the user", error);
//       if (error.response?.status === 400) {
//         setLoginError("Invalid email or password");
//       } else {
//         setLoginError("Something went wrong. Please try again.");
//       }
//     },
//   });

//   const onSubmit = (formData) => {
//     console.log("Login form data:", formData); // ✅ confirm what's being sent
//     setLoginError(""); // clear previous errors
//     mutate(formData);
//   };
  
//   return (
//     <div className="w-full h-screen flex justify-center items-center">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full max-lg:w-[90%] lg:w-[30%] h-auto flex flex-col mt-20 gap-4 rounded-xl border border-zinc-800 px-5 py-5"
//       >
//         <div className="flex flex-col">
//           <h5 className="text-white text-2xl font-medium text-left mb-1">
//             Sign In
//           </h5>
//           <h5 className="text-zinc-400 text-sm mb-3">
//             Enter your credentials to log in!
//           </h5>
//         </div>

//         <div className="w-full flex flex-col gap-1">
//           <Label name="email" title="Email" />
//           <InputField
//             type="email"
//             name="email"
//             placeholder="xxxxx@email.com"
//             register={register}
//             error={errors.email?.message}
//           />
//         </div>

//         <div className="w-full flex flex-col gap-1">
//           <Label name="password" title="Password" />
//           <InputField
//             type="password"
//             name="password"
//             placeholder="*******"
//             register={register}
//             error={errors.password?.message}
//           />
//         </div>

//         {/* Show login error if exists */}
//         {loginError && (
//           <p className="text-red-500 text-sm font-medium text-center">
//             {loginError}
//           </p>
//         )}

//         <SubmitButton
//           title="Login"
//           isSubmitting={isSubmitting}
//           isValid={isValid}
//         />
//         <p className="text-sm text-center text-white">
//           Don't have an account? <span className="underline">Create one</span>
//         </p>
//       </form>
//     </div>
//   );
// }







// import Label from "@/components/ui/label";
// import InputField from "@/components/ui/InputField";
// import SubmitButton from "@/components/ui/SubmitButton";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import { useAuth } from "@/Providers/AuthProvider";
// import { useNavigate } from "react-router";

// const schema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .max(16, "Password cannot be more than 16 characters"),
// });

// export default function SignIn() {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting, isValid },
//   } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

//   const {login} = useAuth();
//   const navigate = useNavigate();

//   const { mutate,error } = useMutation({
//     mutationFn: async (data) => {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/users/login`,
//         data
//       );
//       return res;
//     },
//     onSuccess: (res) => {
//       console.log("User were logged in sucessfully", res);
//       login(res.data.user,res.data.token);
//       reset();
//       navigate("/");

      
//     },
//     onError: (error) => {
//       console.log("Error in logging the user", error);
      
//     },
//   });

//   const onSubmit = (formData) => {
//     mutate(formData);
//   };

//   if(error){
//     console.log(error.message)
//   }
//   return (
//     <div className="w-full h-screen flex justify-center items-center">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full max-lg:w-[90%] lg:w-[30%] h-auto flex flex-col mt-20 gap-4 rounded-xl border border-zinc-800 px-5 py-5"
//       >
//         <div className="flex flex-col">
//           <h5 className="text-white text-2xl font-medium text-left mb-1">
//             SignIn
//           </h5>
//           <h5 className="text-zinc-400 text-sm mb-3">
//             Enter your credentials to logged in!
//           </h5>
//         </div>

//         <div className="w-full flex flex-col gap-1">
//           <Label name="email" title="Email" />
//           <InputField
//             type="email"
//             name="email"
//             placeholder="xxxxx@email.com"
//             register={register}
//             error={errors.email?.message || error?.message}
//           />
//         </div>

//         <div className="w-full flex flex-col gap-1">
//           <Label name="password" title="Password" />
//           <InputField
//             type="password"
//             name="password"
//             placeholder="*******"
//             register={register}
//             error={errors.password?.message || error?.message}
//           />
//         </div>

//         <SubmitButton
//           title="Login"
//           isSubmitting={isSubmitting}
//           isValid={isValid}
//         />
//         <p className="text-sm text-center text-white">
//           Don't have an account? <span className="underline">Create one</span>
//         </p>
//       </form>
//     </div>
//   );
// }
