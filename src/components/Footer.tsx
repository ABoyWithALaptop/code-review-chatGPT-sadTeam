export default function Footer() {
  return (
    <footer className="bg-white rounded-lg dark:bg-gray-800">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            SADTeam™
          </a>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a
              href="https://github.com/ABoyWithALaptop"
              className="mr-4 hover:underline md:mr-6 "
            >
              ABoyWithALaptop
            </a>
          </li>
          <li>
            <a
              href="https://github.com/nghianm2803"
              className="mr-4 hover:underline md:mr-6"
            >
              nghianm2803
            </a>
          </li>
          <li>
            <a
              href="https://github.com/hkhangus"
              className="mr-4 hover:underline md:mr-6"
            >
              hkhangus
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
