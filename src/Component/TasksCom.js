import React from 'react';

const TasksCom = ({ task, showStartButton, handleA1Click, handleA2Click, handleA3Click, a3Class, a3Text }) => {
  const { id, title, reward, link } = task;

  return (
    <div id={`T${id}`} className="bg-zinc-800 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-purple-400">{reward}</p>
        </div>
        <div className="flex space-x-2">
          {showStartButton && (
            <button className={`bg-purple-600 text-white px-4 py-2 rounded-lg`} onClick={handleA1Click}>Start</button>
          )}
          {!showStartButton && link && (
            <>
              <a href={link} target="_blank" rel="noopener noreferrer">
                <button className={`bg-purple-600 text-white px-4 py-2 rounded-lg`} onClick={handleA2Click}>Go</button>
              </a>
              <button className={`text-white px-4 py-2 rounded-lg ${a3Class}`} onClick={handleA3Click}>{a3Text}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksCom;
