import { AiOutlineGithub } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="mx-auto max-w-3xl px-4 w-full text-white">
      <hr className="w-full h-0.5 mx-auto mt-8 bg-white border-0"></hr>
      <div className="mx-auto p-4 flex flex-col text-center md:flex-row md:justify-between">
        <div className="flex flex-row items-center justify-center space-x-1">
          <span>Made by </span>
          <a href="https://jasonkchen.vercel.app/" className="hover:underline">
            Jason Chen
          </a>
        </div>
        <div className="flex flex-row items-center justify-center space-x-2 mb-1">
          <a
            href="https://github.com/picklejason/receiptify"
            rel="noreferrer"
            target="_blank"
          >
            <AiOutlineGithub
              className="hover:-translate-y-1 transition-transform cursor-pointer"
              size={30}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
