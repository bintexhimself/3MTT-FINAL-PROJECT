document.getElementById("searchForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = document.getElementById("searchInput").value;
    const resultsDiv = document.getElementById("items-container");

    try {
      const response = await fetch(`/search/tasks`);
      
      const tasks = await response.json();
      console.log(tasks);
      const datas = tasks.filter(task =>{
        return task.title.toLowerCase().includes(query.toLowerCase());
        // query.toLowerCase().includes(task.description.toLowerCase())
      })

      console.log(datas);

      if (datas.length > 0) {
        resultsDiv.innerHTML = ""; // Clear previous results

        datas.forEach((item) => {
          const result = document.createElement("div");
          result.setAttribute('id', 'items');
          result.innerHTML += `
            <h3 id='task'>${item.title}</h3>
            <br>
            <div id='description'>Description:${item.description}</div><br>
            <div>${item.priority}</div><br>
            <small>${item.deadline}</small>
            
            
            <hr>
          `;
          resultsDiv.appendChild(result);
        });
      } else {
        resultsDiv.innerHTML = "<p>No results found.</p>";
      }
    } catch (error) {
      resultsDiv.innerHTML = "<p>Error fetching results.</p>";
    }
  });