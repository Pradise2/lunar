import React, { useState, useEffect } from 'react';
import TasksCom from '../Component/TasksCom';
import TasksData from '../Component/TasksData';
import { useTotalBal } from '../Context/TotalBalContext';
import Footer from "../Component/Footer"

const Tasks = () => {
  const { addTotalBal } = useTotalBal();
  const [t6Value, setT6Value] = useState(0); // Initial value of t6
  const [taskStates, setTaskStates] = useState({});

  // useEffect to initialize taskStates when TasksData is available
  useEffect(() => {
    if (TasksData) {
      const initialState = TasksData.reduce((acc, task) => {
        acc[task.id] = {
          showStartButton: true,
          a3Text: 'Check',
          a3Class: 'bg-purple-500',
          claimClicked: false,
        };
        return acc;
      }, {});
      setTaskStates(initialState);
    }
  }, []); // Empty dependency array ensures this runs only once after initial render

  const handleA1Click = (id) => {
    setTaskStates((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        showStartButton: false,
        a3Text: 'Check',
        a3Class: 'bg-purple-500',
      },
    }));
  };

  const handleA2Click = (id) => {
    setTaskStates((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        a3Class: 'bg-blue-500',
      },
    }));
  };

  const handleA3Click = (id) => {
    setTaskStates((prevState) => {
      const taskState = prevState[id];
      if (taskState.a3Class === 'bg-blue-500' && taskState.a3Text !== 'Claim') {
        setTimeout(() => {
          setTaskStates((prevState) => ({
            ...prevState,
            [id]: {
              ...prevState[id],
              a3Text: 'Claim',
            },
          }));
        }, 10000);
      } else if (taskState.a3Text === 'Claim' && !taskState.claimClicked) {
        const task = TasksData.find(task => task.id === id);
        const rewardValue = parseInt(task.reward.replace(/\D/g, ''), 10); // Extract numerical reward value
        addTotalBal(rewardValue, 'task'); // Update totalBal using addTotalBal from context with 'task' source
        setT6Value((prevValue) => prevValue + rewardValue); // Update t6Value
        setTaskStates((prevState) => ({
          ...prevState,
          [id]: {
            ...prevState[id],
            claimClicked: true,
          },
        }));
      }
      return prevState;
    });
  };

  // Render logic
  return (
    <div className="bg-zinc-900 text-white min-h-screen flex flex-col items-center p-4 space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Complete the mission, earn the commission!</h1>
        <p className="text-zinc-400 mt-2">But hey, only qualified actions unlock the Lunar galaxy! ✨</p>
        <div className="w-full rounded-lg p-2 mb-1">
          <p id="T6" className="text-center text-3xl font-bold">
            {t6Value.toLocaleString()}&nbsp;<span className="text-purple-400">Lunar</span>
          </p>
        </div>
      </div>

      <div className=' justify-around w-full max-w-md rounded-lg p-4 mb-4 '>
        <div className="space-y-4">
          {TasksData && TasksData.map((task) => (
            <TasksCom 
              key={task.id} 
              task={task} 
              showStartButton={taskStates[task.id]?.showStartButton} 
              handleA1Click={() => handleA1Click(task.id)} 
              handleA2Click={() => handleA2Click(task.id)} 
              handleA3Click={() => handleA3Click(task.id)} 
              a3Class={taskStates[task.id]?.a3Class} 
              a3Text={taskStates[task.id]?.a3Text} 
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Tasks;
