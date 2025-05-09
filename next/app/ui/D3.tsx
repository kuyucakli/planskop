"use client"

import * as d3 from "d3";
import { useRef, useEffect, useState, MouseEvent } from "react";


const DATA_PIE = [{ "name": "<5", "value": 19912018 }, { "name": "5-9", "value": 20501982 }, { "name": "10-14", "value": 20679786 }, { "name": "15-19", "value": 21354481 }, { "name": "20-24", "value": 22604232 }, { "name": "25-29", "value": 21698010 }, { "name": "30-34", "value": 21183639 }, { "name": "35-39", "value": 19855782 }, { "name": "40-44", "value": 20796128 }, { "name": "45-49", "value": 21370368 }, { "name": "50-54", "value": 22525490 }, { "name": "55-59", "value": 21001947 }, { "name": "60-64", "value": 18415681 }, { "name": "65-69", "value": 14547446 }, { "name": "70-74", "value": 10587721 }, { "name": "75-79", "value": 7730129 }, { "name": "80-84", "value": 5811429 }, { "name": "≥85", "value": 5938752 }];

export function D3() {
    const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));

    function onMouseMove(event: MouseEvent) {
        const [x, y] = d3.pointer(event);
        setData(data.slice(-200).concat(Math.atan2(x, y)));
    }

    return (
        <div onMouseMove={onMouseMove}>
            <LinePlot data={data} />
        </div>
    );

}




export function LinePlot({
    data,
    width = 640,
    height = 400,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 30,
    marginLeft = 40
}) {
    const gx = useRef();
    const gy = useRef();
    const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);
    const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);
    const line = d3.line((d, i) => x(i), y);
    useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
    useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);
    return (
        <svg width={width} height={height}>
            <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
            <g ref={gy} transform={`translate(${marginLeft},0)`} />
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(data)} />
            <g fill="white" stroke="currentColor" strokeWidth="1.5">
                {data.map((d, i) => (<circle key={i} cx={x(i)} cy={y(d)} r="2.5" />))}
            </g>
        </svg>
    );
}


export function PieChart(
    { data = DATA_PIE,
        width = 640,
        height = 400,
        marginTop = 20,
        marginRight = 20,
        marginBottom = 30,
        marginLeft = 40 }
) {
    // Create the pie layout and arc generator.

    const pie = d3.pie()
        .sort(null)
        .value(d => d.value);


    // Create the color scale.
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - 1);

    const arcs = pie(data);
    console.log(arcs);
    return (
        <svg width={width} height={height} viewBox={`${-width / 2}, ${-height / 2}, ${width}, ${height}`}>
            <g>
                {arcs.map((d) => <path key={d.data.name} fill={color(d.data.name)} d={arc(d)}>item</path>)}
            </g>
            <g></g>
        </svg>
    )
}

