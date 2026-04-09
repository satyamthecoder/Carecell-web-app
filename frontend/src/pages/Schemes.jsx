




//code new  above working but constant data 
import React, { useEffect, useState } from "react";
import { FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 FILTER STATES
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [income, setIncome] = useState("");
  //const [age, setAge] = "";
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState(""); // ✅ NEW

  const [visibleCount, setVisibleCount] = useState(10);
  const [expandedId, setExpandedId] = useState(null);

  // 🔥 PARAM BUILDER
  const buildParams = () => {
    const params = new URLSearchParams();

    if (search.trim()) params.append("search", search.trim());
    if (state) params.append("state", state);
    if (category) params.append("category", category);
    if (gender) params.append("gender", gender);
    if (income) params.append("income", income);
    if (age) params.append("age", age);
    if (occupation) params.append("occupation", occupation); // ✅ NEW

    return params.toString();
  };

  // 🔥 FETCH
  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError("");

      const queryString = buildParams();

      const res = await fetch(
        `http://localhost:5000/api/schemes${queryString ? `?${queryString}` : ""}`
      );

      let data = await res.json();

      // 🔥 FALLBACK (important UX)
      if (data.length === 0 && queryString) {
        const fallbackRes = await fetch("http://localhost:5000/api/schemes");
        data = await fallbackRes.json();
      }

      setSchemes(data);
      setVisibleCount(10);

    } catch (err) {
      console.error(err);
      setError("Failed to load schemes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [state, category, gender, income, age, occupation]);

  const handleSearch = () => {
    fetchSchemes();
  };

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
    <div className="p-4 bg-gray-100 min-h-screen">

      <h2 className="text-2xl font-bold mb-4">Find Schemes</h2>

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
          className="bg-blue-500 text-white px-4 rounded-xl"
        >
          Search
        </button>
      </div>

      {/* 🔥 FILTERS */}
      <div className="bg-white p-3 rounded-xl shadow mb-4 grid grid-cols-2 gap-2">

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

        {/* 🔥 NEW USER TYPE */}
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

      {/* 🔥 STATUS */}
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* 🔥 NO RESULTS UI */}
      {!loading && schemes.length === 0 && (
        <div className="text-center bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-2">No schemes found 😕</h3>
          <p className="text-sm text-gray-500 mb-4">
            Try changing filters or reset
          </p>

          <button
            onClick={resetFilters}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 🔥 RESULTS */}
      <div className="space-y-4">
        {schemes.slice(0, visibleCount).map((s) => (
          <div key={s._id} className="bg-white rounded-2xl shadow p-4">

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{s.name}</h3>
                <p className="text-xs text-gray-500">{s.state}</p>
              </div>

              <button
                onClick={() =>
                  setExpandedId(expandedId === s._id ? null : s._id)
                }
              >
                {expandedId === s._id ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              {s.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {s.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-200 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {expandedId === s._id && (
              <div className="mt-3 text-sm space-y-2">

                <div className="bg-gray-50 p-2 rounded">
                  💰 Income Limit: ₹{s.incomeLimit || "N/A"}
                </div>

                <div className="bg-gray-50 p-2 rounded">
                  🎯 Category: {s.category}
                </div>

                <div className="bg-gray-50 p-2 rounded">
                  🧾 Benefits: {s.benefits}
                </div>

                {s.applicationLink && (
                  <a href={s.applicationLink} target="_blank" rel="noreferrer">
                    <button className="w-full bg-green-500 text-white py-2 rounded">
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
          className="bg-blue-500 text-white w-full py-2 rounded-xl mt-4"
        >
          Load More
        </button>
      )}
    </div>
  );
}