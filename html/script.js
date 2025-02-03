document.addEventListener('DOMContentLoaded', function () {

    const timestamp = new Date().getTime(); // or use any method to generate a unique value
    const cacheBuster = `?t=${timestamp}`;

    // Fetch JSON data
    fetch('stats.json' + cacheBuster)
        .then(response => response.json())
        .then(data => {
            // Sort data by value in descending order
            data.sort((a, b) => b.wifi_count - a.wifi_count);

            // Extract labels and values from sorted data
            const labels = data.map(item => item.user);
            const values = data.map(item => item.wifi_count);

            // Create a bar chart for the top 5 results
            createTop5BarChart(labels.slice(0, 5), values.slice(0, 5));

            // Display the entire ordered list with two columns
            displaySpreadsheetList(labels, values);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function createTop5BarChart(labels, values) {
    const ctxTop5 = document.getElementById('top5-bar-chart').getContext('2d');

    new Chart(ctxTop5, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'New WiFi Discovered',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false, // Set to false to hide the legend
                },
            },
        },
    });
}


// Add a similar function for the ordered bar chart if needed

function displaySpreadsheetList(labels, values) {
    const orderedListContainer = document.getElementById('ordered-list');

    var total_wifi = 0;

    for (let i = 0; i < labels.length; i++) {
        const listItem = document.createElement('li');

        // Create two spans, one for position and one for label
        const positionSpan = document.createElement('span');
        positionSpan.textContent = i + 1;
        positionSpan.classList.add('position-column');

        const labelSpan = document.createElement('span');
        labelSpan.textContent = labels[i];
        labelSpan.classList.add('label-column');

        const valueSpan = document.createElement('span');
        valueSpan.textContent = values[i];
        valueSpan.classList.add('value-column');

        listItem.appendChild(positionSpan);
        listItem.appendChild(labelSpan);
        listItem.appendChild(valueSpan);

        // Add the list item to the ordered list
        orderedListContainer.appendChild(listItem);

        total_wifi += values[i];
    }
    
    const listItem = document.createElement('li');

    // Create two spans, one for position and one for label
    const positionSpan = document.createElement('span');
    positionSpan.textContent = "";
    positionSpan.classList.add('position-column');

    const labelSpan = document.createElement('span');
    labelSpan.textContent = "Total New WiFi";
    labelSpan.classList.add('label-column');

    const valueSpan = document.createElement('span');
    valueSpan.textContent = total_wifi;
    valueSpan.classList.add('value-column');

    listItem.appendChild(positionSpan);
    listItem.appendChild(labelSpan);
    listItem.appendChild(valueSpan);

    orderedListContainer.appendChild(listItem);
}
