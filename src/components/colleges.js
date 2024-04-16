import React, { useState, useEffect } from 'react';
import collegeData from './colleges.json';

const CollegeTable = () => {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [visibleRows, setVisibleRows] = useState(10);

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
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="flex flex-col">
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
                onClick={() => handleSort('rank')}
              >
                CD Rank
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('collegeName')}
              >
                Colleges
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('fees')}
              >
                Course Fees
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('placement')}
              >
                Placement
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('userRating')}
              >
                User Reviews
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('ranking')}
              >
                Ranking
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredColleges.map((college, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{college.rank}</div>
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
                        <button className="px-3 py-1 bg-blue-500 text-white rounded-md mr-2">
                          Apply Now
                        </button>
                        <button className="px-3 py-1 bg-green-500 text-white rounded-md mr-2">
                          Download Brochure
                        </button>
                        <button className="px-3 py-1 bg-gray-500 text-white rounded-md">
                          Add To Compare
                        </button>
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
                        <span className="text-green-500"> ₹
                          {college.placement.highest.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{college.userRating}/10</div>
                </td>
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
 