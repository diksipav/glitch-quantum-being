
export function RitualCircle() {
  const dots = [
    { top: "20%", left: "50%" },
    { top: "35%", left: "25%" },
    { top: "65%", left: "80%" },
    { top: "80%", left: "40%" },
    { top: "50%", left: "50%" },
  ];

  return (
    <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto my-8">
      <div className="absolute inset-0 border-2 border-dashed border-primary rounded-full animate-rotate"></div>
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-primary rounded-full"
          style={{ 
            top: dot.top, 
            left: dot.left,
            transform: "translate(-50%, -50%)"
          }}
        ></div>
      ))}
    </div>
  );
}
