import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotification } from '../../store/notificationSlice';

const Notification = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  const colors = {
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
  };

  return (
    <div className={`fixed top-4 right-4 px-4 py-3 rounded border ${colors[notification.type]} shadow-lg z-50`}>
      <p className="text-sm">{notification.message}</p>
    </div>
  );
};

export default Notification;