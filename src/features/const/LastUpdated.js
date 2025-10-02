import { useState, useEffect } from 'react';

const LastUpdated = () => {
  const [lastUpdated] = useState(new Date());
  const [timeAgo, setTimeAgo] = useState('recently');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diffInMs = now - lastUpdated;
      const diffInMinutes = Math.floor(diffInMs / 60000);

      if (diffInMinutes < 1) {
        setTimeAgo('recently');
      } else {
        setTimeAgo(`${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <div style={{float: 'right', paddingTop: '2vh'}}>
      <span>Last updated: {timeAgo}</span>
    </div>
  );
};

export default LastUpdated;