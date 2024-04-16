import React, { useState, useEffect } from "react";
import collegeData from "./colleges.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faDownload,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

const CollegeTable = () => {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [visibleRows, setVisibleRows] = useState(10);
  const [showFlashMessage, setShowFlashMessage] = useState(false);

  useEffect(() => {
    setColleges(collegeData);
    setFilteredColleges(collegeData.slice(0, 10));
  }, []);

  useEffect(() => {
    const filtered = colleges.filter((college) =>
      college.collegeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredColleges(filtered.slice(0, visibleRows));
  }, [colleges, searchTerm, visibleRows]);

  useEffect(() => {
    if (sortColumn) {
      const sorted = [...filteredColleges].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
      setFilteredColleges(sorted);
    }
  }, [sortColumn, sortDirection, filteredColleges]);

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      setVisibleRows((prevRows) => prevRows + 10);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleApplyNow = (applyUrl) => {
    window.location.href = applyUrl;
  };

  const handleDownloadBrochure = (brochureUrl) => {
    setShowFlashMessage(true);
    setTimeout(() => {
      setShowFlashMessage(false);
    }, 2000);
    console.log(`Downloading brochure from ${brochureUrl}`);
  };

  return (
    <div className="flex flex-col">
      {showFlashMessage && (
        <div
          className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mt-4"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">Brochure is being downloaded.</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              onClick={() => setShowFlashMessage(false)}
              className="fill-current h-6 w-6 text-blue-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path
                fillRule="evenodd"
                d="M14.35 5.64a1 1 0 0 1 1.41 1.41L11.41 10l4.35 4.35a1 1 0 0 1-1.41 1.41L10 11.41l-4.35 4.35a1 1 0 1 1-1.41-1.41L8.59 10 4.24 5.64a1 1 0 0 1 1.41-1.41L10 8.59l4.35-4.35z"
              />
            </svg>
          </span>
        </div>
      )}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by college name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("rank")}
              >
                CD Rank
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("collegeName")}
              >
                Colleges
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("fees")}
              >
                Course Fees
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("placement")}
              >
                Placement
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("userRating")}
              >
                User Reviews
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("ranking")}
              >
                Ranking
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredColleges.map((college, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 text-center">
                    #{college.rank}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={college.logo}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {college.collegeName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {college.location}
                      </div>
                      <div className="text-sm text-gray-500">
                        {college.course}
                      </div>
                      <div className="text-sm text-gray-500">
                        {college.cutoff}
                      </div>
                      <div className="flex items-center mt-2">
                        <a
                          href="#"
                          className="px-3 text-amber-500 mr-2 text-center text-decoration-none"
                          onClick={() => handleApplyNow(college.applyUrl)}
                        >
                          <FontAwesomeIcon icon={faCheckCircle} /> Apply Now
                        </a>
                        <a
                          href="#"
                          className="px-3 py-1 text-green-500 mr-2 text-center text-decoration-none"
                          onClick={() =>
                            handleDownloadBrochure(college.brochureUrl)
                          }
                        >
                          <FontAwesomeIcon icon={faDownload} /> Download
                          Brochure
                        </a>
                        <a
                          href="#"
                          className="px-3 py-1 text-gray-500 text-center text-decoration-none"
                        >
                          <FontAwesomeIcon icon={faPlusCircle} /> Add To Compare
                        </a>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="text-green-500">
                      ₹{college.fees.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {college.feesDescription}
                  </div>
                  <br />
                  <a
                    href="#"
                    className="px-3 py-1 text-amber-500 text-decoration-none"
                  >
                    <FontAwesomeIcon icon={faPlusCircle} /> Compare Fees
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    {college.placement.average ? (
                      <div>
                        Average Package:
                        <span className="text-green-500">
                          {" "}
                          ₹{college.placement.average.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div>
                    {college.placement.highest ? (
                      <div>
                        Highest Package:
                        <span className="text-green-500">
                          {" "}
                          ₹{college.placement.highest.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <br />
                  <a
                    href="#"
                    className="px-3 py-1 text-amber-500 text-decoration-none"
                  >
                    <FontAwesomeIcon icon={faPlusCircle} /> Compare Placement
                  </a>
                </td>
                <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{college.userRating}/10</div>
                  <div className="mt-1">Based on {college.usersRating} users</div>
                </div>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{college.ranking}</div>
                  {college.featured && (
                    <div className="text-green-500">Featured</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollegeTable;

// import React, { useState, useEffect } from "react";
// import collegeData from "./colleges.json";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faCheckCircle,
//   faDownload,
//   faPlusCircle,
// } from "@fortawesome/free-solid-svg-icons";

// const CollegeTable = () => {
//   const [colleges, setColleges] = useState([]);
//   const [filteredColleges, setFilteredColleges] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortColumn, setSortColumn] = useState(null);
//   const [sortDirection, setSortDirection] = useState(null);
//   const [visibleRows, setVisibleRows] = useState(10);
//   const [showFlashMessage, setShowFlashMessage] = useState(false);

//   useEffect(() => {
//     setColleges(collegeData);
//     setFilteredColleges(collegeData.slice(0, 10));
//   }, []);

//   useEffect(() => {
//     const filtered = colleges.filter((college) =>
//       college.collegeName.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredColleges(filtered.slice(0, visibleRows));
//   }, [colleges, searchTerm, visibleRows]);

//   useEffect(() => {
//     if (sortColumn) {
//       const sorted = [...filteredColleges].sort((a, b) => {
//         const aValue = a[sortColumn];
//         const bValue = b[sortColumn];
//         if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
//         if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
//         return 0;
//       });
//       setFilteredColleges(sorted);
//     }
//   }, [sortColumn, sortDirection, filteredColleges]);

//   const handleScroll = () => {
//     const scrollHeight = document.documentElement.scrollHeight;
//     const scrollTop = document.documentElement.scrollTop;
//     const clientHeight = document.documentElement.clientHeight;
//     if (scrollTop + clientHeight >= scrollHeight) {
//       setVisibleRows((prevRows) => prevRows + 10);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleSort = (column) => {
//     if (sortColumn === column) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortColumn(column);
//       setSortDirection("asc");
//     }
//   };

//   const handleApplyNow = (collegeName) => {
//      window.location.href = `https://example.com/apply/${collegeName}`;
//   };

//   const handleDownloadBrochure = (collegeName) => {
//     setShowFlashMessage(true);
//     setTimeout(() => {
//       setShowFlashMessage(false);
//     }, 2000);
//     console.log(`Downloading brochure for ${collegeName}`);
//   };

//   const handleAddToCompare = (collegeName) => {
//     console.log(`Adding ${collegeName} to compare list`);
//   };

//   return (
//     <div className="flex flex-col">
//       <div className="flex justify-center mb-4">
//         <input
//           type="text"
//           placeholder="Search by college name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort("rank")}
//               >
//                 CD Rank
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort("collegeName")}
//               >
//                 Colleges
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort("fees")}
//               >
//                 Course Fees
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort("placement")}
//               >
//                 Placement
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort("userRating")}
//               >
//                 User Reviews
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort("ranking")}
//               >
//                 Ranking
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredColleges.map((college, index) => (
//               <tr key={index}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-500">{college.rank}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 h-10 w-10">
//                       <img
//                         className="h-10 w-10 rounded-full"
//                         src={college.logo}
//                         alt=""
//                       />
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">
//                         {college.collegeName}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {college.location}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {college.course}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {college.cutoff}
//                       </div>
//                       <div className="flex items-center mt-2">
//                         <a
//                           href="#"
//                           className="px-3 text-amber-500 mr-2 text-center text-decoration-none"
//                           onClick={() => handleApplyNow(college.collegeName)}
//                         >
//                           <FontAwesomeIcon icon={faCheckCircle} /> Apply Now
//                         </a>
//                         <a
//                           href="#"
//                           className="px-3 py-1 text-green-500 mr-2 text-center text-decoration-none"
//                           onClick={() =>
//                             handleDownloadBrochure(college.collegeName)
//                           }
//                         >
//                           <FontAwesomeIcon icon={faDownload} /> Download
//                           Brochure
//                         </a>
//                         <a
//                           href="#"
//                           className="px-3 py-1 text-gray-500 text-center text-decoration-none"
//                           onClick={() =>
//                             handleAddToCompare(college.collegeName)
//                           }
//                         >
//                           <FontAwesomeIcon icon={faPlusCircle} /> Add To Compare
//                         </a>
//                       </div>
//                       {showFlashMessage && (
//                         <div className="text-sm text-green-500 mt-2">
//                           Downloading brochure...
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">
//                     <div className="text-green-500">
//                       ₹{college.fees.toLocaleString()}
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     {college.feesDescription}
//                   </div>
//                   <br />
//                   <a
//                     href="#"
//                     className="px-3 py-1 text-amber-500 text-decoration-none"
//                   >
//                     <FontAwesomeIcon icon={faPlusCircle} /> Compare Fees
//                   </a>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   <div>
//                     {college.placement.average ? (
//                       <div>
//                         Average Package:
//                         <span className="text-green-500">
//                           {" "}
//                           ₹{college.placement.average.toLocaleString()}
//                         </span>
//                       </div>
//                     ) : (
//                       ""
//                     )}
//                   </div>
//                   <div>
//                     {college.placement.highest ? (
//                       <div>
//                         Highest Package:
//                         <span className="text-green-500">
//                           {" "}
//                           ₹{college.placement.highest.toLocaleString()}
//                         </span>
//                       </div>
//                     ) : (
//                       ""
//                     )}
//                   </div>
//                   <br />
//                   <a
//                     href="#"
//                     className="px-3 py-1 text-amber-500 text-decoration-none"
//                   >
//                     <FontAwesomeIcon icon={faPlusCircle} /> Compare Placement
//                   </a>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   <div>{college.userRating}/10</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   <div>{college.ranking}</div>
//                   {college.featured && (
//                     <div className="text-green-500">Featured</div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CollegeTable;
