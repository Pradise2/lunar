import React, { useState, useEffect } from 'react';
import TasksCom from '../Component/TasksCom';
import TasksData from '../Component/TasksData';
import { useTotalBal } from '../Context/TotalBalContext';
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Footer from "../Component/Footer";

const Tasks = () => {
  const { addTotalBal } = useTotalBal();
  const [t6Value, setT6Value] = useState(0);
  const [taskStates, setTaskStates] = useState({});
  const [userId, setUserId] = useState(null);

  window.Telegram.WebApp.expand();

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
      } else {
        alert('User data is not available.');
      }
    } else {
      alert('Telegram WebApp script is not loaded.');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const userDocRef = doc(db, 'Game', String(userId));
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setT6Value(data.t6Value ?? 0);
            setTaskStates(data.taskStates ?? {});
          } else {
            await setDoc(userDocRef, { t6Value: 0, taskStates: {} });
          }
        } catch (error) {
          alert('Error fetching task data: ' + error.message);
          console.log('Error fetching task data:', error);
        }
      }
    };

    fetchData();
  }, [userId]);

  const saveTaskData = async (updatedTaskStates) => {
    if (userId) {
      const dataToSave = {
        t6Value,
        taskStates: updatedTaskStates,
      };
      try {
        const userDocRef = doc(db, 'Game', String(userId));
        await setDoc(userDocRef, dataToSave, { merge: true });
      } catch (error) {
        alert('Error saving task data to Firestore: ' + error.message);
        console.log('Error saving task data:', error);
      }
    }
  };

  const handleA1Click = (id) => {
    setTaskStates((prevState) => {
      const updatedTaskStates = {
        ...prevState,
        [id]: {
          ...prevState[id],
          showStartButton: false,
          a3Text: 'Check',
          a3Class: 'bg-purple-500',
        },
      };
      saveTaskData(updatedTaskStates);
      return updatedTaskStates;
    });
  };

  const handleA2Click = (id) => {
    setTaskStates((prevState) => {
      const updatedTaskStates = {
        ...prevState,
        [id]: {
          ...prevState[id],
          a3Class: 'bg-blue-500',
        },
      };
      saveTaskData(updatedTaskStates);
      return updatedTaskStates;
    });
  };

  const handleA3Click = (id) => {
    setTaskStates((prevState) => {
      const taskState = prevState[id];
      if (taskState.a3Class === 'bg-blue-500' && taskState.a3Text !== 'Claim') {
        setTimeout(() => {
          setTaskStates((prevState) => {
            const updatedTaskStates = {
              ...prevState,
              [id]: {
                ...prevState[id],
                a3Text: 'Claim',
              },
            };
            saveTaskData(updatedTaskStates);
            return updatedTaskStates;
          });
        }, 10000);
      } else if (taskState.a3Text === 'Claim' && !taskState.claimClicked) {
        const task = TasksData.find(task => task.id === id);
        const rewardValue = parseInt(task.reward.replace(/\D/g, ''), 10);
        addTotalBal(rewardValue, 'task');
        setT6Value((prevValue) => prevValue + rewardValue);
        const updatedTaskStates = {
          ...prevState,
          [id]: {
            ...prevState[id],
            claimClicked: true,
          },
        };
        saveTaskData(updatedTaskStates);
        return updatedTaskStates;
      }
      return prevState;
    });
  };

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

      <div className='justify-around w-full max-w-md rounded-lg p-4 mb-4'>
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
