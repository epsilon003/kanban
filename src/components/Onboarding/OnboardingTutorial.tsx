import React, { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

interface OnboardingTutorialProps {
  userId: string;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ userId }) => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Check if user has seen the tutorial
    const hasSeenTutorial = localStorage.getItem(`tutorial-seen-${userId}`);
    
    if (!hasSeenTutorial) {
      // Wait a bit before starting the tutorial
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [userId]);

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div>
          <h2 className="text-xl font-bold mb-2">Welcome to Your Kanban Board! 👋</h2>
          <p>Let's take a quick tour to help you get started. This will only take a minute!</p>
        </div>
      ),
      placement: 'center',
    },
    {
      target: '[data-tour="columns"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Your Columns</h3>
          <p>Tasks move through different stages: To Do → In Progress → Review → Done</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="add-task"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Add New Tasks</h3>
          <p>Click "Add Task" at the bottom of any column to create a new task.</p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="task-card"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Task Cards</h3>
          <p>Click on any task to edit it, or drag it to move between columns!</p>
        </div>
      ),
      placement: 'right',
      disableBeacon: true,
    },
    {
      target: '[data-tour="dark-mode"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Dark Mode 🌙</h3>
          <p>Toggle between light and dark themes. Your preference is saved automatically.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="user-menu"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Your Account</h3>
          <p>Access your profile and sign out from here.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: 'body',
      content: (
        <div>
          <h2 className="text-xl font-bold mb-2">You're All Set! 🎉</h2>
          <p>Start organizing your tasks and boost your productivity!</p>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Tip: All your changes are automatically saved to the cloud.
          </p>
        </div>
      ),
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      // Mark tutorial as seen
      localStorage.setItem(`tutorial-seen-${userId}`, 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#0ea5e9',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
        },
        buttonNext: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: 14,
        },
        buttonBack: {
          marginRight: 8,
          color: '#71717a',
        },
        buttonSkip: {
          color: '#71717a',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tutorial',
      }}
    />
  );
};