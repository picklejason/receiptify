const Button = ({ label, action }) => {
  return (
    <button
      className="border-2 border-white px-2 rounded hover:border-black hover:bg-white hover:text-black hover:scale-[1.1] transition-all duration-300 ease-in-out"
      onClick={action}
    >
      {label}
    </button>
  );
};

export default Button;
