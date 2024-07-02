import React, { useState, useEffect, useCallback } from 'react';
import TasksCom from '../Component/TasksCom';
import TasksData from '../Component/TasksData';
import { useTotalBal } from '../Context/TotalBalContext';
import Footer from "../Component/Footer";
import { saveProgress, getProgress } from '../firebaseConfig';

const Tasks = () => {
  const defaultData = {
    tasksValue: 0,
    taskStates: {},
    completedTasks: {},
  };

  const { addTotalBal, totalBal, setTotalBal } = useTotalBal();
  const [tasksValue, setTasksValue] = useState(defaultData.tasksValue);
  const [taskStates, setTaskStates] = useState(defaultData.taskStates);
  const [completedTasks, setCompletedTasks] = useState(defaultData.completedTasks);
  const [userId, setUserId] = useState(null);

  window.Telegram.WebApp.expand();

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
        
      } else {
        console.error('User data is not available.');
      }
    } else {
      console.error('Telegram WebApp script is not loaded.');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const userData = await getProgress(userId);
          if (userData) {
            setTasksValue(userData.tasksValue || defaultData.tasksValue);
            setTaskStates(userData.taskStates || defaultData.taskStates);
            setCompletedTasks(userData.completedTasks || defaultData.completedTasks);
            setTotalBal(userData.totalBal || 0); // Ensure totalBal is set correctly
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchData();
  }, [userId, setTotalBal]);

  const saveData = useCallback(async (updatedData = {}) => {
    try {
      await saveProgress(userId, {
        tasksValue,
        taskStates,
        completedTasks,
        totalBal,
        ...updatedData,
      });
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }, [userId, tasksValue, taskStates, completedTasks, totalBal]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (userId) {
        saveData();
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (userId) {
        saveData();
      }
    };
  }, [userId, tasksValue, taskStates, completedTasks, totalBal, saveData]);

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
      setTaskStates((prevStates) => ({
        ...initialState,
        ...prevStates,
      }));
    }
  }, []);

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

      if (taskState.claimClicked) {
        return prevState;
      }

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
        const rewardValue = parseInt(task.reward.replace(/\D/g, ''), 10);

        console.log('Claiming reward:', rewardValue, 'for task ID:', id);

        const halfRewardValue = 1 * rewardValue;

        setTasksValue((prevValue) => prevValue + rewardValue);
        addTotalBal(halfRewardValue);

        const newTaskState = {
          ...prevState[id],
          claimClicked: true,
        };

        saveData({
          tasksValue: tasksValue + rewardValue, // Ensure the latest value is used
          taskStates: {
            ...prevState,
            [id]: newTaskState,
          },
          completedTasks: {
            ...completedTasks,
            [id]: true,
          },
          totalBal: totalBal + halfRewardValue, // Ensure the latest value is used
        }).catch(error => {
          console.error('Error saving user data:', error);
        });

        return {
          ...prevState,
          [id]: newTaskState,
        };
      }

      return prevState;
    });
  };

  useEffect(() => {
    if (userId) {
      saveData({
        tasksValue,
        taskStates,
        completedTasks,
        totalBal,
      }).catch(error => {
        console.error('Error saving user data:', error);
      });
    }
  }, [tasksValue, taskStates, completedTasks, totalBal]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col justify-between bg-cover bg-center">
  <div className="text-center">
    <h1 className="text-2xl font-bold">Complete the mission, earn the commission!</h1>
    <p className="text-zinc-400 mt-2">But hey, only qualified actions unlock the Lunar galaxy! ✨</p>
    <div className="w-full rounded-lg p-2 mb-1">
      <p id="T6" className="text-center text-3xl font-bold">
        {tasksValue.toLocaleString()}&nbsp;<span className="text-purple-400">Lunar</span>
      </p>
    </div>
  </div>

  <div className='w-full max-w-md rounded-lg p-4 mb-4 mx-auto'>
    <div className="space-y-4">
      {TasksData && TasksData.map((task) => (
        <TasksCom 
          key={task.id} 
          task={task} 
          showStartButton={!completedTasks[task.id] && taskStates[task.id]?.showStartButton} 
          handleA1Click={() => handleA1Click(task.id)} 
          handleA2Click={() => handleA2Click(task.id)} 
          handleA3Click={() => handleA3Click(task.id)} 
          a3Class={taskStates[task.id]?.a3Class} 
          a3Text={taskStates[task.id]?.a3Text} 
        />
      ))}
    </div>
  </div>

  <div className="w-full bg-zinc-800 py-2 fixed bottom-0 left-0">
    <Footer />
  </div>
</div>


  );
};

export default Tasks;
