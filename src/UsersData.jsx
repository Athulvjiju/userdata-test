import { useState, useEffect } from "react";

export default function UserDirectory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [supportInfo, setSupportInfo] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://reqres.in/api/users?page=${pageNumber}`
      );
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data.data);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`https://reqres.in/api/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user details");

      const data = await response.json();
      setUserDetails(data.data);
      setSupportInfo(data.support);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchUserDetails(user.id);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
    setUserDetails(null);
    setSupportInfo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            User Directory
          </h1>
          <p className="text-gray-600">
            Click on a user card to view more details
          </p>
        </header>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
              <div
                className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin absolute top-0 left-0"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className={`bg-white backdrop-blur-lg bg-opacity-80 rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer ${
                    selectedUser?.id === user.id ? "ring-2 ring-purple-500" : ""
                  }`}
                >
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <div className="p-6 flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-full p-1 bg-gradient-to-r from-blue-400 to-purple-500">
                        <img
                          src={
                            user.avatar ||
                            "https://fakeimg.pl/600x400?text=Avatar"
                          }
                          alt={`${user.first_name} ${user.last_name}`}
                          className="h-20 w-20 rounded-full object-cover border-2 border-white"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://fakeimg.pl/600x400?text=Avatar";
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {user.first_name} {user.last_name}
                      </h2>
                      <p className="text-gray-600">{user.email}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          ID: {user.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`px-6 py-2 rounded-lg font-medium ${
                  page === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
                }`}
              >
                Previous
              </button>
              <div className="flex items-center px-4 bg-white bg-opacity-80 rounded-lg shadow-sm">
                <span>
                  Page {page} of {totalPages}
                </span>
              </div>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className={`px-6 py-2 rounded-lg font-medium ${
                  page === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}

        {selectedUser && (
          <div className="fixed inset-0 bg-blue-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-fadeIn">
              <button
                onClick={closeUserDetails}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow-md z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {loadingDetails ? (
                <div className="flex justify-center items-center h-64">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
                    <div
                      className="h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin absolute top-0 left-0"
                      style={{
                        animationDirection: "reverse",
                        animationDuration: "1.5s",
                      }}
                    ></div>
                  </div>
                </div>
              ) : userDetails ? (
                <div>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-8 px-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <div
                        className="absolute top-0 left-0 w-full h-full bg-white opacity-10"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                    </div>
                    <div className="relative">
                      <div className="inline-block rounded-full p-2 bg-white bg-opacity-20 backdrop-blur-sm">
                        <img
                          src={
                            userDetails.avatar ||
                            "https://fakeimg.pl/600x400?text=Avatar"
                          }
                          alt={`${userDetails.first_name} ${userDetails.last_name}`}
                          className="h-32 w-32 rounded-full mx-auto border-4 border-white shadow-lg object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://fakeimg.pl/600x400?text=Avatar";
                          }}
                        />
                      </div>
                      <h2 className="mt-4 text-2xl font-bold text-white">
                        {userDetails.first_name} {userDetails.last_name}
                      </h2>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-500">
                        Email
                      </h3>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {userDetails.email}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-500">
                        User ID
                      </h3>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {userDetails.id}
                      </p>
                    </div>

                    {supportInfo && (
                      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-xl shadow-sm border border-purple-100">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-purple-700">
                            Partner Message
                          </h3>
                          <div className="bg-purple-100 text-purple-600 px-2 py-1 rounded-md text-xs font-medium">
                            Sponsored
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{supportInfo.text}</p>
                        <a
                          href={supportInfo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Learn More
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-2 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </a>
                      </div>
                    )}

                    <button
                      onClick={closeUserDetails}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 shadow-md transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  User details not available
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
