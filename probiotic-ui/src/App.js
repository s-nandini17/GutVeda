import React, { useState } from "react";
import PROBIOTIC_DB from "./data/probiotic_db.json";

function App() {
  const [query, setQuery] = useState("");

  const results = PROBIOTIC_DB.filter((item) =>
    item.disease.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Probiotic Recommendation App</h1>

      <input
        type="text"
        placeholder="Enter disease (e.g. Bloating)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      <div style={{ marginTop: "20px" }}>
        {results.length > 0 ? (
          results.map((item, index) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <h3>{item.probiotic}</h3>
              <p><b>Disease:</b> {item.disease}</p>
              <p><b>Food Sources:</b> {item.food_sources.join(", ")}</p>
            </div>
          ))
        ) : (
          query && <p>No results found</p>
        )}
      </div>
    </div>
  );
}

export default App;
