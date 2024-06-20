import React from "react";

const testData = [
  { completed: 60, level: 1, totalLevels: 9 },
  { completed: 30, level: 2, totalLevels: 9 },
  { completed: 90, level: 3, totalLevels: 9 },
  { completed: 75, level: 4, totalLevels: 9 },
  { completed: 50, level: 5, totalLevels: 9 },
  { completed: 20, level: 6, totalLevels: 9 },
  { completed: 10, level: 7, totalLevels: 9 },
  { completed: 40, level: 8, totalLevels: 9 },
  { completed: 80, level: 9, totalLevels: 9 },
];

const ProgressBar = ({ completed, level, totalLevels }) => {
  const getProgressBarColor = (level) => {
    const hue = (level / totalLevels) * 120; // Generate hue based on level
    return `hsl(${hue}, 100%, 50%)`; // Convert hue to color
  };

  const getClaimLevelText = (level) => {
    const levelTexts = [
      "New Moon",
      "Waxing Crescent",
      "Half Moon",
      "Waxing Gibbous",
      "Full Moon",
      "Blue Moon",
      "Wolf Moon",
      "Blood Moon",
      "Black Moon",
      "Harvest Moon"
    ];
    return levelTexts[level - 1];
  };

  const containerStyles = {
    height: 20, // Reduce container height
    width: "80%", // Reduce container width
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: "auto", // Center the progress bar
    marginTop: 5, // Add top margin for spacing
    padding: 5, // Reduce container padding
  };

  const fillerStyles = {
    height: "100%",
    width: `${completed}%`,
    backgroundColor: getProgressBarColor(level),
    borderRadius: "inherit",
    textAlign: "right",
    transition: "width 0.5s ease-in-out",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  };

  const labelStyles = {
    padding: 4,
    color: "white",
    fontWeight: "bold",
  };

  const levelStyles = {
    color: "white",
    fontWeight: "normal",
    textAlign: "left",
    flex: 1,
  };

  const claimLevelStyles = {
    color: "white",
    fontWeight: "normal",
    textAlign: "right",
    flex: 1,
    
  };

  const progressBarContainerStyles = {
    width: "80%",
    margin: "auto",
    marginTop: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  };

  return (
    <div style={{ marginBottom: 15 }}>
      <div style={progressBarContainerStyles}>
        <div style={levelStyles}>{`Level: ${level} / ${totalLevels}`}</div>
        <div style={claimLevelStyles}>{getClaimLevelText(level)}</div>
      </div>
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles}>{`${completed}%`}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
