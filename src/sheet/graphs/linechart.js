export function createLineChart(data, container, width, height) {
    function render(data, width, height) {
        container.innerHTML = '';
        container.innerHTML = `
                    <div class="chart-container">
                        <div class="chart"></div>
                    </div>
                    <div class="tooltip"></div>
                `;
        const chart = container.querySelector('.chart');
        const tooltip = container.querySelector('.tooltip');
        const parsedData = data.map(item => ({
            value: parseFloat(item[0]),
            date: item[1]
        }));

        // Get dimensions
        // const width = chart.offsetWidth;
        // const height = chart.offsetHeight;
        const margin = { top: 20, right: 50, bottom: 50, left: 50 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        // Create SVG
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        svg.style.overflow = 'visible';
        chart.appendChild(svg);

        // Create chart group
        const chartGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        chartGroup.setAttribute("transform", `translate(${margin.left}, ${margin.top})`);
        svg.appendChild(chartGroup);

        // Calculate scales
        const xScale = (date, index) => {
            const totalPoints = parsedData.length;
            // Add slight padding to the sides
            const padding = 0.02 * chartWidth;
            return padding + (index / (totalPoints - 1)) * (chartWidth - 2 * padding);
        };

        const maxValue = Math.max(...parsedData.map(d => d.value));
        const yScale = (value) => {
            return chartHeight - (value / maxValue) * chartHeight;
        };

        // Create line
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        let pathData = "M";

        parsedData.forEach((d, i) => {
            const x = xScale(d.date, i);
            const y = yScale(d.value);

            pathData += `${x},${y} `;

            if (i < parsedData.length - 1) {
                pathData += "L";
            }

            // Add points
            const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            point.setAttribute("class", "point");
            point.setAttribute("cx", x);
            point.setAttribute("cy", y);
            point.setAttribute("r", 4);
            point.setAttribute("data-value", d.value);
            point.setAttribute("data-date", d.date);

            // Add hover events
            point.addEventListener('mouseover', (e) => {
                tooltip.style.display = 'block';
                tooltip.innerHTML = `Date: ${d.date}<br>Value: ${d.value}`;
                tooltip.style.left = (e.pageX + 10) + 'px';
                tooltip.style.top = (e.pageY - 10) + 'px';
            });

            point.addEventListener('mouseout', () => {
                tooltip.style.display = 'none';
            });

            chartGroup.appendChild(point);
        });

        path.setAttribute("class", "line");
        path.setAttribute("d", pathData);
        chartGroup.appendChild(path);

        // Add x-axis labels (dates)
        const labelPadding = 5; // Additional padding for labels
        parsedData.forEach((d, i) => {
            if (i % Math.ceil(parsedData.length / 5) === 0 || i === parsedData.length - 1) {
                const xPos = xScale(d.date, i);

                // Only draw label if it fits within bounds
                if (xPos >= 0 && xPos <= chartWidth) {
                    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    label.setAttribute("class", "x-axis");
                    label.setAttribute("x", xPos);
                    label.setAttribute("y", chartHeight + 20);
                    label.setAttribute("text-anchor", "middle");

                    // Shorten date format if needed
                    const labelText = d.date.length > 10 ? d.date.substring(5) : d.date;
                    label.textContent = labelText;

                    // Check if label would extend beyond right edge
                    const textLength = labelText.length * 6; // Approximate width
                    if (xPos + textLength / 2 > chartWidth) {
                        label.setAttribute("text-anchor", "end");
                        label.setAttribute("x", chartWidth - labelPadding);
                    }
                    // Check if label would extend beyond left edge
                    else if (xPos - textLength / 2 < 0) {
                        label.setAttribute("text-anchor", "start");
                        label.setAttribute("x", labelPadding);
                    }

                    chartGroup.appendChild(label);
                }
            }
        });

        // Add y-axis labels (values)
        for (let i = 0; i <= 5; i++) {
            const value = (maxValue / 5) * i;
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("class", "y-axis");
            label.setAttribute("x", -10);
            label.setAttribute("y", yScale(value));
            label.setAttribute("text-anchor", "end");
            label.setAttribute("dy", "0.35em");
            label.textContent = value.toFixed(1);
            chartGroup.appendChild(label);

            // Add grid line
            const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            gridLine.setAttribute("x1", 0);
            gridLine.setAttribute("y1", yScale(value));
            gridLine.setAttribute("x2", chartWidth);
            gridLine.setAttribute("y2", yScale(value));
            gridLine.setAttribute("stroke", "#eee");
            gridLine.setAttribute("stroke-dasharray", "2,2");
            chartGroup.insertBefore(gridLine, chartGroup.firstChild);
        }

        // Add axis titles
        const xAxisTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
        xAxisTitle.setAttribute("class", "x-axis");
        xAxisTitle.setAttribute("x", chartWidth / 2);
        xAxisTitle.setAttribute("y", chartHeight + 40);
        xAxisTitle.setAttribute("text-anchor", "middle");
        xAxisTitle.textContent = "Date";
        chartGroup.appendChild(xAxisTitle);

        const yAxisTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
        yAxisTitle.setAttribute("class", "y-axis");
        yAxisTitle.setAttribute("transform", "rotate(-90)");
        yAxisTitle.setAttribute("x", -chartHeight / 2);
        yAxisTitle.setAttribute("y", -40); // Adjusted to not overlap with labels
        yAxisTitle.setAttribute("text-anchor", "middle");
        yAxisTitle.textContent = "Value";
        chartGroup.appendChild(yAxisTitle);
    }
    function update() {
        container.innerHTML = '';
    }
    function destroy() {
        container.innerHTML = '';
    }
    render(data, width, height);
    return { container, update, destroy, render };
}