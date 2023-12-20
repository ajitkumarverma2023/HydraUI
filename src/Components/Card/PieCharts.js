import React from 'react';

const PieCharts = () => {
  const data = [30, 50, 20]; // Values for each segment
  const colors = ['#FF6384', '#36A2EB', '#FFCE56']; // Colors for each segment

  const total = data.reduce((acc, value) => acc + value, 0);
  let cumulativePercent = 0;

  const createPathData = (percent) => {
    const x = Math.cos(2 * Math.PI * cumulativePercent);
    const y = Math.sin(2 * Math.PI * cumulativePercent);

    cumulativePercent += percent / 100;

    const pathData = [
      `M 0 0`, // Move to center
      `L ${x} ${y}`, // Line to the start of the segment
      `A 1 1 0 ${percent > 50 ? 1 : 0} 1 ${Math.cos(2 * Math.PI * cumulativePercent)} ${Math.sin(2 * Math.PI * cumulativePercent)}`, // Arc to the end of the segment
      `Z`, // Close the path
    ];

    return pathData.join(' ');
  };

  return (
    <div>
      <svg width="200" height="200" viewBox="-1 -1 2 2">
        {data.map((value, index) => {
          const percent = (value / total) * 100;
          return (
            <path
              key={index}
              d={createPathData(percent)}
              fill={colors[index]}
              transform={`rotate(-90)`} // Rotate to start from the top
            />
          );
        })}
      </svg>
    </div>
  );
};

export default PieCharts;
