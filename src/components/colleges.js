import React, { useState, useEffect, useRef, useCallback } from "react";
import collegeData from "./colleges.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faDownload,
  faPlusCircle,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

const CollegeTable = () => {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [visibleRows, setVisibleRows] = useState(10);
  const [showFlashMessage, setShowFlashMessage] = useState(false);
  const observer = useRef();

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

  const lastRowRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisibleRows((prevRows) => prevRows + 10);
        }
      });
      if (node) observer.current.observe(node);
    },
    [observer]
  );

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
      <AnimatePresence>
        {showFlashMessage && (
          <motion.div
            className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mt-4"
            role="alert"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline">
              Brochure is being downloaded.
            </span>
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
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by college name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <motion.div
              initial={{ scale: 1 }}
              animate={searchTerm ? { scale: 0 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </motion.div>
            {searchTerm && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  className="text-gray-400 cursor-pointer"
                  onClick={() => setSearchTerm("")}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer bg-sky-200"
                onClick={() => handleSort("rank")}
              >
                CD Rank
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer bg-sky-200"
                onClick={() => handleSort("collegeName")}
              >
                Colleges
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer bg-sky-200"
                onClick={() => handleSort("fees")}
              >
                Course Fees
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer bg-sky-200"
                onClick={() => handleSort("placement")}
              >
                Placement
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer bg-sky-200"
                onClick={() => handleSort("userRating")}
              >
                User Reviews
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer bg-sky-200"
                onClick={() => handleSort("ranking")}
              >
                Ranking
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredColleges.map((college, index) => {
              const isLastRow = index === filteredColleges.length - 1;
              return (
                <motion.tr
                  key={index}
                  className={`${
                    college.featured ? "bg-red-50" : ""
                  } hover:bg-gray-100 transition-colors duration-300`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  ref={isLastRow ? lastRowRef : null}
                >
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
                            <FontAwesomeIcon icon={faPlusCircle} /> Add To
                            Compare
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
                          <span className="text-green-500">
                            {" "}
                            ₹{college.placement.average.toLocaleString()}
                          </span>{" "}
                          <br />
                          Average Package
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div>
                      {college.placement.highest ? (
                        <div>
                          <span className="text-green-500">
                            {" "}
                            ₹{college.placement.highest.toLocaleString()}
                          </span>{" "}
                          <br />
                          Highest Package
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
                    <div className="mt-1">
                      Based on {college.usersRating} users
                    </div>
                  </div>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{college.ranking}</div>
                    {college.featured && (
                      <div className="text-green-500">Featured</div>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollegeTable;

 