const ColorLegend = ({ list }: { list: { color: string, label: string }[] }) => {
    return (
        <ul>
            {list.map((listItem, i) => (
                <li key={i} className="text-xs">
                    <span
                        className=" inline-block w-2 h-2 mr-2"
                        style={{ backgroundColor: listItem.color }}
                    />
                    {listItem.label}
                </li>
            ))}
        </ul>
    )
}


export default ColorLegend;