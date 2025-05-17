"use client"

interface ConfirmProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Confirm: React.FC<ConfirmProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
        <p className="text-lg mb-4">{message}</p>
        <div className="flex justify-between space-x-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white p-2 rounded-md w-full"
          >
            Yes, Logout
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-black p-2 rounded-md w-full"
          >
            No, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;