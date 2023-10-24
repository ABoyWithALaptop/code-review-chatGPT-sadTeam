import { useState } from "react";
import { useRepo } from "@/context/RepoContext";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginSchema = z.object({
  repo_url: z.string().url({ message: "Invalid url" }),
  repo_token: z.string(),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

export default function SelectRepo() {
  const { loginContext } = useRepo();
  const router = useRouter();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<LoginSchemaType>({
    defaultValues: {
      repo_url: "",
      repo_token: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = handleSubmit(async (formValues) => {
    if (!errors.repo_url && !errors.repo_token && formValues.repo_token) {
      try {
        await loginContext(formValues.repo_url, formValues.repo_token);
        router.push("/select-pr");
      } catch (error) {
        console.log(error);
      }
    }
  });

  return (
    <div className=" flex h-[calc(100vh-64px-52px)]">
      <div className=" m-auto w-screen flex justify-center">
        <form className=" w-full max-w-lg">
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                htmlFor="link-repo"
              >
                Link repository
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="link-repo"
                type="text"
                {...register("repo_url")}
                required
              />
              {errors.repo_url && (
                <span className=" text-red-500">{errors.repo_url.message}</span>
              )}
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                htmlFor="accesstoken"
              >
                Accesstoken
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="accesstoken"
                type="password"
                placeholder="******************"
                {...register("repo_token")}
              />
              {errors.repo_token && (
                <span className=" text-red-500">{errors.repo_token.message}</span>
              )}
            </div>
          </div>

          <div className="md:flex md:items-center">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <button
                className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={onSubmit}
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
