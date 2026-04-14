




//code new  above working but constant data 
import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiMapPin,
  FiDollarSign,
  FiTag
} from "react-icons/fi";

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [income, setIncome] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");

  const [visibleCount, setVisibleCount] = useState(10);
  const [expandedId, setExpandedId] = useState(null);

  const buildParams = () => {
    const params = new URLSearchParams();

    if (search.trim()) params.append("search", search.trim());
    if (state) params.append("state", state);
    if (category) params.append("category", category);
    if (gender) params.append("gender", gender);
    if (income) params.append("income", income);
    if (age) params.append("age", age);
    if (occupation) params.append("occupation", occupation);

    return params.toString();
  };

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError("");

      const queryString = buildParams();

      const res = await fetch(
        `http://localhost:5000/api/schemes${queryString ? `?${queryString}` : ""}`
      );

      let data = await res.json();

      if (data.length === 0 && queryString) {
        const fallbackRes = await fetch("http://localhost:5000/api/schemes");
        data = await fallbackRes.json();
      }

      setSchemes(data);
      setVisibleCount(10);

    } catch (err) {
      setError("Failed to load schemes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [state, category, gender, income, age, occupation]);

  const handleSearch = () => fetchSchemes();

  const resetFilters = () => {
    setSearch("");
    setState("");
    setCategory("");
    setGender("");
    setIncome("");
    setAge("");
    setOccupation("");
    fetchSchemes();
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🎯 Find Government Schemes
      </h2>

      {/* 🔍 SEARCH */}
      <div className="flex gap-2 mb-4">
        <div className="flex items-center bg-white rounded-xl px-3 py-2 shadow flex-1">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search schemes..."
            className="flex-1 outline-none text-sm"
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 rounded-xl shadow"
        >
          Search
        </button>
      </div>

      {/* 🔥 FILTERS */}
      <div className="bg-white p-4 rounded-2xl shadow mb-4 grid grid-cols-2 gap-2">

        <div className="col-span-2 flex items-center gap-2 text-gray-600 mb-2">
          <FiFilter />
          <span className="text-sm font-medium">Filters</span>
        </div>

        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">All States</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Delhi">Delhi</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Financial Aid">Financial Aid</option>
        </select>

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">All Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select value={occupation} onChange={(e) => setOccupation(e.target.value)}>
          <option value="">User Type</option>
          <option value="student">Student</option>
          <option value="farmer">Farmer</option>
          <option value="worker">Worker</option>
        </select>

        <input
          type="number"
          placeholder="Income (₹)"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className="border rounded px-2"
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="border rounded px-2"
        />
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* NO RESULT */}
      {!loading && schemes.length === 0 && (
        <div className="text-center bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-2">No schemes found 😕</h3>
          <button
            onClick={resetFilters}
            className="bg-indigo-500 text-white px-4 py-2 rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* RESULTS */}
      <div className="space-y-4">
        {schemes.slice(0, visibleCount).map((s) => (
          <div
            key={s._id}
            className="bg-white rounded-2xl shadow-md p-4 border hover:shadow-lg transition"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800">{s.name}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <FiMapPin /> {s.state}
                </p>
              </div>

              <button
                onClick={() =>
                  setExpandedId(expandedId === s._id ? null : s._id)
                }
              >
                {expandedId === s._id ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>

            {/* DESC */}
            <p className="text-sm text-gray-600 mt-2">{s.description}</p>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 mt-2">
              {s.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 flex items-center gap-1"
                >
                  <FiTag /> {tag}
                </span>
              ))}
            </div>

            {/* EXPANDED */}
            {expandedId === s._id && (
              <div className="mt-3 text-sm space-y-2">

                <div className="bg-green-50 p-2 rounded flex items-center gap-2">
                  <FiDollarSign className="text-green-600" />
                  Income Limit: ₹{s.incomeLimit || "N/A"}
                </div>

                <div className="bg-blue-50 p-2 rounded">
                  🎯 Category: {s.category}
                </div>

                <div className="bg-gray-50 p-2 rounded">
                  🧾 Benefits: {s.benefits}
                </div>

                {s.applicationLink && (
                  <a href={s.applicationLink} target="_blank" rel="noreferrer">
                    <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-xl shadow">
                      Apply Now
                    </button>
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* LOAD MORE */}
      {visibleCount < schemes.length && (
        <button
          onClick={() => setVisibleCount(visibleCount + 10)}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white w-full py-2 rounded-xl mt-4 shadow"
        >
          Load More
        </button>
      )}
    </div>
  );
}