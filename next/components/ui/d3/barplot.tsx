import * as d3 from "d3";
import { useEffect } from "react";

type Props = {
  id: string;
  data: {
    completions: Record<string, number>;
    repeatDayCount: number;
    dailyPlanTitle: string;
  };
};

export default function D3Barplot({ id, data }: Props) {
  useEffect(() => {
    const container = d3.select(`#chart-${id}`);
    container.select("svg").remove();

    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const svg = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", margin.left)
      .attr("y", -10)
      .attr("fill", "#555")
      .attr("font-size", "13px")
      .attr("font-weight", "bold")
      .text("Days Completed");

    // ✅ Convert completions object to array
    const completionsArray = Object.entries(data.completions).map(
      ([key, value]) => ({
        label: key,
        value,
      })
    );

    // X axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(completionsArray.map((d) => d.label))
      .padding(0.2);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    const max = data.repeatDayCount;

    // Dynamically choose a nice tick step
    let step;
    if (max <= 10) step = 1;
    else if (max <= 50) step = 5;
    else if (max <= 100) step = 10;
    else if (max <= 500) step = 50;
    else step = 100; // for really large ranges

    // Define the scale
    const y = d3.scaleLinear().domain([0, max]).range([height, 0]);

    // Create the tick values dynamically
    const ticks = d3.range(0, max + step, step).filter((t) => t <= max);

    // Append the axis with rounded integer labels
    svg.append("g").call(
      d3.axisLeft(y).tickValues(ticks).tickFormat(d3.format("d")) // ensures integer display
    );

    svg
      .append("circle")
      .attr("cx", 0) // slightly left of tick text
      .attr("cy", y(data.repeatDayCount))
      .attr("r", 4)
      .attr("fill", "#ff4400")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("pointer-events", "none"); // no mouse interference

    // Bars
    svg
      .selectAll("rect")
      .data(completionsArray)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.label) ?? 0)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", "#ff4400");
  }, [id, data]);

  return <div id={`chart-${id}`}></div>;
}
