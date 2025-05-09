export default function HandWrittenNums({ num }: { num: number }) {

    let paddedNumStr = num.toString().padStart(2, '0');
    const digitWidth = 60;
    const digitHeight = 80;

    const style = {
        display: "inline-block",
        width: digitWidth,
        height: digitHeight,
        backgroundImage: "url('/images/hand-written-nums.png')",
        backgroundPosition: num * 80,


    }

    return (
        <div style={{ transform: "scale(0.5)" }}>
            {paddedNumStr.split("").map((d, index) => <span key={index} className="color-filter-invertable" style={{ ...style, backgroundPositionX: (parseInt(d) + 9) % 10 * -digitWidth }} />)}
        </div>
    )


}