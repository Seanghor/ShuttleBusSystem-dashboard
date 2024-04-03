"use client";
import "react-toastify/dist/ReactToastify.css";

const ShowTerminal: React.FunctionComponent<any> = ({
  success,
  content,
  description,
  show,
  onClick,
}) => {
  return (
    <>
      {show ? (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto backdrop-blur-sm">
            <div className="flex items-center min-h-screen px-4 py-8">
              <div className="relative w-full max-w-lg p-4 mx-auto bg-black rounded-md shadow-2xl bg-light-hover">
                <div className="text-left">
                  <h2 className="text-2xl font-bold mb-4">{content}</h2>
                  <p className="text-gray-800 mb-6 font-medium">
                    {description}
                  </p>
                  {!success ? (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                      onClick={onClick}
                    >
                      Close
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ShowTerminal;
