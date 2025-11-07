import * as d3 from "d3";
import { useEffect } from "react";

type Props = {
  id: string;
  data: {
    completions: Record<string, number>;
    repeatDayCount: number;
    dailyPlanTitle: string;
    daysSinceStart: number;
  };
  className?: string;
};

export default function D3Barplot({ id, data, className }: Props) {
  useEffect(() => {
    const container = d3.select(`#chart-${id}`);
    container.select("svg").remove();

    const node = container.node();
    if (!(node instanceof HTMLElement)) return;

    const { width: containerWidth, height: containerHeight } =
      node.getBoundingClientRect();

    const margin = { top: 40, right: 8, bottom: 64, left: 40 },
      width = containerWidth - margin.left - margin.right,
      height = 320 - margin.top - margin.bottom;

    const svg = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

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
      .call(
        d3
          .axisBottom(x)
          .tickFormat((label) =>
            label.length > 10 ? label.slice(0, 10) + "…" : label
          )
      )
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "11px")
      .style("fill", "#777");

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

    // --- Tooltip setup ---
    const tooltip = container
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.75)")
      .style("color", "white")
      .style("padding", "6px 8px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none") // don't block mouse
      .style("opacity", 0);

    // ✅ Draw dashed line for total repeat day count
    const totalY = y(data.repeatDayCount);

    svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", totalY)
      .attr("y2", totalY)
      .attr("stroke", "#777")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4 4");

    // Add label for total
    svg
      .append("text")
      .attr("x", width - 14)
      .attr("y", totalY - 6)
      .attr("fill", "#777")
      .attr("font-size", "11px")
      .attr("text-anchor", "end")
      .text(`${data.repeatDayCount} days goal`);

    // ✅ Draw horizontal dashed line for "today"
    if (data.daysSinceStart) {
      const todayY = y(data.daysSinceStart);

      // Draw the line
      svg
        .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", todayY)
        .attr("y2", todayY)
        .attr("stroke", "#ff880088")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4 4");

      // Add "Today" label at the right end
      svg
        .append("text")
        .attr("x", width - 14)
        .attr("y", todayY - 6) // small vertical offset
        .attr("fill", "#ff880088")
        .attr("font-size", "11px")
        .attr("text-anchor", "end")
        .text("Today");
    }
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
      .attr("fill", "#ff4400")
      .on("mouseover", function (event, d) {
        const percent = ((d.value / data.repeatDayCount) * 100).toFixed(1);

        tooltip.style("opacity", 1).html(`
      <div style="text-align:left;">
        <div><strong>${d.label}</strong></div>
        <div>${d.value} days done</div>
        <div>${percent}% completed</div>
      </div>
    `);

        d3.select(this).attr("fill", "#ff7733"); // highlight bar
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseleave", function () {
        tooltip.style("opacity", 0);
        d3.select(this).attr("fill", "#ff4400"); // restore color
      });
  }, [id, data]);

  return <div id={`chart-${id}`} className={`${className}`}></div>;
}
