export default function HandWrittenNums({ num }: { num: number }) {
  let paddedNumStr = num.toString().padStart(2, "0");
  const digitWidth = 60;
  const digitHeight = 80;

  const style = {
    display: "inline-block",

    width: digitWidth,
    height: digitHeight,
    backgroundImage: "url('/images/hand-written-nums.png')",
    backgroundPosition: num * 80,
  };

  return (
    <div className="scale-80">
      {paddedNumStr.split("").map((d, index) => (
        <span
          key={index}
          className="invert-0"
          style={{
            ...style,
            backgroundPositionX: ((parseInt(d) + 9) % 10) * -digitWidth,
          }}
        />
      ))}
    </div>
  );
}
