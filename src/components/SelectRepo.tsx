import { useState } from "react";
import { useRepo } from "@/context/RepoContext";
import { useRouter } from "next/navigation";

export default function SelectRepo() {
  const { loginContext } = useRepo();
  const router = useRouter();
  const handleSubmit = () => {
    // Handle here
    loginContext(link, accesstoken);
    router.push("/select-pr");
  };

  const [link, setLink] = useState("");
  const [accesstoken, setAccesstoken] = useState("");

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
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="link-repo"
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
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
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="accesstoken"
                type="password"
                placeholder="******************"
                value={accesstoken}
                onChange={(e) => setAccesstoken(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="md:flex md:items-center">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <button
                className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={handleSubmit}
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
