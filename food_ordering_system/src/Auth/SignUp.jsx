import Label from "@/components/ui/label";
import InputField from "@/components/ui/InputField";
import SubmitButton from "@/components/ui/SubmitButton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/Providers/AuthProvider";
import { useNavigate } from "react-router";

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
    role:z.enum(["regular","driver",],{
        message:"Role must be provided"
    })
});

export default function SignUp() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  const {login} = useAuth();
  const navigate = useNavigate();

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
      console.log(res.data.user)
      login(res.data.user);
      reset();
      navigate('/signin');
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
    <div className="w-full h-screen flex justify-center items-center bg-white ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-lg:w-[90%] lg:w-[30%] h-auto flex flex-col mt-20 gap-4 rounded-xl border border-[#E5E5E5] px-5 py-5 mb-20"
      >
        <div className="flex flex-col">
          <h5 className="text-black text-2xl font-semibold text-left mb-1">
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
            {...register("role")}
            type="text"
            className=" bg-transparent w-[60%] rounded-[8px] h-full text-zinc-300 text-sm placeholder-zinc-400 focus:border-none border border-zinc-800 text-center"
          >
            <option value="regular" className="text-white bg-black">
              Regular
            </option>
            <option value="driver" className="text-white bg-black">
              Driver
            </option>
          </select>
        </div>

        <SubmitButton
          title="Submit"
          isSubmitting={isSubmitting}
          isValid={isValid}
        />
        <p className="text-sm text-center text-black">
          Already have an account? <span className="underline">Log in</span>
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

// const schema = z.object({
//   username: z.string().min(4, "Username must be at least 4 characters").max(10, "Username cannot be more than 10 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(8, "Password must be at least 8 characters").max(16, "Password cannot be more than 16 characters"),
// });

// export default function SignUp() {
//   const navigate = useNavigate();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting, isValid },
//   } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

//   const { login } = useAuth();

//   const { mutate } = useMutation({
//     mutationFn: async (data) => {
//       await axiosInstance.post("/users/create-user", data);
//     },
//     onSuccess: async () => {
//       await login();
//       reset();
//       navigate("/");
//     },
//     onError: (error) => {
//       if (error.response?.status === 409) {
//         alert("A user with this email or username already exists.");
//       } else {
//         alert("Something went wrong. Please try again.");
//       }
//       console.error("Error in creating the user", error);
//       reset();
//     },
//   });

//   const onSubmit = (formData) => {
//     mutate(formData);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
//       <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Sign Up</h2>
//         <p className="text-sm text-gray-500 mb-6 text-center">Enter your details to create an account</p>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//           {/* Username */}
//           <div className="space-y-1">
//             <Label name="username" title="Username" />
//             <InputField
//               type="text"
//               name="username"
//               placeholder="Enter unique username"
//               register={register}
//               error={errors.username?.message}
//             />
//           </div>

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

//           {/* Role Selection */}
//           <div className="space-y-1">
//             <Label name="role" title="Sign up as" />
//             <select
//               {...register("role")}
//               className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
//             >
//               <option value="regular">Regular</option>
//               <option value="rider">Rider</option>
//               <option value="restaurantOwner">Restaurant Owner</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>

//           {/* Submit Button */}
//           <SubmitButton title="Create Account" isSubmitting={isSubmitting} isValid={isValid} />

//           {/* Link to signin */}
//           <p className="text-center text-sm text-gray-600">
//             Already have an account?{" "}
//             <span
//               onClick={() => navigate("/signin")}
//               className="text-black font-semibold hover:underline cursor-pointer"
//             >
//               Log in
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
// import axiosInstance from "@/axiosConfig"; // ✅ use cookie-based axios instance
// import { useAuth } from "@/Providers/AuthProvider";
// import { useNavigate } from "react-router";

// const schema = z.object({
//   username: z
//     .string()
//     .min(4, "Username must be at least 4 characters")
//     .max(10, "Username cannot be more than 10 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .max(16, "Password cannot be more than 16 characters"),
// });

// export default function SignUp() {
//   const navigate = useNavigate();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting, isValid },
//   } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

//   const { login } = useAuth();

//   const { mutate } = useMutation({
//     mutationFn: async (data) => {
//       await axiosInstance.post("/users/create-user", data);
//     },
//     onSuccess: async () => {
//       await login(); // ✅ fetch user from cookie-based session
//       reset();
//       navigate("/"); // ✅ redirect after signup
//     },
//     onError: (error) => {
//       if (error.response?.status === 409) {
//         alert("A user with this email or username already exists.");
//       } else {
//         alert("Something went wrong. Please try again.");
//       }
//       console.error("Error in creating the user", error);
//       reset();
//     },
//   });

//   const onSubmit = (formData) => {
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
//             Signup
//           </h5>
//           <h5 className="text-zinc-400 text-sm mb-3">
//             Enter your details to get started!
//           </h5>
//         </div>

//         <div className="w-full flex flex-col gap-1">
//           <Label name="username" title="Username" />
//           <InputField
//             type="text"
//             name="username"
//             placeholder="Enter unique username"
//             register={register}
//             error={errors.username?.message}
//           />
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

//         <div className="flex justify-between items-center w-full h-[2.5rem]">
//           <Label name="role" title="Sign Up as" />
//           <select
//             {...register("role")}
//             className="bg-transparent w-[60%] rounded-[8px] h-full text-zinc-300 text-sm placeholder-zinc-400 focus:border-none border border-zinc-800 text-center"
//           >
//             <option value="regular" className="text-white bg-black">
//               Regular
//             </option>
//             <option value="rider" className="text-white bg-black">
//               Rider
//             </option>
//             <option value="restaurantOwner" className="text-white bg-black">
//               Restaurant Owner
//             </option>
//             <option value="admin" className="text-white bg-black">
//               Admin
//             </option>
//           </select>
//         </div>

//         <SubmitButton
//           title="Submit"
//           isSubmitting={isSubmitting}
//           isValid={isValid}
//         />
//         <p className="text-sm text-center text-white">
//           Already have an account? <span className="underline">Log in</span>
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
//   username: z
//     .string()
//     .min(4, "Username must be at least 4 characters")
//     .max(10, "Username cannot be more than 10 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .max(16, "Password cannot be more than 16 characters"),
// });

// export default function SignUp() {
//   const navigate = useNavigate();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting, isValid },
//   } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

//   const { login } = useAuth();

//   const { mutate } = useMutation({
//     mutationFn: async (data) => {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/users/create-user`,
//         data
//       );
//       return res;
//     },
//     onSuccess: (res) => {
//       console.log("User has been created successfully", res);
//       login(null, res.data.token); // ✅ only pass token
//       reset();
//       navigate("/"); // ✅ redirect to homepage
//     },
//     onError: (error) => {
//       if (error.response?.status === 409) {
//         alert("A user with this email or username already exists.");
//       } else {
//         alert("Something went wrong. Please try again.");
//       }
//       console.log("Error in creating the user", error);
//       reset();
//     },
//   });

//   const onSubmit = (formData) => {
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
//             Signup
//           </h5>
//           <h5 className="text-zinc-400 text-sm mb-3">
//             Enter your details to get started!
//           </h5>
//         </div>

//         <div className="w-full flex flex-col gap-1">
//           <Label name="username" title="Username" />
//           <InputField
//             type="text"
//             name="username"
//             placeholder="Enter unique username"
//             register={register}
//             error={errors.username?.message}
//           />
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

//         <div className="flex justify-between items-center w-full h-[2.5rem]">
//           <Label name="role" title="Sign Up as" />
//           <br />
//           <select
//             {...register("role")}
//             className="bg-transparent w-[60%] rounded-[8px] h-full text-zinc-300 text-sm placeholder-zinc-400 focus:border-none border border-zinc-800 text-center"
//           >
//             <option value="regular" className="text-white bg-black">
//               Regular
//             </option>
//             <option value="rider" className="text-white bg-black">
//               Rider
//             </option>
//             <option value="restaurantOwner" className="text-white bg-black">
//               Restaurant Owner
//             </option>
//             <option value="admin" className="text-white bg-black">
//               Admin
//             </option>
//           </select>
//         </div>

//         <SubmitButton
//           title="Submit"
//           isSubmitting={isSubmitting}
//           isValid={isValid}
//         />
//         <p className="text-sm text-center text-white">
//           Already have an account? <span className="underline">Log in</span>
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
// import { useNavigate } from "react-router"; // ✅ Add this

// const schema = z.object({
//   username: z
//     .string()
//     .min(4, "Username must be at least 4 characters")
//     .max(10, "Username cannot be more than 10 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .max(16, "Password cannot be more than 16 characters"),
// });

// export default function SignUp() {
//   const navigate = useNavigate(); // ✅ Initialize navigation

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting, isValid },
//   } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

//   const { login } = useAuth();

//   const { mutate } = useMutation({
//     mutationFn: async (data) => {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/users/create-user`,
//         data
//       );
//       return res;
//     },
//     onSuccess: (res) => {
//       console.log("User has been created successfully", res);
//       login(null, res.data.token); // ✅ Just pass token
//       reset();
//       navigate("/signin"); // ✅ Redirect to SignIn after signup
//     },
//     onError: (error) => {
//       if (error.response?.status === 409) {
//         alert("A user with this email or username already exists.");
//       } else {
//         alert("Something went wrong. Please try again.");
//       }
//       console.log("Error in creating the user", error);
//       reset();
//     },
//   });

//   const onSubmit = (formData) => {
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
//             Signup
//           </h5>
//           <h5 className="text-zinc-400 text-sm mb-3">
//             Enter your details to get started!
//           </h5>
//         </div>

//         <div className="w-full flex flex-col gap-1">
//           <Label name="username" title="Username" />
//           <InputField
//             type="text"
//             name="username"
//             placeholder="Enter unique username"
//             register={register}
//             error={errors.username?.message}
//           />
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

//         <div className="flex justify-between items-center w-full h-[2.5rem]">
//           <Label name="role" title="Sign Up as" />
//           <br />
//           <select
//             {...register("role")}
//             className="bg-transparent w-[60%] rounded-[8px] h-full text-zinc-300 text-sm placeholder-zinc-400 focus:border-none border border-zinc-800 text-center"
//           >
//             <option value="regular" className="text-white bg-black">
//               Regular
//             </option>
//             <option value="rider" className="text-white bg-black">
//               Rider
//             </option>
//             <option value="restaurantOwner" className="text-white bg-black">
//               Restaurant Owner
//             </option>
//             <option value="admin" className="text-white bg-black">
//               Admin
//             </option>
//           </select>
//         </div>

//         <SubmitButton
//           title="Submit"
//           isSubmitting={isSubmitting}
//           isValid={isValid}
//         />
//         <p className="text-sm text-center text-white">
//           Already have an account? <span className="underline">Log in</span>
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

// const schema = z.object({
//   username: z
//     .string()
//     .min(4, "Username must be at least 4 characters")
//     .max(10, "Username cannot be more than 10 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .max(16, "Password cannot be more than 16 characters"),
// });

// export default function SignUp() {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting, isValid },
//   } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

//   const { login } = useAuth();

//   const { mutate } = useMutation({
//     mutationFn: async (data) => {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/users/create-user`,
//         data
//       );
//       return res;
//     },
//     onSuccess: (res) => {
//       console.log("User has been created successfully", res);
//       // login(res.data.user, res.data.token);
//       login(null, res.data.token);

//       reset();
//     },
//     onError: (error) => {
//       console.log("Error in creating the user", error);
//       reset();
//     },
//   });

//   const onSubmit = (formData) => {
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
//             Signup
//           </h5>
//           <h5 className="text-zinc-400 text-sm mb-3">
//             Enter your details to get started!
//           </h5>
//         </div>

//         <div className="w-full flex flex-col gap-1">
//           <Label name="username" title="Username" />
//           <InputField
//             type="text"
//             name="username"
//             placeholder="Enter unique username"
//             register={register}
//             error={errors.username?.message}
//           />
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

//         <div className="flex justify-between items-center w-full h-[2.5rem]">
//           <Label name="role" title="Sign Up as" />
//           <br />
//           <select
//             {...register("role")}
//             className="bg-transparent w-[60%] rounded-[8px] h-full text-zinc-300 text-sm placeholder-zinc-400 focus:border-none border border-zinc-800 text-center"
//           >
//             <option value="regular" className="text-white bg-black">
//               Regular
//             </option>
//             <option value="rider" className="text-white bg-black">
//               Rider
//             </option>
//             <option value="restaurantOwner" className="text-white bg-black">
//               Restaurant Owner
//             </option>
//             <option value="admin" className="text-white bg-black">
//               Admin
//             </option>
//           </select>
//         </div>

//         <SubmitButton
//           title="Submit"
//           isSubmitting={isSubmitting}
//           isValid={isValid}
//         />
//         <p className="text-sm text-center text-white">
//           Already have an account? <span className="underline">Log in</span>
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

// const schema = z.object({
//   username: z
//     .string()
//     .min(4, "Username must be at least 4 characters")
//     .max(10, "Username cannot be more than 10 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .max(16, "Password cannot be more than 16 characters"),
// });

// export default function SignUp() {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting, isValid },
//   } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

//   const {login} = useAuth();

//   const { mutate } = useMutation({
//     mutationFn: async (data) => {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/users`,
//         data
//       );
//       return res;
//     },
//     onSuccess: (res) => {
//       console.log("User has been created sucessfully", res);
//       login(res.data.user,res.data.token);
//       reset();
//     },
//     onError: (error) => {
//       console.log("Error in creating the user", error);
//       reset();
//     },
//   });

//   const onSubmit = (formData) => {
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
//             Signup
//           </h5>
//           <h5 className="text-zinc-400 text-sm mb-3">
//             Enter your details to get started!
//           </h5>
//         </div>

//         <div className="w-full flex flex-col gap-1">
//           <Label name="username" title="Username" />
//           <InputField
//             type="text"
//             name="username"
//             placeholder="Enter unique username"
//             register={register}
//             error={errors.username?.message}
//           />
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

//         <div className="flex justify-between items-center w-full h-[2.5rem]">
//           <Label name="type" title="Sign Up as" />
//           <br />
//           <select
//             type="text"
//             name="role"
//             className=" bg-transparent w-[60%] rounded-[8px] h-full text-zinc-300 text-sm placeholder-zinc-400 focus:border-none border border-zinc-800 text-center"
//           >
//             <option value="regular" className="text-white bg-black">
//               Regular
//             </option>
//             <option value="rider" className="text-white bg-black">
//               Rider
//             </option>
//           </select>
//         </div>

//         <SubmitButton
//           title="Submit"
//           isSubmitting={isSubmitting}
//           isValid={isValid}
//         />
//         <p className="text-sm text-center text-white">
//           Already have an account? <span className="underline">Log in</span>
//         </p>
//       </form>
//     </div>
//   );
// }
